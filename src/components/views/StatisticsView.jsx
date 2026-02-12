import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import EnergyFlow from '../../components/EnergyFlow' // Reusing existing component if suitable, or recreating
import { generatePDFReport } from '../../utils/pdfGenerator'

function StatisticsView({ predictionData, weatherData }) {
    if (!predictionData) return null

    const pieData = [
        { name: 'Solar', value: predictionData.solar_used, color: '#FACC15' },
        { name: 'Wind', value: predictionData.wind_used, color: '#60A5FA' },
        { name: 'Grid', value: predictionData.grid_import, color: '#EF4444' },
    ].filter(d => d.value > 0)

    const handleDownloadReport = () => {
        try {
            // Extract city from weatherData or use a default
            const city = weatherData?.city || 'Village'
            generatePDFReport(predictionData, weatherData, city)
        } catch (error) {
            console.error('Error generating PDF:', error)
            alert('Failed to generate PDF report. Please ensure jsPDF is installed.')
        }
    }

    return (
        <div className="max-w-4xl mx-auto pt-10 px-4 pb-24">
            <div className="glass-panel p-6 mb-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold">Statistics Overview</h2>
                    <div className="flex items-center gap-2 text-emerald-400 text-sm mt-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        {weatherData?.city || 'Selected City'}
                    </div>
                </div>

                {/* Weather Summary */}
                <div className="glass-card-dark p-6 mb-6">
                    <h3 className="text-gray-300 font-medium mb-4">Weather Summary</h3>
                    <div className="grid grid-cols-4 gap-4 text-center divide-x divide-white/10">
                        <div>
                            <span className="block text-2xl mb-1">🌡️</span>
                            <span className="text-xl font-bold block">{weatherData?.temperature || '--'}°C</span>
                            <span className="text-xs text-gray-500">Temperature</span>
                        </div>
                        <div>
                            <span className="block text-2xl mb-1">💨</span>
                            <span className="text-xl font-bold block">{weatherData?.wind_speed || '--'} m/s</span>
                            <span className="text-xs text-gray-500">Wind Speed</span>
                        </div>
                        <div>
                            <span className="block text-2xl mb-1">💧</span>
                            <span className="text-xl font-bold block">{weatherData?.humidity || '--'}%</span>
                            <span className="text-xs text-gray-500">Humidity</span>
                        </div>
                        <div>
                            <span className="block text-2xl mb-1">☁️</span>
                            <span className="text-xl font-bold block">{weatherData?.cloud_cover || '--'}%</span>
                            <span className="text-xs text-gray-500">Cloud Cover</span>
                        </div>
                    </div>
                </div>

                {/* Energy Contribution */}
                <div className="glass-card mb-6 p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-200">Energy Contribution</h3>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1 space-y-4">
                            {pieData.map((entry, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl">{entry.name === 'Solar' ? '☀️' : entry.name === 'Wind' ? '💨' : '🔌'}</span>
                                        <span className="text-gray-300">{entry.name}</span>
                                    </div>
                                    <span className="font-bold" style={{ color: entry.color }}>
                                        {entry.value} kW
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="w-48 h-48 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000000cc', border: 'none', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-2xl font-bold text-white">
                                    {pieData.reduce((acc, cur) => acc + cur.value, 0).toFixed(1)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Energy Flow - Reusing or simple visual */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-200">Energy Flow</h3>
                    {/* Placeholder for complex diagram, or reuse EnergyFlow component */}
                    <EnergyFlow data={predictionData} />
                </div>
            </div>

            <div className="flex gap-4">
                <button className="flex-1 glass-card p-4 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                    <span>🏠</span> Input Village
                </button>
                <button
                    onClick={handleDownloadReport}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-green-500 rounded-xl p-4 font-bold shadow-lg flex items-center justify-center gap-2 hover:from-emerald-700 hover:to-green-600 transition-all"
                >
                    <span>📥</span> Download Report
                </button>
            </div>
        </div>
    )
}

export default StatisticsView
