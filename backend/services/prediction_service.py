"""
Prediction Service
Loads ML models and generates predictions for load, solar, and wind
"""

import joblib
import pandas as pd
from config import GRID_LOAD_MODEL_PATH, SOLAR_MODEL_PATH, WIND_MODEL_PATH


class PredictionService:
    """Service class for loading models and making predictions"""
    
    def __init__(self):
        """Initialize and load all ML models"""
        self.grid_load_model = None
        self.solar_model = None
        self.wind_model = None
        # Configuration for scaling (if any needed in future)
        self.load_models()
    
    def load_models(self):
        """
        Load all ML models from pickle files
        
        Raises:
            Exception: If any model fails to load
        """
        try:
            print("Loading ML models...")
            
            # Load grid load demand model
            self.grid_load_model = joblib.load(GRID_LOAD_MODEL_PATH)
            print(f"[OK] Loaded grid load model from {GRID_LOAD_MODEL_PATH}")
            
            # Load solar generation model
            self.solar_model = joblib.load(SOLAR_MODEL_PATH)
            print(f"[OK] Loaded solar model from {SOLAR_MODEL_PATH}")
            
            # Load wind generation model
            self.wind_model = joblib.load(WIND_MODEL_PATH)
            print(f"[OK] Loaded wind model from {WIND_MODEL_PATH}")
            
            print("All models loaded successfully!")
            
        except FileNotFoundError as e:
            raise Exception(f"Model file not found: {str(e)}. Please ensure all .pkl files are in the models/ directory.")
        
        except Exception as e:
            raise Exception(f"Failed to load models: {str(e)}")
    
    def prepare_features(self, weather_data: dict, model_type: str) -> pd.DataFrame:
        """
        Prepare feature DataFrame for model prediction
        
        Args:
            weather_data (dict): Weather features from weather service
            model_type (str): Type of model ('load', 'solar', or 'wind')
            
        Returns:
            pd.DataFrame: Features formatted for the specific model
        """
        # Common features that all models might use
        features = {
            "temperature": weather_data.get("temperature", 0.0),
            "wind_speed": weather_data.get("wind_speed", 0.0),
            "humidity": weather_data.get("humidity", 0.0),
            "atmospheric_pressure": weather_data.get("atmospheric_pressure", 0.0),
            "solar_irradiance": weather_data.get("solar_irradiance", 0.0),
            "hour_of_day": weather_data.get("hour_of_day", 0),
            "day_of_week": weather_data.get("day_of_week", 0)
        }
        
        # Create DataFrame with single row
        df = pd.DataFrame([features])
        
        # Reorder columns to match the model's expected feature order
        # This prevents "feature names must be in the same order" errors
        model = None
        if model_type == "load":
            model = self.grid_load_model
        elif model_type == "solar":
            model = self.solar_model
        elif model_type == "wind":
            model = self.wind_model
        
        # If model has feature_names_in_ attribute, reorder to match
        if model is not None and hasattr(model, 'feature_names_in_'):
            df = df[model.feature_names_in_]
        
        return df
    
    def predict_load(self, weather_data: dict) -> float:
        """
        Predict grid load demand
        
        Args:
            weather_data (dict): Weather features
            
        Returns:
            float: Predicted load in kW (capped at realistic maximum)
        """
        try:
            features = self.prepare_features(weather_data, "load")
            prediction = self.grid_load_model.predict(features)
            raw_value = float(prediction[0])
        
            # Return raw model prediction (removing village scaling)
            final_value = max(0.0, raw_value)
            
            return final_value
        except Exception as e:
            raise Exception(f"Load prediction failed: {str(e)}")
    
    def predict_solar(self, weather_data: dict) -> float:
        """
        Predict solar generation
        
        Args:
            weather_data (dict): Weather features
            
        Returns:
            float: Predicted solar generation in kW (capped at realistic maximum)
        """
        try:
            features = self.prepare_features(weather_data, "solar")
            prediction = self.solar_model.predict(features)
            raw_value = float(prediction[0])
        
            # Return raw model prediction (removing time-of-day scaling)
            final_solar = max(0.0, raw_value)
            
            return final_solar
        except Exception as e:
            raise Exception(f"Solar prediction failed: {str(e)}")
    
    def predict_wind(self, weather_data: dict) -> float:
        """
        Predict wind generation
        
        Args:
            weather_data (dict): Weather features
            
        Returns:
            float: Predicted wind generation in kW (capped at realistic maximum)
        """
        try:
            # Using ML Model with Hackathon Scaling (for visual impact in demo)
            features = self.prepare_features(weather_data, "wind")
            prediction = self.wind_model.predict(features)
            raw_value = float(prediction[0])
            
            # Apply scaling factor (0.4x) to make the data impactful for demo
            hackathon_multiplier = 0.4
            final_prediction = raw_value * hackathon_multiplier
            
            # Ensure non-negative
            final_prediction = max(0.0, final_prediction)
            
            return final_prediction
        except Exception as e:
            raise Exception(f"Wind prediction failed: {str(e)}")
    
    def predict_all(self, weather_data: dict) -> dict:
        """
        Generate all predictions (load, solar, wind)
        
        Args:
            weather_data (dict): Weather features from weather service
            
        Returns:
            dict: Dictionary containing all predictions
                {
                    "predicted_load": float,
                    "predicted_solar": float,
                    "predicted_wind": float
                }
        """
        try:
            predictions = {
                "predicted_load": self.predict_load(weather_data),
                "predicted_solar": self.predict_solar(weather_data),
                "predicted_wind": self.predict_wind(weather_data)
            }
            
            return predictions
            
        except Exception as e:
            raise Exception(f"Prediction service error: {str(e)}")


# Global prediction service instance
prediction_service = None


def initialize_prediction_service():
    """Initialize the global prediction service"""
    global prediction_service
    prediction_service = PredictionService()


def get_predictions(weather_data: dict) -> dict:
    """
    Public interface to get all predictions
    
    Args:
        weather_data (dict): Weather features
        
    Returns:
        dict: All predictions
    """
    if prediction_service is None:
        raise Exception("Prediction service not initialized")
    
    return prediction_service.predict_all(weather_data)
