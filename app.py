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
