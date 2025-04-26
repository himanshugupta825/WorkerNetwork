import os
import logging
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import json
from database import save_worker_data, save_job_data, initialize_database
from validators import validate_worker_data, validate_job_data

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Initialize the Flask application
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET")

# Enable CORS for all routes
CORS(app)

# Initialize database
initialize_database()

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
        
        # Save worker data
        worker_id = save_worker_data(data)
        
        return jsonify({
            "message": "Worker data saved successfully",
            "worker_id": worker_id
        }), 201
    
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON format"}), 400
    except Exception as e:
        logger.error(f"Error processing worker application: {str(e)}")
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
        
        # Save job data
        job_id = save_job_data(data)
        
        return jsonify({
            "message": "Job posted successfully",
            "job_id": job_id
        }), 201
    
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON format"}), 400
    except Exception as e:
        logger.error(f"Error processing job posting: {str(e)}")
        return jsonify({"error": "An error occurred while processing your request"}), 500

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
