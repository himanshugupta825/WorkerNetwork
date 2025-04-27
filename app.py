import os
import logging
import uuid
from datetime import datetime
from flask import Flask, request, jsonify, render_template, send_file, session, redirect, url_for, flash
from flask_cors import CORS
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
import json
from validators import validate_worker_data, validate_job_data, validate_registration_data, validate_login_data
from models import db, Worker, Job, User
import voice_search
import maps

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Initialize the Flask application
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET")

# Configure the database
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize the database
db.init_app(app)

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# User loader callback for Flask-Login
@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

# Enable CORS for all routes
CORS(app)

# Google Maps API Key
GOOGLE_MAPS_API_KEY = os.environ.get('GOOGLE_MAPS_API_KEY')

# Create database tables
with app.app_context():
    db.create_all()

@app.route('/', methods=['GET'])
def index():
    """Main route to serve the frontend"""
    return render_template('index.html')

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint to check if the API is running"""
    return jsonify({"status": "ok", "message": "API is running"}), 200

@app.route('/apply', methods=['POST'])
def apply():
    """Endpoint for workers to apply with their information"""
    try:
        # Get data from request
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Validate the worker data
        validation_result = validate_worker_data(data)
        if validation_result:
            return jsonify({"error": validation_result}), 400
        
        # Create a new worker instance
        worker_id = str(uuid.uuid4())
        new_worker = Worker(
            id=worker_id,
            name=data.get('name'),
            phone=data.get('phone'),
            skill=data.get('skill'),
            location=data.get('location'),
            experience=data.get('experience'),
            education=data.get('education'),
            created_at=datetime.utcnow()
        )
        
        # Save to database
        db.session.add(new_worker)
        db.session.commit()
        
        logger.info(f"Saved worker data with ID: {worker_id}")
        
        return jsonify({
            "message": "Worker data saved successfully",
            "worker_id": worker_id
        }), 201
    
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON format"}), 400
    except Exception as e:
        logger.error(f"Error processing worker application: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "An error occurred while processing your request"}), 500

@app.route('/post-job', methods=['POST'])
def post_job():
    """Endpoint for employers to post job information"""
    try:
        # Get data from request
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Validate the job data
        validation_result = validate_job_data(data)
        if validation_result:
            return jsonify({"error": validation_result}), 400
        
        # Create a new job instance
        job_id = str(uuid.uuid4())
        new_job = Job(
            id=job_id,
            business_name=data.get('business_name'),
            job_role=data.get('job_role'),
            payment=data.get('payment'),
            contact_number=data.get('contact_number'),
            location=data.get('location'),
            job_description=data.get('job_description'),
            status='open',
            created_at=datetime.utcnow()
        )
        
        # Save to database
        db.session.add(new_job)
        db.session.commit()
        
        logger.info(f"Saved job data with ID: {job_id}")
        
        return jsonify({
            "message": "Job posted successfully",
            "job_id": job_id
        }), 201
    
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON format"}), 400
    except Exception as e:
        logger.error(f"Error processing job posting: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "An error occurred while processing your request"}), 500

# Endpoint to get all workers
@app.route('/workers', methods=['GET'])
def get_workers():
    """Get all worker profiles"""
    try:
        workers = Worker.query.order_by(Worker.created_at.desc()).all()
        return jsonify({
            "message": "Workers retrieved successfully",
            "count": len(workers),
            "workers": [worker.to_dict() for worker in workers]
        }), 200
    except Exception as e:
        logger.error(f"Error retrieving workers: {str(e)}")
        return jsonify({"error": "An error occurred while retrieving workers"}), 500

# Endpoint to get all jobs
@app.route('/jobs', methods=['GET'])
def get_jobs():
    """Get all job listings"""
    try:
        # Check if there are search query or location parameters
        search_query = request.args.get('query', '')
        search_location = request.args.get('location', '')
        
        # Build the query based on the parameters
        query = Job.query
        
        # Add search term filter if provided
        if search_query:
            search_term = f"%{search_query}%"
            query = query.filter(
                db.or_(
                    Job.job_role.ilike(search_term),
                    Job.business_name.ilike(search_term),
                    Job.job_description.ilike(search_term)
                )
            )
        
        # Add location filter if provided and not 'All Locations'
        if search_location and search_location != 'All Locations':
            location_term = f"%{search_location}%"
            query = query.filter(Job.location.ilike(location_term))
        
        # Execute the query with ordering
        jobs = query.order_by(Job.created_at.desc()).all()
        
        # Log the search
        if search_query or search_location:
            log_message = f"Search - Query: '{search_query}'"
            if search_location:
                log_message += f", Location: '{search_location}'"
            log_message += f" - Found {len(jobs)} matching jobs"
            logger.info(log_message)
        else:
            # Get all jobs from the database if no search params
            jobs = Job.query.order_by(Job.created_at.desc()).all()
            
        return jsonify({
            "message": "Jobs retrieved successfully",
            "count": len(jobs),
            "jobs": [job.to_dict() for job in jobs]
        }), 200
    except Exception as e:
        logger.error(f"Error retrieving jobs: {str(e)}")
        return jsonify({"error": "An error occurred while retrieving jobs"}), 500

# Voice assistance route
@app.route('/voice-guide/<page>', methods=['GET'])
def voice_guide(page):
    """Generate voice guidance based on current page"""
    import pyttsx3
    import tempfile
    import os
    from flask import send_file
    
    # Define voice instructions for each page
    instructions = {
        'main': "Welcome to GigWorkers. This page has four big buttons. The blue button on top is for applying to a job. The purple button below it is for posting a job. The light blue buttons are for viewing workers and job listings.",
        'apply': "This is the job application form. Fill in your name, phone number, skill, and location. You can also add your experience and education if you want. Then press the red Submit button at the bottom.",
        'post-job': "This is the job posting form. Fill in your business name, the job you're offering, payment details, and your contact number. You can also add job location and description if you want. Then press the red Post Job button at the bottom.",
        'workers': "This page shows all available workers. Each box contains a worker's details including their name, skills, location, experience, education, and contact information.",
        'jobs': "This page shows all available jobs. Each box contains job details including the role, business name, payment, location, description, and contact information."
    }
    
    # Get the instruction for the requested page
    instruction = instructions.get(page, "Welcome to our website. Please navigate using the buttons.")
    
    # Initialize the text-to-speech engine
    engine = pyttsx3.init()
    
    # Create a temporary file to store the audio
    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as tmp_file:
        temp_filename = tmp_file.name
    
    # Save the speech as an audio file
    engine.save_to_file(instruction, temp_filename)
    engine.runAndWait()
    
    # Return the audio file
    return send_file(temp_filename, mimetype='audio/mpeg', as_attachment=True, 
                    download_name=f'voice-guide-{page}.mp3')

# Image-based instructions endpoint
@app.route('/visual-guide/<page>', methods=['GET'])
def visual_guide(page):
    """Return visual guide instructions based on page"""
    guides = {
        'main': {
            'title': 'Home Page Guide',
            'steps': [
                {'text': 'Click "Apply for a Job" if you want to find work', 'icon': 'search-icon'},
                {'text': 'Click "Post a Job" if you want to hire someone', 'icon': 'create-icon'},
                {'text': 'Click "View Workers" to see available workers', 'icon': 'people-icon'},
                {'text': 'Click "View Jobs" to see available jobs', 'icon': 'work-icon'},
                {'text': 'Try the voice search by clicking the microphone icon', 'icon': 'mic-icon'}
            ]
        },
        'apply': {
            'title': 'Application Guide',
            'steps': [
                {'text': 'Fill in your name', 'icon': 'user-icon'},
                {'text': 'Enter your phone number', 'icon': 'phone-icon'},
                {'text': 'Enter your main skill', 'icon': 'skill-icon'},
                {'text': 'Enter your location', 'icon': 'location-icon'},
                {'text': 'Click the Submit button when done', 'icon': 'send-icon'}
            ]
        },
        'post-job': {
            'title': 'Post Job Guide',
            'steps': [
                {'text': 'Enter your business name', 'icon': 'business-icon'},
                {'text': 'Enter the job role', 'icon': 'role-icon'},
                {'text': 'Enter payment details', 'icon': 'money-icon'},
                {'text': 'Enter your contact number', 'icon': 'phone-icon'},
                {'text': 'Click the Post Job button when done', 'icon': 'send-icon'}
            ]
        },
        'voice-search': {
            'title': 'Voice Search Guide',
            'steps': [
                {'text': 'Click the microphone button and speak clearly', 'icon': 'mic-icon'},
                {'text': 'Say what kind of job you are looking for', 'icon': 'work-icon'},
                {'text': 'You can mention location, type of work, or payment', 'icon': 'location-icon'},
                {'text': 'Example: "Find construction jobs in downtown"', 'icon': 'search-icon'},
                {'text': 'Wait for the results to appear', 'icon': 'send-icon'}
            ]
        }
    }
    
    # Get the guide for the requested page
    guide = guides.get(page, {
        'title': 'Website Guide',
        'steps': [{'text': 'Use the buttons to navigate', 'icon': 'help-icon'}]
    })
    
    return jsonify(guide)

# Nearby jobs route
@app.route('/nearby-jobs', methods=['POST'])
def get_nearby_jobs():
    """Get jobs near a specified location"""
    try:
        data = request.get_json()
        
        if not data or 'location' not in data:
            return jsonify({"error": "No location provided"}), 400
            
        location = data['location']
        max_distance = data.get('max_distance', 50)  # Default to 50km radius
        
        logger.info(f"Finding jobs near location: {location}")
        
        # Geocode the location to get coordinates
        user_location = maps.geocode_address(location)
        
        if not user_location:
            return jsonify({"error": "Could not geocode the provided location"}), 400
            
        # Get all jobs from the database
        jobs = Job.query.filter_by(status='open').all()
        jobs_list = [job.to_dict() for job in jobs]
        
        # Find nearby jobs
        nearby_jobs = maps.find_nearby_jobs(user_location, jobs_list, max_distance)
        
        # Generate map URL if there are nearby jobs
        map_url = None
        if nearby_jobs:
            # Prepare markers for map
            markers = [{'lat': user_location['lat'], 'lng': user_location['lng'], 'label': 'You'}]
            
            # Add job markers (limit to first 9 for clarity on map)
            for i, job in enumerate(nearby_jobs[:9]):
                if 'coords' in job:
                    markers.append({
                        'lat': job['coords']['lat'],
                        'lng': job['coords']['lng'],
                        'label': str(i+1)
                    })
            
            # Generate the map URL
            map_url = maps.generate_map_url(user_location['lat'], user_location['lng'], markers)
        
        return jsonify({
            "message": "Nearby jobs found",
            "user_location": user_location,
            "count": len(nearby_jobs),
            "nearby_jobs": nearby_jobs,
            "map_url": map_url
        }), 200
        
    except Exception as e:
        logger.error(f"Error finding nearby jobs: {str(e)}")
        return jsonify({"error": "An error occurred while finding nearby jobs"}), 500

# Voice search route
@app.route('/voice-search', methods=['POST'])
def process_voice_search():
    """Process voice command and return matching jobs"""
    try:
        data = request.get_json()
        
        if not data or 'voice_command' not in data:
            return jsonify({"error": "No voice command provided"}), 400
            
        voice_command = data['voice_command']
        logger.info(f"Received voice command: {voice_command}")
        
        # Extract search criteria from voice command
        search_criteria = voice_search.extract_job_search_criteria(voice_command)
        logger.info(f"Extracted search criteria: {search_criteria}")
        
        # Get all jobs from the database
        jobs = Job.query.filter_by(status='open').all()
        jobs_list = [job.to_dict() for job in jobs]
        
        # Filter jobs based on the search criteria
        filtered_jobs = voice_search.filter_jobs_by_criteria(jobs_list, search_criteria)
        
        # Generate voice response
        voice_response = voice_search.generate_voice_response(filtered_jobs, search_criteria)
        
        return jsonify({
            "message": "Voice search processed successfully",
            "voice_response": voice_response,
            "matched_jobs": filtered_jobs,
            "total_matches": len(filtered_jobs),
            "search_criteria": search_criteria
        }), 200
        
    except Exception as e:
        logger.error(f"Error processing voice search: {str(e)}")
        return jsonify({"error": "An error occurred while processing your voice search"}), 500

# Voice response audio route
@app.route('/voice-response', methods=['POST'])
def generate_voice_response_audio():
    """Generate audio file from voice response text"""
    try:
        import pyttsx3
        import tempfile
        
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({"error": "No response text provided"}), 400
            
        response_text = data['text']
        
        # Initialize the text-to-speech engine
        engine = pyttsx3.init()
        
        # Create a temporary file to store the audio
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as tmp_file:
            temp_filename = tmp_file.name
        
        # Save the speech as an audio file
        engine.save_to_file(response_text, temp_filename)
        engine.runAndWait()
        
        # Return the audio file
        return send_file(temp_filename, mimetype='audio/mpeg', as_attachment=True, 
                       download_name='voice-response.mp3')
                       
    except Exception as e:
        logger.error(f"Error generating voice response audio: {str(e)}")
        return jsonify({"error": "An error occurred while generating voice response"}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Resource not found"}), 404

@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({"error": "Method not allowed"}), 405

@app.errorhandler(500)
def server_error(error):
    return jsonify({"error": "Internal server error"}), 500

# User registration route
@app.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Validate registration data
        validation_result = validate_registration_data(data)
        if validation_result:
            return jsonify({"error": validation_result}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({"error": "A user with this email already exists"}), 400
        
        existing_username = User.query.filter_by(username=data['username']).first()
        if existing_username:
            return jsonify({"error": "Username already taken"}), 400
        
        # Create new user
        user_id = str(uuid.uuid4())
        new_user = User(
            id=user_id,
            username=data['username'],
            email=data['email'],
            created_at=datetime.utcnow()
        )
        
        # Set password
        new_user.set_password(data['password'])
        
        # Set user type
        user_type = data.get('user_type', 'both')
        if user_type == 'worker':
            new_user.is_worker = True
        elif user_type == 'employer':
            new_user.is_employer = True
        elif user_type == 'both':
            new_user.is_worker = True
            new_user.is_employer = True
        
        # Save to database
        db.session.add(new_user)
        db.session.commit()
        
        # Log in the user
        login_user(new_user)
        
        logger.info(f"User registered with ID: {user_id}")
        
        return jsonify({
            "message": "User registered successfully",
            "user_id": user_id,
            "username": new_user.username
        }), 201
        
    except Exception as e:
        logger.error(f"Error registering user: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "An error occurred while registering"}), 500

# User login route
@app.route('/login', methods=['POST'])
def login():
    """Log in a user"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Validate login data
        validation_result = validate_login_data(data)
        if validation_result:
            return jsonify({"error": validation_result}), 400
        
        # Find user by email
        user = User.query.filter_by(email=data['email']).first()
        
        # Check if user exists and password is correct
        if not user or not user.check_password(data['password']):
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Log in the user
        login_user(user)
        
        logger.info(f"User logged in: {user.username}")
        
        return jsonify({
            "message": "Login successful",
            "user_id": user.id,
            "username": user.username,
            "is_worker": user.is_worker,
            "is_employer": user.is_employer
        }), 200
        
    except Exception as e:
        logger.error(f"Error logging in user: {str(e)}")
        return jsonify({"error": "An error occurred while logging in"}), 500

# User logout route
@app.route('/logout', methods=['POST'])
@login_required
def logout():
    """Log out a user"""
    try:
        username = current_user.username
        logout_user()
        logger.info(f"User logged out: {username}")
        return jsonify({"message": "Logout successful"}), 200
    except Exception as e:
        logger.error(f"Error logging out user: {str(e)}")
        return jsonify({"error": "An error occurred while logging out"}), 500

# Get current user info
@app.route('/user', methods=['GET'])
@login_required
def get_current_user():
    """Get current logged-in user info"""
    try:
        return jsonify({
            "message": "User info retrieved successfully",
            "user": current_user.to_dict()
        }), 200
    except Exception as e:
        logger.error(f"Error retrieving user info: {str(e)}")
        return jsonify({"error": "An error occurred while retrieving user info"}), 500
