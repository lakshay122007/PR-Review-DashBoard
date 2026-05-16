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
        <nav style={{ fontFamily: "'DM Sans', sans-serif" }}
        className="flex items-center justify-between px-6 py-3 border-b border-white/[0.06] bg-[#080C14]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <img src="/logo.svg" className="w-7 h-7 rounded-lg" />
            </div>
            <span className="font-semibold text-white text-sm">PR Dashboard</span>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">v1.0</span>
        </div>

        {user && (
            <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-xl px-3 py-1.5">
                <img src={user.avatar_url} className="w-5 h-5 rounded-full" />
                <span className="text-xs text-gray-300">{user.login}</span>
            </div>
            <button onClick={handleLogout}
                className="text-xs text-gray-500 hover:text-white border border-white/[0.07] hover:border-white/20 px-3 py-1.5 rounded-xl transition-all">
                Sign out
            </button>
            </div>
        )}
        </nav>
    )
}

export default Navbar