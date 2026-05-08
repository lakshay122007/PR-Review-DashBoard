function LoginPage() {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID
    const redirectUri = 'http://localhost:5173/callback'

    const handleLogin = () => {
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo,user`
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">PR Dashboard</h1>
            <p className="text-gray-400 mb-8">Track your team's pull request health</p>
            <button
            onClick={handleLogin}
            className="bg-white text-gray-950 font-semibold px-6 py-3 rounded-lg hover:bg-gray-200 transition">
            Login with GitHub
            </button>
        </div>
        </div>
    )
}

export default LoginPage