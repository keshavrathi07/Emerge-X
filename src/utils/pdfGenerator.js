import jsPDF from 'jspdf'

/**
 * Generate and download a PDF report with prediction data
 * @param {Object} predictionData - The prediction results
 * @param {Object} weatherData - The weather data
 * @param {string} city - The city name
 */
export const generatePDFReport = (predictionData, weatherData, city) => {
    const doc = new jsPDF()

    // Page margins and settings
    const margin = 20
    let yPosition = margin
    const lineHeight = 7
    const pageWidth = doc.internal.pageSize.getWidth()

    // Helper function to add text
    const addText = (text, size = 12, style = 'normal') => {
        doc.setFontSize(size)
        doc.setFont('helvetica', style)
        doc.text(text, margin, yPosition)
        yPosition += lineHeight
    }

    // Helper function to add key-value pair
    const addKeyValue = (key, value, indent = 0) => {
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')
        doc.text(`${key}:`, margin + indent, yPosition)
        doc.setFont('helvetica', 'bold')
        doc.text(value, margin + indent + 60, yPosition)
        yPosition += lineHeight
    }

    // Header
    doc.setFillColor(16, 185, 129) // Emerald color
    doc.rect(0, 0, pageWidth, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('Energy Prediction Report', margin, 25)

    // Reset text color
    doc.setTextColor(0, 0, 0)
    yPosition = 50

    // ====================
    // 1. LOCATION & TIMESTAMP
    // ====================
    addText('Location & Time', 14, 'bold')
    yPosition += 2
    addKeyValue('Village/City', city || 'N/A')
    addKeyValue('Report Generated', new Date().toLocaleString())
    yPosition += 3

    // ====================
    // 2. WEATHER CONDITIONS
    // ====================
    addText('Weather Conditions', 14, 'bold')
    yPosition += 2
    if (weatherData) {
        addKeyValue('Temperature', `${(weatherData.temperature ?? '--')}°C`)
        addKeyValue('Wind Speed', `${(weatherData.wind_speed ?? '--')} kph`)
        addKeyValue('Humidity', `${(weatherData.humidity ?? '--')}%`)
        addKeyValue('Cloud Cover', `${(weatherData.cloud_cover ?? '--')}%`)
    } else {
        addText('Weather data not available', 11, 'italic')
    }
    yPosition += 3

    // ====================
    // 3. ENERGY PREDICTIONS
    // ====================
    addText('Energy Predictions', 14, 'bold')
    yPosition += 2
    addKeyValue('Predicted Demand', `${predictionData.predicted_load.toFixed(2)} kW`)
    addKeyValue('Solar Generation', `${predictionData.predicted_solar.toFixed(2)} kW`)
    addKeyValue('Wind Generation', `${predictionData.predicted_wind.toFixed(2)} kW`)

    const totalRenewable = predictionData.predicted_solar + predictionData.predicted_wind
    addKeyValue('Total Renewable', `${totalRenewable.toFixed(2)} kW`)
    yPosition += 3

    // ====================
    // 4. POWER DISTRIBUTION
    // ====================
    addText('Power Distribution', 14, 'bold')
    yPosition += 2
    addKeyValue('Solar Used', `${predictionData.solar_used.toFixed(2)} kW`)
    addKeyValue('Wind Used', `${predictionData.wind_used.toFixed(2)} kW`)
    addKeyValue('Grid Import', `${predictionData.grid_import.toFixed(2)} kW`, 0)
    addKeyValue('Grid Export', `${predictionData.grid_export.toFixed(2)} kW`, 0)
    yPosition += 3

    // ====================
    // 5. ENERGY BALANCE SUMMARY
    // ====================
    addText('Energy Balance Summary', 14, 'bold')
    yPosition += 2

    const renewablePercentage = totalRenewable > 0
        ? ((totalRenewable / predictionData.predicted_load) * 100).toFixed(1)
        : '0.0'

    const netBalance = totalRenewable - predictionData.predicted_load
    const balanceStatus = netBalance >= 0 ? 'SURPLUS' : 'DEFICIT'
    const balanceColor = netBalance >= 0 ? [16, 185, 129] : [239, 68, 68]

    const systemEfficiency = predictionData.predicted_load > 0
        ? (((predictionData.solar_used + predictionData.wind_used) / predictionData.predicted_load) * 100).toFixed(1)
        : '0.0'

    addKeyValue('Renewable Coverage', `${renewablePercentage}%`)
    addKeyValue('System Efficiency', `${systemEfficiency}%`)
    addKeyValue('Net Balance', `${Math.abs(netBalance).toFixed(2)} kW ${balanceStatus}`)

    // Status box
    yPosition += 5
    doc.setDrawColor(...balanceColor)
    doc.setLineWidth(0.5)
    doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 15)
    doc.setTextColor(...balanceColor)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')

    if (netBalance >= 0) {
        doc.text('✓ Renewable energy is SUFFICIENT', margin + 5, yPosition)
        yPosition += lineHeight
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text(`Excess ${netBalance.toFixed(2)} kW can be exported to the grid`, margin + 5, yPosition)
    } else {
        doc.text('⚠ Renewable energy is INSUFFICIENT', margin + 5, yPosition)
        yPosition += lineHeight
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        doc.text(`Additional ${Math.abs(netBalance).toFixed(2)} kW required from grid`, margin + 5, yPosition)
    }

    yPosition += 10

    // ====================
    // FOOTER
    // ====================
    doc.setTextColor(128, 128, 128)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'italic')
    const footerY = doc.internal.pageSize.getHeight() - 15
    doc.text('Generated by Emerge-X AI-Powered Rural Microgrid System', margin, footerY)
    doc.text(`Page 1 of 1`, pageWidth - margin - 20, footerY)

    // Save the PDF
    const fileName = `Energy_Report_${city.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`
    doc.save(fileName)
}
