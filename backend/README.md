# AI-Powered Rural Microgrid Backend

Production-grade Flask backend for AI-powered energy management and prediction.

## 📁 Project Structure

```
backend/
│
├── app.py                          # Main Flask application
├── config.py                       # Configuration and constants
│
├── models/                         # ML model files (*.pkl)
│   ├── grid_load_demand_model.pkl
│   ├── solar_model.pkl
│   └── wind_model.pkl
│
├── services/                       # Business logic services
│   ├── __init__.py
│   ├── weather_service.py         # WeatherAPI integration
│   ├── prediction_service.py      # ML model predictions
│   └── dispatch_service.py        # Energy dispatch engine
│
├── utils/                          # Utility functions
│   ├── __init__.py
│   └── validators.py              # Input validation
│
├── requirements.txt               # Python dependencies
└── README.md                      # This file
```

---

## 🚀 Features

### Core Functionality
- **Real-time Weather Data**: Fetches current weather from WeatherAPI
- **ML Predictions**: Load, Solar, and Wind generation forecasting
- **Energy Dispatch**: Smart battery and grid management
- **RESTful API**: Clean JSON endpoints for frontend integration

### Advanced Features
- **Global Battery State**: Persistent battery SOC across requests
- **Comprehensive Error Handling**: Detailed error messages with HTTP status codes
- **CORS Enabled**: Frontend communication ready
- **Validation Layer**: Input sanitization and validation
- **Logging**: Detailed console output for debugging

---

## 📋 Prerequisites

