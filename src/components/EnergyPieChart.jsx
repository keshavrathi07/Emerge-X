import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

/**
 * EnergyPieChart Component
 * Pie chart showing energy contribution breakdown
 */
function EnergyPieChart({ data }) {
    // Prepare pie chart data
    const pieData = [
        { name: 'Solar', value: data.solar_used, color: '#fbbf24' },
        { name: 'Wind', value: data.wind_used, color: '#60a5fa' },
        { name: 'Battery', value: data.battery_discharged, color: '#4ade80' },
        { name: 'Grid Import', value: data.grid_import, color: '#f87171' }
    ].filter(item => item.value > 0) // Only show non-zero values

    return (
        <div className="glass-card p-6">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

export default EnergyPieChart
