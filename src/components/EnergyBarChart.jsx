import React from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts'

/**
 * EnergyBarChart Component
 * Combined bar chart for Solar/Wind and line chart for Demand
 */
function EnergyBarChart({ data }) {
    // Prepare chart data
    const chartData = [
        {
            name: 'Current',
            Solar: data.predicted_solar,
            Wind: data.predicted_wind,
            Demand: data.predicted_load
        }
    ]

    return (
        <div className="glass-card p-6">
            <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="#fff" />
                    <YAxis stroke="#fff" label={{ value: 'kW', angle: -90, position: 'insideLeft', fill: '#fff' }} />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                    />
                    <Legend />
                    <Bar dataKey="Solar" fill="#fbbf24" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="Wind" fill="#60a5fa" radius={[8, 8, 0, 0]} />
                    <Line type="monotone" dataKey="Demand" stroke="#4ade80" strokeWidth={3} dot={{ r: 6 }} />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    )
}

export default EnergyBarChart
