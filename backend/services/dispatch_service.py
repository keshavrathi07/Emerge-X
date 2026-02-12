"""
Dispatch Service
Simplified energy dispatch engine - manages grid import/export based on renewable generation
"""


def dispatch_engine(
    load: float,
    solar: float,
    wind: float
) -> dict:
    """
    Simplified energy dispatch engine
    
    Calculates grid import/export based on renewable generation vs demand:
    - If renewable >= load: export surplus to grid
    - If renewable < load: import deficit from grid
    
    Args:
        load (float): Predicted energy load in kW
        solar (float): Predicted solar generation in kW
        wind (float): Predicted wind generation in kW
        
    Returns:
        dict: {
            "solar_used": float,    # Solar energy used to meet load (kW)
            "wind_used": float,     # Wind energy used to meet load (kW)
            "grid_import": float,   # Energy imported from grid (kW)
            "grid_export": float    # Energy exported to grid (kW)
        }
    """
    # Initialize allocation variables
    solar_used = 0.0
    wind_used = 0.0
    grid_import = 0.0
    grid_export = 0.0
    
    # Calculate total renewable generation
    renewable_generation = solar + wind
    
    # Calculate net energy (positive = surplus, negative = deficit)
    net_energy = renewable_generation - load
    
    if net_energy >= 0:
        # SURPLUS SCENARIO: Renewable >= Load
        # Use solar first to meet load
        solar_used = min(solar, load)
        remaining_load = load - solar_used
        
        # Use wind to meet remaining load
        wind_used = min(wind, remaining_load)
        
        # Export surplus to grid
        grid_export = renewable_generation - load
        
    else:
        # DEFICIT SCENARIO: Load > Renewable
        # Use all available solar
        solar_used = solar
        
        # Use all available wind
        wind_used = wind
        
        # Import deficit from grid
        grid_import = load - renewable_generation
    
    # Ensure no negative values
    solar_used = max(0.0, solar_used)
    wind_used = max(0.0, wind_used)
    grid_import = max(0.0, grid_import)
    grid_export = max(0.0, grid_export)
    
    return {
        "solar_used": round(solar_used, 2),
        "wind_used": round(wind_used, 2),
        "grid_import": round(grid_import, 2),
        "grid_export": round(grid_export, 2)
    }


def get_dispatch_decision(
    predicted_load: float,
    predicted_solar: float,
    predicted_wind: float
) -> dict:
    """
    Public interface to get dispatch decision
    
    Args:
        predicted_load (float): Predicted load in kW
        predicted_solar (float): Predicted solar generation in kW
        predicted_wind (float): Predicted wind generation in kW
        
    Returns:
        dict: Dispatch decision with energy allocation breakdown
    """
    return dispatch_engine(
        load=predicted_load,
        solar=predicted_solar,
        wind=predicted_wind
    )
