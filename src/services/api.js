import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:5000'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Fetch energy prediction for a specific city
 * @param {string} city - Name of the city
 * @returns {Promise<Object>} - Prediction data
 */
export const fetchPrediction = async (city) => {
  try {
    const response = await api.get('/predict', {
      params: { city },
    })

    const data = response.data

    // Handle nested structure (like in user screenshot)
    if (data.energy_flow) {
      return {
        predicted_load: data.energy_flow.grid_load_demand_kw,
        predicted_solar: data.energy_flow.solar_pv_output_kw,
        predicted_wind: data.energy_flow.wind_power_output_kw,
        solar_used: data.energy_flow.solar_pv_output_kw, // Assumed full utilization or need calculation
        wind_used: data.energy_flow.wind_power_output_kw, // Assumed full utilization
        battery_charged: data.energy_flow.battery_charge_kw,
        battery_discharged: data.energy_flow.battery_discharge_kw,
        battery_soc_kwh: data.energy_flow.battery_soc_kw,
        battery_soc_percent: (data.energy_flow.battery_soc_kw / 500) * 100, // Assuming 500kWh capacity if not provided
        grid_import: data.energy_flow.grid_import_kw,
        grid_export: data.energy_flow.grid_export_kw
      }
    }

    // Handle flat structure (default)
    return data
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Backend server is unavailable. Please ensure Flask app is running.')
    }
    if (error.response) {
      throw new Error(error.response.data.error || 'Server error occurred')
    }
    throw new Error(error.message || 'Failed to fetch data')
  }
}

/**
 * Fetch current battery status
 * @returns {Promise<Object>} - Battery status data
 */
export const fetchBatteryStatus = async () => {
  try {
    const response = await api.get('/battery/status')
    return response.data
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      console.warn('Backend server unavailable for battery status')
      return { charge_percentage: 50 } // Fallback
    }
    return { charge_percentage: 50 } // Fallback
  }
}

export default api
