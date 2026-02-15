import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function PredictionsView({ predictionData, historicalData }) {
    if (!predictionData) return null

    return (
        <div className="max-w-4xl mx-auto pt-10 px-4 pb-24">
            <div className="glass-panel p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold">Model Predictions</h2>
                        <p className="text-gray-400 text-sm">Auto-refreshing every 10 seconds</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/50 flex items-center gap-1">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                            LIVE
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {/* Demand Card */}
                    <div className="glass-card p-4 relative overflow-hidden group hover:bg-white/10 transition-all">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="text-4xl">⚡</span>
                        </div>
                        <span className="text-gray-400 text-sm block mb-1">Demand</span>
                        <span className="text-2xl font-bold text-yellow-400 block mb-1">
                            {predictionData.predicted_load} <span className="text-sm">kW</span>
                        </span>
                        <span className="text-xs text-gray-500">Predicted Load</span>
                    </div>

                    {/* Solar Card */}
                    <div className="glass-card p-4 relative overflow-hidden group hover:bg-white/10 transition-all">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="text-4xl">☀️</span>
                        </div>
                        <span className="text-gray-400 text-sm block mb-1">Solar Output</span>
                        <span className="text-2xl font-bold text-orange-400 block mb-1">
                            {predictionData.predicted_solar} <span className="text-sm">kW</span>
                        </span>
                        <span className="text-xs text-gray-500">Predicted Generation</span>
                    </div>

                    {/* Wind Card */}
                    <div className="glass-card p-4 relative overflow-hidden group hover:bg-white/10 transition-all">
                        <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="text-4xl">💨</span>
                        </div>
                        <span className="text-gray-400 text-sm block mb-1">Wind Output</span>
                        <span className="text-2xl font-bold text-blue-400 block mb-1">
                            {predictionData.predicted_wind} <span className="text-sm">kW</span>
                        </span>
                        <span className="text-xs text-gray-500">Predicted Generation</span>
                    </div>
                </div>

                {/* Real-Time Graph */}
                <div className="glass-card p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-200">Real-Time Monitoring</h3>
                        <span className="text-xs text-gray-400">
                            {historicalData.length} data point{historicalData.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={historicalData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000000cc', border: '1px solid #ffffff20', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="demand" stroke="#FACC15" strokeWidth={3} dot={{ r: 4, fill: '#FACC15' }} activeDot={{ r: 6 }} name="Demand" />
                                <Line type="monotone" dataKey="solar" stroke="#FB923C" strokeWidth={3} dot={{ r: 4, fill: '#FB923C' }} activeDot={{ r: 6 }} name="Solar" />
                                <Line type="monotone" dataKey="wind" stroke="#60A5FA" strokeWidth={3} dot={{ r: 4, fill: '#60A5FA' }} activeDot={{ r: 6 }} name="Wind" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Energy Optimized Result */}
                <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-200">Energy Optimized Result</h3>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">Solar Used</span>
                            <span className="font-bold">{predictionData.solar_used} kW</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">Wind Used</span>
                            <span className="font-bold">{predictionData.wind_used} kW</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">Grid Import</span>
                            <span className="font-bold text-red-400">{predictionData.grid_import} kW</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span className="text-gray-400">Grid Export</span>
                            <span className="font-bold text-green-400">{predictionData.grid_export} kW</span>
                        </div>
                    </div>

                    <button className="w-full mt-6 py-3 bg-gradient-to-r from-emerald-900/50 to-emerald-800/50 border border-emerald-500/30 rounded-xl text-emerald-400 font-semibold flex items-center justify-center gap-2">
                        <span>✓</span> Renewables {predictionData.grid_import === 0 ? 'Sufficient' : 'Partially Sufficient'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PredictionsView
