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
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
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