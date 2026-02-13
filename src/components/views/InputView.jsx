import React from 'react'

function InputView({ city, setCity, onPredict, loading, weatherData }) {
    return (
        <div className="max-w-4xl mx-auto pt-10 px-4 pb-24">
            {/* Header Section */}
            <div className="glass-panel p-8 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-20">
                    <svg className="w-32 h-32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
                    </svg>
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-emerald-400 text-2xl">🌱</span>
                        <h1 className="text-4xl font-bold">GreenGrid</h1>
                    </div>
                    <p className="text-gray-400 max-w-md">
                        Enter your village details to generate AI-powered energy predictions and optimize your microgrid.
                    </p>
                </div>
            </div>

            {/* Top Row: Input and Predict Button */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Left Column - Input Section */}
                <div className="glass-panel p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-200">Enter Village Details</h3>
                    <div className="relative">
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="e.g. Kishtwar, Jammu & Kashmir"
                            className="input-field pr-10"
                        />
                        <button
                            onClick={onPredict}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                            🔍
                        </button>
                    </div>
                </div>

                {/* Right Column - Predict Button */}
                <div className="glass-panel p-6 flex flex-col justify-start">
                    <button
                        onClick={onPredict}
                        disabled={loading}
                        className="btn-primary w-full py-6 flex items-center justify-center gap-3 text-lg"
                    >
                        {loading ? (
                            <>
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <span className="text-2xl">✓</span> Predict Energy
                            </>
                        )}
                    </button>
                    <p className="text-center text-gray-400 text-sm mt-4">
                        Using current system time for predictions
                    </p>
                </div>
            </div>

            {/* Bottom Row: Full-Width Live Weather Card */}
            <div className="glass-panel p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-200">Live Weather</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
                    {/* Temperature */}
                    <div className="glass-card p-4">
                        <span className="text-2xl block mb-1">☀️</span>
                        <span className="text-xl font-bold block">
                            {weatherData ? `${weatherData.temperature}°C` : '--'}
                        </span>
                        <span className="text-xs text-gray-400">Temperature</span>
                    </div>

                    {/* Wind Speed */}
                    <div className="glass-card p-4">
                        <span className="text-2xl block mb-1">💨</span>
                        <span className="text-xl font-bold block">
                            {weatherData ? `${weatherData.wind_speed} kph` : '--'}
                        </span>
                        <span className="text-xs text-gray-400">Wind Speed (kph)</span>
                    </div>

                    {/* Humidity */}
                    <div className="glass-card p-4">
                        <span className="text-2xl block mb-1">☁️</span>
                        <span className="text-xl font-bold block">
                            {weatherData ? `${weatherData.humidity}%` : '--'}
                        </span>
                        <span className="text-xs text-gray-400">Humidity</span>
                    </div>

                    {/* Atmospheric Pressure */}
                    <div className="glass-card p-4">
                        <span className="text-2xl block mb-1">🌡️</span>
                        <span className="text-xl font-bold block">
                            {weatherData?.pressure ? `${weatherData.pressure} hPa` : '--'}
                        </span>
                        <span className="text-xs text-gray-400">Pressure</span>
                    </div>

                    {/* Solar Irradiance */}
                    <div className="glass-card p-4">
                        <span className="text-2xl block mb-1">🌞</span>
                        <span className="text-xl font-bold block">
                            {weatherData?.solar_radiance ? `${weatherData.solar_radiance} W/m²` : '--'}
                        </span>
                        <span className="text-xs text-gray-400">Solar Irradiance</span>
                    </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-green-400">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Fetched live weather via API
                </div>
            </div>
        </div>
    )
}

export default InputView
