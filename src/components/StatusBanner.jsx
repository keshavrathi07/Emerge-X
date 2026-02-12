import React from 'react'
import { getStatusInfo } from '../utils/helpers'

/**
 * StatusBanner Component
 * Color-coded status indicator based on grid interaction
 */
function StatusBanner({ data }) {
    const status = getStatusInfo(data)

    const colorClasses = {
        success: 'bg-green-500/20 border-green-500/50 text-green-200',
        warning: 'bg-red-500/20 border-red-500/50 text-red-200',
        info: 'bg-blue-500/20 border-blue-500/50 text-blue-200'
    }

    return (
        <div className={`glass-card ${colorClasses[status.type]} p-4 mb-6`}>
            <div className="flex items-center gap-3">
                <span className="text-2xl">{status.icon}</span>
                <div>
                    <h3 className="font-bold text-lg">{status.title}</h3>
                    <p className="text-sm opacity-90">{status.message}</p>
                </div>
            </div>
        </div>
    )
}

export default StatusBanner
