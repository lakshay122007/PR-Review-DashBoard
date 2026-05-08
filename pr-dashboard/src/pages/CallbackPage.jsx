import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function CallbackPage() {
    const navigate = useNavigate()

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get('code')

        if (code) {
            console.log('GitHub code received:', code)
            navigate('/dashboard')
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