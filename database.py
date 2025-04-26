import json
import os
import uuid
import logging
from datetime import datetime

# Set up logging
logger = logging.getLogger(__name__)

# Constants
STORAGE_FILE = "data/storage.json"
DATA_DIR = "data"

def initialize_database():
    """Initialize the database file if it doesn't exist"""
    # Create the data directory if it doesn't exist
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
    
    # Create the storage file with initial structure if it doesn't exist
    if not os.path.exists(STORAGE_FILE):
        initial_data = {
            "workers": [],
            "jobs": []
        }
        with open(STORAGE_FILE, 'w') as f:
            json.dump(initial_data, f, indent=2)
        logger.info(f"Created database file at {STORAGE_FILE}")

def load_data():
    """Load data from the JSON storage file"""
    try:
        with open(STORAGE_FILE, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError) as e:
        logger.error(f"Error loading database: {str(e)}")
        # If there's an error, initialize with empty structure
        return {"workers": [], "jobs": []}

def save_data(data):
    """Save data to the JSON storage file"""
    with open(STORAGE_FILE, 'w') as f:
        json.dump(data, f, indent=2)

def save_worker_data(worker_data):
    """Save worker application data to the database"""
    data = load_data()
    
    # Generate a unique ID for the worker
    worker_id = str(uuid.uuid4())
    
    # Add timestamp
    worker_data["id"] = worker_id
    worker_data["created_at"] = datetime.now().isoformat()
    
    # Add to workers list
    data["workers"].append(worker_data)
    
    # Save updated data
    save_data(data)
    logger.info(f"Saved worker data with ID: {worker_id}")
    
    return worker_id

def save_job_data(job_data):
    """Save job posting data to the database"""
    data = load_data()
    
    # Generate a unique ID for the job
    job_id = str(uuid.uuid4())
    
    # Add metadata
    job_data["id"] = job_id
    job_data["created_at"] = datetime.now().isoformat()
    job_data["status"] = "open"  # Default status for new jobs
    
    # Add to jobs list
    data["jobs"].append(job_data)
    
    # Save updated data
    save_data(data)
    logger.info(f"Saved job data with ID: {job_id}")
    
    return job_id
