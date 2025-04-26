import os
import logging
import uuid
from datetime import datetime
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import json
from validators import validate_worker_data, validate_job_data
from models import db, Worker, Job

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

# Enable CORS for all routes
CORS(app)

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
        'main': "Welcome to GigWorker Match. This page has four big buttons. The blue button on top is for applying to a job. The purple button below it is for posting a job. The light blue buttons are for viewing workers and job listings.",
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
                {'text': 'Click "View Jobs" to see available jobs', 'icon': 'work-icon'}
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
        }
    }
    
    # Get the guide for the requested page
    guide = guides.get(page, {
        'title': 'Website Guide',
        'steps': [{'text': 'Use the buttons to navigate', 'icon': 'help-icon'}]
    })
    
    return jsonify(guide)

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
