import React from 'react'

/**
 * Header Component
 * Dashboard title and timestamp
 */
function Header() {
    const currentTime = new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
    })

    return (
        <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
                ⚡ AI-Powered Rural Microgrid Dashboard
            </h1>
            <p className="text-gray-300 flex items-center gap-2">
                <span>🕐</span>
                <span>Last updated: {currentTime}</span>
            </p>
        </div>
    )
}

export default Header
