"""
Input Validation Utilities
Validates API inputs and parameters
"""

from flask import jsonify


def validate_city_parameter(city: str) -> tuple:
    """
    Validate city parameter from request
    
    Args:
        city (str): City name from request parameter
        
    Returns:
        tuple: (is_valid: bool, error_response: dict or None)
    """
    if not city:
        return False, {
            "error": "Missing required parameter",
            "message": "City parameter is required. Usage: /predict?city=<city_name>"
        }
    
    if not isinstance(city, str):
        return False, {
            "error": "Invalid parameter type",
            "message": "City must be a string"
        }
    
    if len(city.strip()) == 0:
        return False, {
            "error": "Invalid parameter value",
            "message": "City name cannot be empty"
        }
    
    if len(city) > 100:
        return False, {
            "error": "Invalid parameter value",
            "message": "City name is too long (max 100 characters)"
        }
    
    return True, None


def create_error_response(error_type: str, message: str, status_code: int = 400):
    """
    Create standardized error response
    
    Args:
        error_type (str): Type of error
        message (str): Error message
        status_code (int): HTTP status code
        
    Returns:
        tuple: (response, status_code)
    """
    return jsonify({
        "error": error_type,
        "message": message
    }), status_code
