"""
Weather Service
Fetches real-time weather data from WeatherAPI
"""

import requests
from datetime import datetime
from config import WEATHER_API_KEY, WEATHER_API_URL


def fetch_weather_data(city: str) -> dict:
    """
    Fetch current weather data for a given city
    
    Args:
        city (str): Name of the city
        
    Returns:
        dict: Weather data with features required for ML models
        
    Raises:
        Exception: If API call fails or data is invalid
    """
    try:
        # Prepare API request
        params = {
            "key": WEATHER_API_KEY,
            "q": city,
            "aqi": "no"  # We don't need air quality data
        }
        
        # Make API request with timeout
        response = requests.get(WEATHER_API_URL, params=params, timeout=10)
        
        # Check for HTTP errors
        response.raise_for_status()
        
        # Parse JSON response
        data = response.json()
        
        # Extract weather features
        current = data.get("current", {})
        
        # Get current time for time-based features
        now = datetime.now()
        
        # Build weather data dictionary
        weather_data = {
            # Weather features from API
            "temperature": current.get("temp_c", 0.0),
            "wind_speed": current.get("wind_kph", 0.0),
            "humidity": current.get("humidity", 0.0),
            "atmospheric_pressure": current.get("pressure_mb", 0.0),
            
            # Solar irradiance (DNI - Direct Normal Irradiance)
            # Note: WeatherAPI may not provide DNI directly, using UV index as proxy
            # In production, use a dedicated solar API or calculate from cloud cover
            "solar_irradiance": current.get("uv", 0.0) * 100,  # Scaled UV index
            
            # Time-based features generated in backend
            "hour_of_day": now.hour,
            "day_of_week": now.weekday(),  # 0=Monday, 6=Sunday
            
            # Additional metadata
            "city": city,
            "timestamp": now.isoformat()
        }
        
        return weather_data
        
    except requests.exceptions.ConnectionError:
        raise Exception("Failed to connect to WeatherAPI. Please check your internet connection.")
    
    except requests.exceptions.Timeout:
        raise Exception("WeatherAPI request timed out. Please try again.")
    
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 400:
            raise Exception(f"Invalid city name: {city}. Please check the spelling.")
        elif e.response.status_code == 401:
            raise Exception("WeatherAPI authentication failed. Please check your API key.")
        elif e.response.status_code == 403:
            raise Exception("WeatherAPI access forbidden. Your API key may have exceeded its quota.")
        else:
            raise Exception(f"WeatherAPI error: {e.response.status_code}")
    
    except KeyError as e:
        raise Exception(f"Unexpected WeatherAPI response format. Missing key: {str(e)}")
    
    except Exception as e:
        raise Exception(f"Weather service error: {str(e)}")


def get_weather_features(city: str) -> dict:
    """
    Public interface to get weather features for predictions
    
    Args:
        city (str): Name of the city
        
    Returns:
        dict: Weather features ready for ML model input
    """
    return fetch_weather_data(city)
