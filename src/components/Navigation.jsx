import React from 'react'

function Navigation({ currentView, setView }) {
    const navItems = [
        { id: 'input', label: 'Input Village', icon: '🏠' },
        { id: 'predictions', label: 'Predictions', icon: '⚡' },
        { id: 'statistics', label: 'Statistics', icon: '📊' },
    ]

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-panel px-6 py-3 flex gap-8 z-50">
            {navItems.map((item) => (
                <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={`flex flex-col items-center gap-1 transition-all duration-300 ${currentView === item.id
                            ? 'text-emerald-400 scale-110'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-xs font-medium">{item.label}</span>
                </button>
            ))}
        </div>
    )
}

export default Navigation
