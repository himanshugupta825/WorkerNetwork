def validate_worker_data(data):
    """
    Validate worker application data
    Returns None if valid, error message if invalid
    """
    # Required fields
    required_fields = ["name", "phone", "skill", "location"]
    
    # Check for required fields
    for field in required_fields:
        if field not in data or not data[field]:
            return f"Missing required field: {field}"
    
    # Validate name (should be string)
    if not isinstance(data["name"], str):
        return "Name must be a string"
    
    # Name should have reasonable length
    if len(data["name"]) < 2 or len(data["name"]) > 100:
        return "Name must be between 2 and 100 characters"
    
    # Validate phone (basic format check)
    phone = str(data["phone"])
    if not phone.replace("+", "").replace("-", "").replace(" ", "").isdigit():
        return "Phone number must contain only digits, spaces, hyphens, or '+'"
    
    # Validate skill (should be string)
    if not isinstance(data["skill"], str):
        return "Skill must be a string"
    
    # Skill should have reasonable length
    if len(data["skill"]) < 2 or len(data["skill"]) > 100:
        return "Skill must be between 2 and 100 characters"
    
    # Validate location (should be string)
    if not isinstance(data["location"], str):
        return "Location must be a string"
    
    # Location should have reasonable length
    if len(data["location"]) < 2 or len(data["location"]) > 100:
        return "Location must be between 2 and 100 characters"
    
    # Additional optional fields can be validated here
    
    # If we get here, the data is valid
    return None

def validate_job_data(data):
    """
    Validate job posting data
    Returns None if valid, error message if invalid
    """
    # Required fields
    required_fields = ["business_name", "job_role", "payment", "contact_number"]
    
    # Check for required fields
    for field in required_fields:
        if field not in data or not data[field]:
            return f"Missing required field: {field}"
    
    # Validate business name (should be string)
    if not isinstance(data["business_name"], str):
        return "Business name must be a string"
    
    # Business name should have reasonable length
    if len(data["business_name"]) < 2 or len(data["business_name"]) > 100:
        return "Business name must be between 2 and 100 characters"
    
    # Validate job role (should be string)
    if not isinstance(data["job_role"], str):
        return "Job role must be a string"
    
    # Job role should have reasonable length
    if len(data["job_role"]) < 2 or len(data["job_role"]) > 100:
        return "Job role must be between 2 and 100 characters"
    
    # Validate payment (can be string, number, or object with detailed info)
    if isinstance(data["payment"], (int, float)):
        # If payment is a number, it should be positive
        if data["payment"] <= 0:
            return "Payment amount must be positive"
    elif isinstance(data["payment"], str):
        # If payment is a string, it should have reasonable length
        if len(data["payment"]) < 1 or len(data["payment"]) > 100:
            return "Payment description must be between 1 and 100 characters"
    elif isinstance(data["payment"], dict):
        # If payment is an object, ensure it has required fields
        if "amount" not in data["payment"]:
            return "Payment object must include an amount"
    else:
        return "Payment must be a string, number, or object"
    
    # Validate contact number (basic format check)
    contact = str(data["contact_number"])
    if not contact.replace("+", "").replace("-", "").replace(" ", "").isdigit():
        return "Contact number must contain only digits, spaces, hyphens, or '+'"
    
    # Additional optional fields can be validated here
    
    # If we get here, the data is valid
    return None
