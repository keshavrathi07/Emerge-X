import React from 'react'

function Header() {
    const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    })

    return (
        <header className="flex items-center justify-between mb-8">
            <div>
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    EMERGE-X
                </h1>
            </div>
        </header>
    )
}

export default Header
