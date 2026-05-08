import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

function CallbackPage() {
    const navigate = useNavigate()
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
                localStorage.setItem('github_token', data.token)
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
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Authenticating...</p>
        </div>
    )
}

export default CallbackPage