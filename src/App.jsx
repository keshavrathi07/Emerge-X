import { useState, useEffect } from 'react'
import { fetchPrediction } from './services/api'
import Navigation from './components/Navigation'
import InputView from './components/views/InputView'
import PredictionsView from './components/views/PredictionsView'
import StatisticsView from './components/views/StatisticsView'

function App() {
    const [city, setCity] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [predictionData, setPredictionData] = useState(null)
    const [currentView, setCurrentView] = useState('input')
    const [historicalData, setHistoricalData] = useState([])
    const [savedCity, setSavedCity] = useState(null) // Store city for auto-refresh

    // Auto-refresh predictions every 30 seconds (runs in background)
    useEffect(() => {
        if (!savedCity) return

        const refreshPredictions = async () => {
            try {
                const data = await fetchPrediction(savedCity)
                setPredictionData(data)

                // Add to historical data
                const timestamp = new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                })

                setHistoricalData(prev => {
                    const updated = [...prev, {
                        time: timestamp,
                        demand: data.predicted_load,
                        solar: data.predicted_solar,
                        wind: data.predicted_wind
                    }]
                    // Keep only last 10 data points
                    return updated.slice(-10)
                })
            } catch (err) {
                console.error('Auto-refresh failed:', err)
            }
        }

        // Refresh immediately when city is set, then every 30 seconds
        const intervalId = setInterval(refreshPredictions, 30000)

        return () => clearInterval(intervalId)
    }, [savedCity])

    // Handle prediction fetch
    const handlePredict = async () => {
        if (!city.trim()) {
            setError('Please enter a city name')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const data = await fetchPrediction(city)
            setPredictionData(data)
            setSavedCity(city) // Save city for auto-refresh

            // Initialize historical data
            const timestamp = new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })
            setHistoricalData([{
                time: timestamp,
                demand: data.predicted_load,
                solar: data.predicted_solar,
                wind: data.predicted_wind
            }])

            // Switch to predictions view on success
            setCurrentView('predictions')
        } catch (err) {
            setError(err.message || 'Failed to fetch prediction')
            setPredictionData(null)

            // Show error in a toast or alert (using simple alert for now or error state in view)
            alert(`Error: ${err.message || 'Failed to fetch prediction'}`)
        } finally {
            setLoading(false)
        }
    }

    // Render active view
    const renderView = () => {
        switch (currentView) {
            case 'input':
                return (
                    <InputView
                        city={city}
                        setCity={setCity}
                        onPredict={handlePredict}
                        loading={loading}
                        weatherData={predictionData?.weather}
                    />
                )
            case 'predictions':
                return (
                    <PredictionsView
                        predictionData={predictionData}
                        historicalData={historicalData}
                    />
                )
            case 'statistics':
                return <StatisticsView predictionData={predictionData} weatherData={predictionData?.weather} />
            default:
                return <InputView />
        }
    }

    return (
        <div className="min-h-screen bg-black/80 text-white font-sans selection:bg-emerald-500/30">
            {/* Main Content Area */}
            <main className="relative min-h-screen px-4 pt-6">
                <div key={currentView} className="view-transition">
                    {renderView()}
                </div>
            </main>

            {/* Navigation */}
            <Navigation currentView={currentView} setView={setCurrentView} />

            {/* Global Error Toast (if needed) */}
            {error && (
                <div className="fixed top-4 right-4 bg-red-500/90 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-bounce">
                    ❌ {error}
                    <button onClick={() => setError(null)} className="ml-4 font-bold opacity-50 hover:opacity-100">✕</button>
                </div>
            )}
        </div>
    )
}

export default App
