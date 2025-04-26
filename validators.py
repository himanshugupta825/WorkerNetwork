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

def validate_registration_data(data):
    """
    Validate user registration data
    Returns None if valid, error message if invalid
    """
    # Required fields
    required_fields = ["username", "email", "password", "confirm_password"]
    
    # Check for required fields
    for field in required_fields:
        if field not in data or not data[field]:
            return f"Missing required field: {field}"
    
    # Validate username (should be string)
    if not isinstance(data["username"], str):
        return "Username must be a string"
    
    # Username should have reasonable length
    if len(data["username"]) < 3 or len(data["username"]) > 100:
        return "Username must be between 3 and 100 characters"
    
    # Validate email (basic format check)
    if not isinstance(data["email"], str):
        return "Email must be a string"
    
    # Check if email contains @ and .
    if "@" not in data["email"] or "." not in data["email"].split("@")[1]:
        return "Invalid email format"
    
    # Validate password (should be string)
    if not isinstance(data["password"], str):
        return "Password must be a string"
    
    # Password should have reasonable length
    if len(data["password"]) < 8:
        return "Password must be at least 8 characters long"
    
    # Check if passwords match
    if data["password"] != data["confirm_password"]:
        return "Passwords do not match"
    
    # Validate user type (optional)
    if "user_type" in data:
        valid_types = ["worker", "employer", "both"]
        if data["user_type"] not in valid_types:
            return f"User type must be one of: {', '.join(valid_types)}"
    
    # If we get here, the data is valid
    return None
    
def validate_login_data(data):
    """
    Validate user login data
    Returns None if valid, error message if invalid
    """
    # Required fields
    required_fields = ["email", "password"]
    
    # Check for required fields
    for field in required_fields:
        if field not in data or not data[field]:
            return f"Missing required field: {field}"
    
    # Validate email (should be string)
    if not isinstance(data["email"], str):
        return "Email must be a string"
    
    # Check if email contains @ and .
    if "@" not in data["email"] or "." not in data["email"].split("@")[1]:
        return "Invalid email format"
    
    # Validate password (should be string)
    if not isinstance(data["password"], str):
        return "Password must be a string"
    
    # If we get here, the data is valid
    return None