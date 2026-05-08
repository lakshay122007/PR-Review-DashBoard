import useAuthStore from '../store/authStore'
import { useNavigate } from 'react-router-dom'

function Navbar({ user }) {
    const logout = useAuthStore((state) => state.logout)
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <div className="border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <h1 className="font-semibold text-white">PR Dashboard</h1>
        {user && (
            <div className="flex items-center gap-4">
            <img src={user.avatar_url} className="w-8 h-8 rounded-full" />
            <span className="text-sm text-gray-400">@{user.login}</span>
            <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-white transition"
            >
                Logout
            </button>
            </div>
        )}
        </div>
    )
}

export default Navbar