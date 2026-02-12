import joblib
import os
import sys

print("Python executable:", sys.executable)
print("Current working directory:", os.getcwd())

models_dir = "models"
models = [
    "grid_load_demand_model.pkl",
    "solar_model.pkl",
    "wind_model.pkl"
]

print(f"Checking for models in {models_dir}...")

for model_name in models:
    model_path = os.path.join(models_dir, model_name)
    print(f"\nChecking {model_name}...")
    
    if not os.path.exists(model_path):
        print(f"❌ File not found: {model_path}")
        continue
        
    print(f"File exists. Size: {os.path.getsize(model_path)} bytes")
    
    try:
        print("Attempting to load...")
        model = joblib.load(model_path)
        print(f"✅ Successfully loaded {model_name}")
        print(f"Type: {type(model)}")
    except Exception as e:
        print(f"❌ Failed to load {model_name}: {e}")
        import traceback
        traceback.print_exc()

print("\nDebug check complete.")
