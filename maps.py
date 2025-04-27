import os
import requests
import json
import logging
from math import radians, cos, sin, asin, sqrt

# Configure logging
logger = logging.getLogger(__name__)

# Google Maps API Key
GOOGLE_MAPS_API_KEY = os.environ.get('GOOGLE_MAPS_API_KEY')

def geocode_address(address):
    """
    Convert an address to latitude and longitude coordinates
    
    Args:
        address (str): The address to geocode
        
    Returns:
        dict: Dictionary with lat, lng keys or None if geocoding failed
    """
    try:
        url = f"https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={GOOGLE_MAPS_API_KEY}"
        response = requests.get(url)
        data = response.json()
        
        if data['status'] == 'OK':
            location = data['results'][0]['geometry']['location']
            return {
                'lat': location['lat'],
                'lng': location['lng'],
                'formatted_address': data['results'][0]['formatted_address']
            }
        else:
            logger.error(f"Geocoding error: {data['status']} for address: {address}")
            return None
    except Exception as e:
        logger.error(f"Error geocoding address: {str(e)}")
        return None

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    
    Args:
        lat1, lon1: Coordinates of point 1
        lat2, lon2: Coordinates of point 2
        
    Returns:
        float: Distance in kilometers
    """
    # Convert decimal degrees to radians
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    
    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    r = 6371  # Radius of earth in kilometers
    
    return c * r

def find_nearby_jobs(user_location, jobs, max_distance=50):
    """
    Find jobs near a user's location within a maximum distance
    
    Args:
        user_location (dict): Dictionary with lat, lng keys of user's location
        jobs (list): List of job dictionaries
        max_distance (float): Maximum distance in kilometers to consider a job as nearby
        
    Returns:
        list: List of job dictionaries with distance added, sorted by proximity
    """
    try:
        if not user_location or 'lat' not in user_location or 'lng' not in user_location:
            logger.error(f"Invalid user location: {user_location}")
            return []
        
        nearby_jobs = []
        
        for job in jobs:
            # Skip jobs without location
            if not job.get('location'):
                continue
                
            # Get coordinates for job location
            job_coords = geocode_address(job['location'])
            
            if job_coords:
                # Calculate distance
                distance = haversine_distance(
                    user_location['lat'], user_location['lng'],
                    job_coords['lat'], job_coords['lng']
                )
                
                # Add distance and coordinates to job
                job_with_distance = job.copy()
                job_with_distance['distance'] = round(distance, 2)
                job_with_distance['coords'] = job_coords
                
                # Add to nearby jobs if within max_distance
                if distance <= max_distance:
                    nearby_jobs.append(job_with_distance)
        
        # Sort by distance
        nearby_jobs.sort(key=lambda x: x['distance'])
        
        return nearby_jobs
    except Exception as e:
        logger.error(f"Error finding nearby jobs: {str(e)}")
        return []

def generate_map_url(center_lat, center_lng, markers):
    """
    Generate a static Google Maps URL with markers
    
    Args:
        center_lat, center_lng: Center coordinates for the map
        markers (list): List of dictionaries with lat, lng, and label
        
    Returns:
        str: URL for a static Google Maps image
    """
    try:
        base_url = "https://maps.googleapis.com/maps/api/staticmap"
        
        # Set map parameters
        params = {
            "center": f"{center_lat},{center_lng}",
            "zoom": "11",
            "size": "600x400",
            "maptype": "roadmap",
            "key": GOOGLE_MAPS_API_KEY
        }
        
        # Add markers
        for i, marker in enumerate(markers):
            if i == 0:  # User location
                params[f"markers"] = f"color:blue|label:U|{marker['lat']},{marker['lng']}"
            else:  # Job locations
                params[f"markers{i}"] = f"color:red|label:{i}|{marker['lat']},{marker['lng']}"
        
        # Build URL
        url_parts = [f"{base_url}?"]
        for key, value in params.items():
            url_parts.append(f"{key}={value}&")
        
        return "".join(url_parts)[:-1]  # Remove trailing &
    except Exception as e:
        logger.error(f"Error generating map URL: {str(e)}")
        return None