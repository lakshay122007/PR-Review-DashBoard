import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

function CallbackPage() {
    const navigate = useNavigate()
    const setToken = useAuthStore((state) => state.setToken)
    const called = useRef(false)

  useEffect(() => {
        if (called.current) return
        called.current = true

        const code = new URLSearchParams(window.location.search).get('code')

        if (code) {
        fetch('/api/exchange-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        })
            .then(res => res.json())
            .then(data => {
            if (data.token) {
                setToken(data.token)
                navigate('/dashboard')
            } else {
                navigate('/')
            }
            })
        } else {
        navigate('/')
        }
    }, [])

    return (
        <div style={{ fontFamily: "'DM Sans', sans-serif" }}
        className="min-h-screen bg-[#080C14] flex items-center justify-center">
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

        <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-6">
            {[0, 1, 2].map(i => (
                <div
                key={i}
                className="w-2 h-2 bg-blue-400 rounded-full"
                style={{
                    animation: 'bounce 1s infinite',
                    animationDelay: `${i * 0.15}s`
                }}
                />
            ))}
            </div>
            <p className="text-white font-medium">Signing you in</p>
            <p className="text-gray-500 text-sm mt-1">Talking to GitHub...</p>
        </div>

        <style>{`
            @keyframes bounce {
            0%, 100% { transform: translateY(0); opacity: 0.4; }
            50% { transform: translateY(-8px); opacity: 1; }
            }
        `}</style>
        </div>
    )
}

export default CallbackPage