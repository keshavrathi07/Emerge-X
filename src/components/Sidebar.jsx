import React from 'react'

/**
 * Sidebar Component
 * Fixed left sidebar with city input, predict button, and battery status
 */
function Sidebar({ city, setCity, onPredict, loading, batteryPercent, weatherData }) {
    return (
        <div className="fixed left-0 top-0 h-screen w-80 glass-card m-4 p-6 overflow-y-auto">
            {/* App Title */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl">⚡</span>
                    <h1 className="text-xl font-bold text-white">Intelligent AI</h1>
                </div>
                <h2 className="text-lg font-semibold text-emerald-300">Microgrid System</h2>
            </div>

            {/* City Input */}
            <div className="mb-6">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                    🌍 Enter City Name
                </label>
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && onPredict()}
                    placeholder="e.g., Delhi, Mumbai"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    disabled={loading}
                />
            </div>

            {/* Predict Button */}
            <button
                onClick={onPredict}
                disabled={loading}
                className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Loading...
                    </span>
                ) : (
                    '🔮 Predict Energy'
                )}
            </button>

            {/* Battery Status */}
            <div className="mt-8">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 text-sm font-medium">🔋 Battery Status</span>
                    <span className="text-white font-bold">{batteryPercent.toFixed(0)}%</span>
                </div>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                        style={{ width: `${Math.min(batteryPercent, 100)}%` }}
                    ></div>
                </div>
                <p className="text-gray-400 text-xs mt-2">
                    {batteryPercent > 80 ? '✅ Fully Charged' : batteryPercent > 50 ? '⚡ Good' : batteryPercent > 20 ? '⚠️ Low' : '🔴 Critical'}
                </p>
            </div>

            {/* Weather Summary Section */}
            <div className="mt-8 glass-card-dark p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <span>🌤️</span>
                    <span>Weather Summary</span>
                </h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-300">
                        <span>Temperature</span>
                        <span className="text-white font-medium">
                            {weatherData ? `${weatherData.temperature}°C` : '--'}
                        </span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                        <span>Wind Speed</span>
                        <span className="text-white font-medium">
                            {weatherData ? `${weatherData.wind_speed} kph` : '--'}
                        </span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                        <span>Humidity</span>
                        <span className="text-white font-medium">
                            {weatherData ? `${weatherData.humidity}%` : '--'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="mt-8 text-center">
                <p className="text-gray-400 text-xs">
                    Powered by AI & Machine Learning
                </p>
            </div>
        </div>
    )
}

export default Sidebar
