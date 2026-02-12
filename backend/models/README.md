# ML Models Directory

This directory should contain the following trained ML model files:

1. **grid_load_demand_model.pkl** - Predicts energy load demand
2. **solar_model.pkl** - Predicts solar generation
3. **wind_model.pkl** - Predicts wind generation

## Instructions

Place your trained `.pkl` model files in this directory before running the backend.

The prediction service will automatically load these models on startup.

## Model Requirements

- Models should be saved using `joblib.dump()`
- Models should accept pandas DataFrames with the following features:
  - temperature
  - wind_speed
  - humidity
  - atmospheric_pressure
  - solar_irradiance
  - hour_of_day
  - day_of_week

## Example Model Training Code

```python
import joblib
from sklearn.ensemble import RandomForestRegressor

# Train your model
model = RandomForestRegressor()
model.fit(X_train, y_train)

# Save the model
joblib.dump(model, 'grid_load_demand_model.pkl')
```
