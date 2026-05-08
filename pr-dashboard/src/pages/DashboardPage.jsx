import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { getUser, getUserRepos, getRepoPRs, getPRReviews, getOpenPRs } from '../api/github'
import { computeCycleTime, computeReviewLag, computeReviewerLoad, flagStale } from '../metrics/computeMetrics'
import CycleTimeChart from '../components/CycleTimeChart'
import Navbar from '../components/Navbar'

function DashboardPage() {
    const token = useAuthStore((state) => state.token)
    const logout = useAuthStore((state) => state.logout)
    const navigate = useNavigate()
    const [prs, setPrs] = useState([])
    const [stalePRs, setStalePRs] = useState([])

    const [user, setUser] = useState(null)
    const [repos, setRepos] = useState([])
    const [selectedRepo, setSelectedRepo] = useState(null)
    const [metrics, setMetrics] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!token) {
        navigate('/')
        return
        }
        getUser(token).then(setUser)
        getUserRepos(token).then(setRepos)
    }, [token])

    const handleRepoSelect = async (repo) => {
        setSelectedRepo(repo)
        setLoading(true)

        const prs = await getRepoPRs(token, repo.owner.login, repo.name)
        setPrs(prs)
        const openPRs = await getOpenPRs(token, repo.owner.login, repo.name)
        const stale = openPRs.filter(pr => flagStale(pr))
        setStalePRs(stale)

        const reviewsPerPR = await Promise.all(
        prs.map(pr => getPRReviews(token, repo.owner.login, repo.name, pr.number))
        )

        const cycleTimes = prs
        .map(pr => computeCycleTime(pr))
        .filter(v => v !== null)

        const reviewLags = prs
        .map((pr, i) => computeReviewLag(pr, reviewsPerPR[i]))
        .filter(v => v !== null)

        const avgCycleTime = cycleTimes.length
        ? Math.round(cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length)
        : 0

        const avgReviewLag = reviewLags.length
        ? Math.round(reviewLags.reduce((a, b) => a + b, 0) / reviewLags.length)
        : 0

        const reviewerLoad = computeReviewerLoad(prs, reviewsPerPR)

        setMetrics({ avgCycleTime, avgReviewLag, reviewerLoad, totalPRs: prs.length })
        setLoading(false)
    }

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
    <div className="min-h-screen bg-gray-950 text-white">
    <Navbar user={user} />
        <div className="p-8">

        <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Select a repo</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {repos.map(repo => (
                <button
                key={repo.id}
                onClick={() => handleRepoSelect(repo)}
                className={`text-left p-4 rounded-lg border transition ${
                    selectedRepo?.id === repo.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 bg-gray-900 hover:border-gray-500'
                }`}
                >
                <p className="font-medium text-sm">{repo.name}</p>
                <p className="text-gray-400 text-xs mt-1">
                    {repo.private ? 'Private' : 'Public'}
                </p>
                </button>
            ))}
            </div>
        </div>

        {loading && (
            <p className="text-gray-400">Fetching PR data...</p>
        )}

        {metrics && !loading && (
        <div>
            <h2 className="text-lg font-semibold mb-4">
                Metrics — {selectedRepo.name}
            </h2>

            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Avg cycle time</p>
                <p className="text-2xl font-bold">{metrics.avgCycleTime}h</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Avg review lag</p>
                <p className="text-2xl font-bold">{metrics.avgReviewLag}h</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">PRs analyzed</p>
                <p className="text-2xl font-bold">{metrics.totalPRs}</p>
                </div>
            </div>

            <h3 className="font-semibold mb-3">Reviewer load</h3>
            <div className="flex flex-col gap-2">
                {metrics.reviewerLoad.map(({ login, count }) => (
                <div key={login} className="flex items-center gap-3">
                    <span className="text-sm w-32 text-gray-300">{login}</span>
                    <div className="flex-1 bg-gray-800 rounded-full h-2">
                    <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                        width: `${(count / metrics.reviewerLoad[0].count) * 100}%`
                        }}
                    />
                    </div>
                    <span className="text-sm text-gray-400">{count}</span>
                </div>
                ))}
                <CycleTimeChart prs={prs} />
                {stalePRs.length > 0 && (
                    <div className="mt-6">
                        <h3 className="font-semibold mb-3">
                        Stale PRs
                        <span className="ml-2 text-sm text-red-400">
                            {stalePRs.length} need attention
                        </span>
                        </h3>
                        <div className="flex flex-col gap-2">
                        {stalePRs.map(pr => (
                            <a
                            key={pr.id}
                            href={pr.html_url}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-gray-900 rounded-lg p-4 flex items-center justify-between hover:bg-gray-800 transition"
                            >
                            <div>
                                <p className="text-sm font-medium">{pr.title}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                by @{pr.user.login}
                                </p>
                            </div>
                            <span className="text-xs text-red-400 flex-shrink-0 ml-4">
                                {Math.floor(
                                (new Date() - new Date(pr.updated_at)) / (1000 * 60 * 60 * 24)
                                )}d ago
                            </span>
                            </a>
                        ))}
                    </div>
                </div>
                        )}
            </div>
        </div>
        
        )}
    </div>
    </div>
    )
}

export default DashboardPage