1. **Python 3.8+** installed
2. **WeatherAPI Key**: Get free API key from [weatherapi.com](https://www.weatherapi.com/)
3. **ML Model Files**: Place `.pkl` files in `models/` directory:
   - `grid_load_demand_model.pkl`
   - `solar_model.pkl`
   - `wind_model.pkl`

---

## 🛠️ Installation

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Configure API Key
Edit `config.py` and replace the placeholder with your actual WeatherAPI key:

```python
WEATHER_API_KEY = "your_actual_api_key_here"
```

### Step 4: Add ML Model Files
Place your trained model `.pkl` files in the `models/` directory.

---

## ▶️ Running the Backend

### Start the Flask Server
```bash
python app.py
```

The server will start on:
```
http://127.0.0.1:5000
```

**Expected Console Output:**
```
============================================================
AI-POWERED RURAL MICROGRID BACKEND
============================================================

Initializing services...
Loading ML models...
✓ Loaded grid load model from models/grid_load_demand_model.pkl
✓ Loaded solar model from models/solar_model.pkl
✓ Loaded wind model from models/wind_model.pkl
All models loaded successfully!
✓ All services initialized successfully!

Starting Flask server on http://127.0.0.1:5000
Battery initialized at 200 kWh
============================================================
```

---

## 📡 API Endpoints

### 1. Health Check
**GET** `/`

**Response:**
```json
{
  "status": "online",
  "service": "AI-Powered Rural Microgrid Backend",
  "version": "1.0.0",
  "endpoints": {
    "/predict": "GET - Get energy predictions for a city"
  }
}
```

---

### 2. Get Predictions (Main Endpoint)
**GET** `/predict?city=<city_name>`

**Query Parameters:**
- `city` (required): Name of the city (e.g., "Delhi", "Mumbai")

**Success Response (200):**
```json
{
  "predicted_load": 150.5,
  "predicted_solar": 80.3,
  "predicted_wind": 45.2,
  "battery_soc": 200.0,
  "grid_import": 25.0,
  "grid_export": 0.0
}
```

**Error Response (400/500):**
```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

**Example Request:**
```bash
curl "http://127.0.0.1:5000/predict?city=Delhi"
```

---

### 3. Battery Status
**GET** `/battery/status`

**Response:**
```json
{
  "battery_soc": 200.0,
  "battery_capacity": 500.0,
  "charge_percentage": 40.0
}
```

---

### 4. Reset Battery
**POST** `/battery/reset`

**Response:**
```json
{
  "message": "Battery SOC reset successfully",
  "battery_soc": 200.0
}
```

---

## 🔧 Configuration

### `config.py` Settings

| Parameter | Default | Description |
|-----------|---------|-------------|
| `WEATHER_API_KEY` | `"your_weatherapi_key_here"` | WeatherAPI authentication key |
| `BATTERY_CAPACITY` | `500` | Maximum battery capacity (kWh) |
| `MAX_CHARGE_RATE` | `100` | Maximum charge rate (kW) |
| `MAX_DISCHARGE_RATE` | `100` | Maximum discharge rate (kW) |
| `INITIAL_BATTERY_SOC` | `200` | Starting battery charge (kWh) |
| `HOST` | `"127.0.0.1"` | Flask server host |
| `PORT` | `5000` | Flask server port |

---

## 🧩 Service Architecture

### Weather Service (`services/weather_service.py`)
- Fetches real-time weather from WeatherAPI
- Extracts: temperature, wind speed, humidity, pressure, solar irradiance
- Generates time features: hour of day, day of week
- Comprehensive error handling for API failures

### Prediction Service (`services/prediction_service.py`)
- Loads ML models using joblib
- Prepares feature DataFrames for predictions
- Generates predictions for:
  - Grid load demand
  - Solar generation
  - Wind generation
- Ensures non-negative renewable predictions

### Dispatch Service (`services/dispatch_service.py`)
- Energy management logic
- **Surplus Scenario** (Renewable > Load):
  - Charges battery (up to max rate and capacity)
  - Exports excess to grid
- **Deficit Scenario** (Load > Renewable):
  - Discharges battery (up to max rate and available SOC)
  - Imports remaining deficit from grid
- Maintains battery SOC within bounds [0, capacity]

---

## 🔄 Request Flow

```
1. Frontend sends: GET /predict?city=Delhi
                    ↓
2. Validate city parameter
                    ↓
3. Fetch weather data from WeatherAPI
                    ↓
4. Generate time features (hour, day)
                    ↓
5. Load ML models and predict:
   - Grid load demand
   - Solar generation
   - Wind generation
                    ↓
6. Run dispatch engine:
   - Calculate renewable supply
   - Manage battery charging/discharging
   - Determine grid import/export
                    ↓
7. Update global battery state
                    ↓
8. Return JSON response to frontend
```

---

## ⚠️ Error Handling

### Weather Service Errors
- **Connection Error**: "Failed to connect to WeatherAPI"
- **Timeout**: "WeatherAPI request timed out"
- **Invalid City**: "Invalid city name: {city}"
- **Auth Error**: "WeatherAPI authentication failed"
- **Quota Exceeded**: "API key exceeded quota"

### Prediction Service Errors
- **Model Not Found**: "Model file not found: {path}"
- **Load Failure**: "Failed to load models"
- **Prediction Error**: "Load/Solar/Wind prediction failed"

### Validation Errors
- **Missing Parameter**: "City parameter is required"
- **Invalid Type**: "City must be a string"
- **Empty Value**: "City name cannot be empty"
- **Too Long**: "City name is too long (max 100 characters)"

---

## 🧪 Testing

### Manual Testing

1. **Test Health Check:**
```bash
curl http://127.0.0.1:5000/
```

2. **Test Prediction:**
```bash
curl "http://127.0.0.1:5000/predict?city=Delhi"
```

3. **Test Battery Status:**
```bash
curl http://127.0.0.1:5000/battery/status
```

4. **Test Battery Reset:**
```bash
curl -X POST http://127.0.0.1:5000/battery/reset
```

5. **Test Error Handling:**
```bash
# Missing city parameter
curl http://127.0.0.1:5000/predict

# Invalid city
curl "http://127.0.0.1:5000/predict?city=InvalidCityXYZ123"
```

---

## 📊 Example Console Output

```
============================================================
Processing prediction request for city: Delhi
============================================================

[1/4] Fetching weather data...
✓ Weather data retrieved:
  - Temperature: 25.5°C
  - Wind Speed: 12.3 kph
  - Humidity: 65%
  - Hour: 14

[2/4] Generating predictions...
✓ Predictions generated:
  - Load: 150.50 kW
  - Solar: 80.30 kW
  - Wind: 45.20 kW

[3/4] Running dispatch engine...
  - Current Battery SOC: 200.00 kWh
✓ Dispatch decision:
  - Updated Battery SOC: 200.00 kWh
  - Grid Import: 25.00 kW
  - Grid Export: 0.00 kW

[4/4] Building response...
✓ Response ready
============================================================
```

---

## 🔐 Security Notes

- **API Key**: Never commit your actual WeatherAPI key to version control
- **Environment Variables**: In production, use environment variables for sensitive data
- **CORS**: Currently allows all origins; restrict in production
- **Rate Limiting**: Consider adding rate limiting for production use

---

## 🚀 Production Deployment

### Recommended Changes for Production

1. **Use Environment Variables:**
```python
import os
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
```

2. **Disable Debug Mode:**
```python
DEBUG = False
```

3. **Use Production WSGI Server:**
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

4. **Add Rate Limiting:**
```bash
pip install flask-limiter
```

5. **Configure CORS Properly:**
```python
CORS(app, origins=["https://your-frontend-domain.com"])
```

---

## 📝 Dependencies

```
flask              # Web framework
flask-cors         # CORS support
requests           # HTTP client for WeatherAPI
joblib             # ML model loading
pandas             # Data manipulation
scikit-learn       # ML model dependencies
```

---

## 🐛 Troubleshooting

### Models Not Loading
```
❌ Failed to initialize services: Model file not found
```
**Solution**: Ensure all `.pkl` files are in the `models/` directory

### WeatherAPI Authentication Failed
```
❌ WeatherAPI authentication failed. Please check your API key.
```
**Solution**: Update `WEATHER_API_KEY` in `config.py` with valid key

### Port Already in Use
```
OSError: [Errno 98] Address already in use
```
**Solution**: Change port in `config.py` or kill existing process:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

---

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [WeatherAPI Docs](https://www.weatherapi.com/docs/)
- [Scikit-learn Model Persistence](https://scikit-learn.org/stable/model_persistence.html)

---

## 👨‍💻 Author

Senior Backend Engineer

---

**Ready for production use!** 🚀
