import React from 'react'

/**
 * MetricCard Component
 * Reusable card for displaying metrics
 */
function MetricCard({ title, value, unit, icon, color = 'text-white' }) {
    return (
        <div className="glass-card p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-300 font-medium">{title}</h3>
                <span className="text-3xl">{icon}</span>
            </div>
            <div className="flex items-baseline gap-2">
                <span className={`text-4xl font-bold ${color}`}>
                    {typeof value === 'number' ? value.toFixed(1) : value}
                </span>
                <span className="text-gray-400 text-lg font-medium">{unit}</span>
            </div>
        </div>
    )
}

export default MetricCard
