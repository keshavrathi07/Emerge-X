import React from 'react'

/**
 * EnergyFlow Component
 * Visual representation of energy flow from sources to demand
 */
function EnergyFlow({ data }) {
    const FlowItem = ({ icon, title, value, direction }) => (
        <div className="glass-card-dark p-4 text-center">
            <div className="text-3xl mb-2">{icon}</div>
            <h4 className="text-white font-semibold mb-1">{title}</h4>
            <p className="text-gray-400 text-sm mb-2">{value}</p>
            <div className="text-2xl text-emerald-400">{direction}</div>
        </div>
    )

    return (
        <div className="glass-card p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Generation Sources */}
                <FlowItem
                    icon="☀️"
                    title="Solar AI"
                    value={`${data.predicted_solar.toFixed(1)} kW`}
                    direction="↓"
                />
                <FlowItem
                    icon="💨"
                    title="Wind AI"
                    value={`${data.predicted_wind.toFixed(1)} kW`}
                    direction="↓"
                />

                {/* Grid Interactions */}
                <FlowItem
                    icon="🔌"
                    title="Grid Import"
                    value={`${data.grid_import.toFixed(1)} kW`}
                    direction={data.grid_import > 0 ? "↓" : "—"}
                />
                <FlowItem
                    icon="⚡"
                    title="Grid Export"
                    value={`${data.grid_export.toFixed(1)} kW`}
                    direction={data.grid_export > 0 ? "↑" : "—"}
                />
            </div>

            {/* Demand Center */}
            <div className="mt-6 glass-card-dark p-6 text-center">
                <div className="text-4xl mb-2">⚡</div>
                <h3 className="text-white font-bold text-xl mb-1">Total Demand</h3>
                <p className="text-emerald-400 text-3xl font-bold">{data.predicted_load.toFixed(1)} kW</p>
            </div>
        </div>
    )
}

export default EnergyFlow
