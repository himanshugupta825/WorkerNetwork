import os
import json
import logging
from openai import OpenAI

# the newest OpenAI model is "gpt-4o" which was released May 13, 2024.
# do not change this unless explicitly requested by the user
MODEL = "gpt-4o"

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize OpenAI client
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

def extract_job_search_criteria(voice_input):
    """
    Extract job search criteria from natural language voice input
    
    Args:
        voice_input (str): Natural language input from user
        
    Returns:
        dict: Dictionary with extracted search criteria
    """
    prompt = f"""
    Extract job search criteria from this voice command: "{voice_input}"
    
    Focus on extracting these key elements if they exist in the input:
    - job role/type (e.g., "construction", "cleaning", "driver")
    - location (e.g., "downtown", "north side", "nearby")
    - payment preference (e.g., "high paying", "at least $15/hour")
    - business type (e.g., "restaurant", "factory", "office")
    
    Return ONLY a JSON object with these fields (leave empty if not mentioned):
    {{
        "job_role": "",
        "location": "",
        "payment": "",
        "business_type": ""
    }}
    
    If the user doesn't specify one of these criteria, leave that field empty.
    """
    
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": "You extract job search criteria from natural language input."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        # Extract and parse the JSON response
        result = json.loads(response.choices[0].message.content)
        logger.info(f"Extracted search criteria: {result}")
        return result
    
    except Exception as e:
        logger.error(f"Error extracting search criteria: {str(e)}")
        # Return empty criteria in case of error
        return {
            "job_role": "",
            "location": "",
            "payment": "",
            "business_type": ""
        }

def filter_jobs_by_criteria(jobs, criteria):
    """
    Filter jobs based on extracted criteria
    
    Args:
        jobs (list): List of job dictionaries
        criteria (dict): Search criteria from voice command
        
    Returns:
        list: Filtered list of jobs matching criteria
    """
    filtered_jobs = []
    
    # If no criteria specified, return all jobs
    if not any(criteria.values()):
        return jobs
    
    for job in jobs:
        match = True
        
        # Check job role match
        if criteria.get("job_role") and criteria["job_role"].strip():
            if criteria["job_role"].lower() not in job["job_role"].lower():
                match = False
                
        # Check location match
        if criteria.get("location") and criteria["location"].strip():
            if not job.get("location") or criteria["location"].lower() not in job["location"].lower():
                match = False
                
        # Check payment match - this is more complex and could be improved
        if criteria.get("payment") and criteria["payment"].strip():
            if not job.get("payment") or criteria["payment"].lower() not in job["payment"].lower():
                match = False
                
        # Check business type match
        if criteria.get("business_type") and criteria["business_type"].strip():
            if not job.get("business_name") or criteria["business_type"].lower() not in job["business_name"].lower():
                match = False
        
        if match:
            filtered_jobs.append(job)
    
    return filtered_jobs

def generate_voice_response(filtered_jobs, criteria):
    """
    Generate a natural language response based on the search results
    
    Args:
        filtered_jobs (list): List of jobs matching the criteria
        criteria (dict): The search criteria used
        
    Returns:
        str: Natural language response to be spoken to the user
    """
    
    if not filtered_jobs:
        # No matching jobs found
        criteria_used = []
        for key, value in criteria.items():
            if value:
                readable_key = key.replace("_", " ")
                criteria_used.append(f"{readable_key}: {value}")
        
        if criteria_used:
            criteria_str = ", ".join(criteria_used)
            return f"I couldn't find any jobs matching your search for {criteria_str}. Please try with different terms."
        else:
            return "I couldn't understand your search request. Please try again with specific job details like type, location, or payment."
    
    # Matching jobs found
    if len(filtered_jobs) == 1:
        job = filtered_jobs[0]
        response = f"I found 1 job that matches your search. It's a {job['job_role']} position "
        if job.get('business_name'):
            response += f"at {job['business_name']} "
        if job.get('location'):
            response += f"in {job['location']} "
        if job.get('payment'):
            response += f"paying {job['payment']} "
        return response + ". Would you like to know more details?"
    
    # Multiple jobs found
    summary = []
    for key, value in criteria.items():
        if value:
            readable_key = key.replace("_", " ")
            summary.append(f"{readable_key}: {value}")
    
    if summary:
        criteria_str = ", ".join(summary)
        return f"I found {len(filtered_jobs)} jobs matching your search for {criteria_str}. The jobs include: " + ", ".join([job['job_role'] for job in filtered_jobs[:3]]) + ". Would you like me to list them all?"
    else:
        return f"I found {len(filtered_jobs)} available jobs. Would you like me to list them?"