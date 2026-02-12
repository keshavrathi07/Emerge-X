import sys
print("Step 1: Python started", flush=True)
import os
print("Step 2: OS imported", flush=True)
try:
    import joblib
    print("Step 3: joblib imported", flush=True)
except ImportError:
    print("Step 3: joblib failed to import", flush=True)

try:
    import pandas
    print("Step 4: pandas imported", flush=True)
except ImportError:
    print("Step 4: pandas failed to import", flush=True)

try:
    import sklearn
    print("Step 5: sklearn imported", flush=True)
except ImportError:
    print("Step 5: sklearn failed to import", flush=True)

print("Debug complete", flush=True)
