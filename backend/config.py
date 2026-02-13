"""
Configuration file for Rural Microgrid Backend
Stores all constants and API keys
"""

# WeatherAPI Configuration
WEATHER_API_KEY = "dfb6aec282054230a2a130500261202"  # Replace with actual API key
WEATHER_API_URL = "http://api.weatherapi.com/v1/current.json"

# Model Paths
GRID_LOAD_MODEL_PATH = "models/grid_load_demand_model.pkl"
SOLAR_MODEL_PATH = "models/solar_model.pkl"
WIND_MODEL_PATH = "models/wind_model.pkl"

# Flask Configuration
DEBUG = False
HOST = "127.0.0.1"
PORT = 5000
