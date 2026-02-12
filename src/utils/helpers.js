/**
 * Format number to fixed decimals
 * @param {number} value - Value to format
 * @param {number} decimals - Number of decimals
 * @returns {string} - Formatted string
 */
export const formatNumber = (value, decimals = 1) => {
  if (value === undefined || value === null) return '0'
  return Number(value).toFixed(decimals)
}

/**
 * Get status information based on grid interaction
 * @param {Object} data - Prediction data
 * @returns {Object} - Status info object
 */
export const getStatusInfo = (data) => {
  if (!data) return { type: 'info', icon: '❓', title: 'Unknown', message: 'No data available' }

  if (data.grid_export > 0) {
    return {
      type: 'success',
      icon: '✅',
      title: 'Renewables Sufficient',
      message: `System is balanced and exporting ${data.grid_export.toFixed(1)} kW to the grid.`
    }
  } else if (data.grid_import > 0) {
    return {
      type: 'warning',
      icon: '⚠️',
      title: 'Grid Support Required',
      message: `Renewables insufficient. Importing ${data.grid_import.toFixed(1)} kW from the grid.`
    }
  } else {
    return {
      type: 'info',
      icon: '⚖️',
      title: 'System Balanced',
      message: 'Energy generation perfectly matches demand.'
    }
  }
}
