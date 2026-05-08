import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { getUser, getUserRepos } from '../api/github'

function DashboardPage() {
    const token = useAuthStore((state) => state.token)
    const logout = useAuthStore((state) => state.logout)
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [repos, setRepos] = useState([])

    useEffect(() => {
        if (!token) {
        navigate('/')
        return
        }

        getUser(token).then(setUser)
        getUserRepos(token).then(setRepos)
    }, [token])

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    if (!user) {
        return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
            <p className="text-gray-400">Loading...</p>
        </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white p-8">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
            <img src={user.avatar_url} className="w-10 h-10 rounded-full" />
            <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-gray-400 text-sm">@{user.login}</p>
            </div>
            </div>
            <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-white transition"
            >
            Logout
            </button>
        </div>

        <h2 className="text-lg font-semibold mb-4">Your Repos</h2>
        <div className="grid grid-cols-1 gap-3">
            {repos.map(repo => (
            <div key={repo.id} className="bg-gray-900 rounded-lg p-4">
                <p className="font-medium">{repo.name}</p>
                <p className="text-gray-400 text-sm mt-1">{repo.description || 'No description'}</p>
            </div>
            ))}
        </div>
        </div>
    )
}

export default DashboardPage