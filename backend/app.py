"""
Flask Backend for AI-Powered Rural Microgrid System
Main application file
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import config
from services.weather_service import get_weather_features
from services.prediction_service import initialize_prediction_service, get_predictions
from services.dispatch_service import get_dispatch_decision
from utils.validators import validate_city_parameter, create_error_response

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for frontend communication
CORS(app)

# No global state needed - simplified dispatch


@app.route("/", methods=["GET"])
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "online",
        "service": "AI-Powered Rural Microgrid Backend",
        "version": "1.0.0",
        "endpoints": {
            "/predict": "GET - Get energy predictions for a city (simplified - no battery)"
        }
    }), 200


@app.route("/predict", methods=["GET"])
def predict():
    """
    Main prediction endpoint
    
    Query Parameters:
        city (str): Name of the city
        
    Returns:
        JSON: {
            "predicted_load": float,
            "predicted_solar": float,
            "predicted_wind": float,
            "solar_used": float,
            "wind_used": float,
            "grid_import": float,
            "grid_export": float,
            "weather": dict
        }
    """

    
    try:
        # Step 1: Validate city parameter
        city = request.args.get("city", "").strip()
        is_valid, error_response = validate_city_parameter(city)
        
        if not is_valid:
            return create_error_response(
                error_response["error"],
                error_response["message"],
                400
            )
        
        print(f"\n{'='*60}")
        print(f"Processing prediction request for city: {city}")
        print(f"{'='*60}")
        
        # Step 2: Fetch weather data
        print("\n[1/4] Fetching weather data...")
        weather_data = get_weather_features(city)
        print(f"[OK] Weather data retrieved from API:")
        print(f"  - Temperature: {weather_data['temperature']}°C")
        print(f"  - Wind Speed: {weather_data['wind_speed']} kph")
        print(f"  - Humidity: {weather_data['humidity']}%")
        print(f"  - Pressure: {weather_data.get('atmospheric_pressure', 'N/A')} mb")
        print(f"  - Solar Irradiance: {weather_data.get('solar_irradiance', 'N/A')} W/m²")
        print(f"  - Hour: {weather_data['hour_of_day']}")
        print(f"  - Day of Week: {weather_data.get('day_of_week', 'N/A')}")
        
        # Step 3: Get predictions from ML models
        print("\n[2/4] Generating predictions...")
        predictions = get_predictions(weather_data)
        print(f"[OK] Predictions generated:")
        print(f"  - Load: {predictions['predicted_load']:.2f} kW")
        print(f"  - Solar: {predictions['predicted_solar']:.2f} kW")
        print(f"  - Wind: {predictions['predicted_wind']:.2f} kW")
        
        # Step 4: Run dispatch engine (simplified - no battery)
        print(f"\n[3/4] Running dispatch engine...")
        
        dispatch_result = get_dispatch_decision(
            predicted_load=predictions["predicted_load"],
            predicted_solar=predictions["predicted_solar"],
            predicted_wind=predictions["predicted_wind"]
        )
        
        print(f"[OK] Dispatch decision:")
        print(f"  - Solar Used: {dispatch_result['solar_used']:.2f} kW")
        print(f"  - Wind Used: {dispatch_result['wind_used']:.2f} kW")
        print(f"  - Grid Import: {dispatch_result['grid_import']:.2f} kW")
        print(f"  - Grid Export: {dispatch_result['grid_export']:.2f} kW")
        
        # Step 5: Build response
        print("\n[4/4] Building response...")
        response = {
            "predicted_load": round(predictions["predicted_load"], 2),
            "predicted_solar": round(predictions["predicted_solar"], 2),
            "predicted_wind": round(predictions["predicted_wind"], 2),
            "solar_used": dispatch_result["solar_used"],
            "wind_used": dispatch_result["wind_used"],
            "grid_import": dispatch_result["grid_import"],
            "grid_export": dispatch_result["grid_export"],
            
            # Weather Data
            "weather": {
                "temperature": weather_data.get("temperature"),
                "wind_speed": weather_data.get("wind_speed"),
                "humidity": weather_data.get("humidity"),
                "pressure": weather_data.get("atmospheric_pressure"),
                "solar_radiance": weather_data.get("solar_irradiance"),
                "cloud_cover": 50,  # Default if not available
            }
        }
        
        print(f"[OK] Response ready")
        print(f"{'='*60}\n")
        
        return jsonify(response), 200
        
    except Exception as e:
        error_message = str(e)
        print(f"\n[ERROR] {error_message}\n")
        
        return create_error_response(
            "Prediction Error",
            error_message,
            500
        )




@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return create_error_response(
        "Not Found",
        "The requested endpoint does not exist",
        404
    )


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return create_error_response(
        "Internal Server Error",
        "An unexpected error occurred",
        500
    )


if __name__ == "__main__":
    print("\n" + "="*60)
    print("AI-POWERED RURAL MICROGRID BACKEND")
    print("="*60)
    
    # Initialize prediction service (load ML models)
    try:
        print("\nInitializing services...")
        initialize_prediction_service()
        print("[OK] All services initialized successfully!\n")
    except Exception as e:
        print(f"\n[ERROR] Failed to initialize services: {str(e)}")
        print("Please ensure all .pkl model files are in the models/ directory\n")
        exit(1)
    
    # Start Flask server
    print(f"Starting Flask server on http://{config.HOST}:{config.PORT}")
    print("="*60 + "\n")
    
    app.run(
        host=config.HOST,
        port=config.PORT,
        debug=config.DEBUG
    )
