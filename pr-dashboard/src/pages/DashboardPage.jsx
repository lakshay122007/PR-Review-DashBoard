import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { getUser, getUserRepos, getRepoPRs, getPRReviews, getOpenPRs } from '../api/github'
import { computeCycleTime, computeReviewLag, computeReviewerLoad, flagStale, computeHealthScore } from '../metrics/computeMetrics'
import Navbar from '../components/Navbar'
import CycleTimeChart from '../components/CycleTimeChart'
import PRSizeChart from '../components/PRSizeChart'
import SkeletonCard from '../components/SkeletonCard'
import ActivityHeatmap from '../components/ActivityHeatmap'
import PRTimeline from '../components/PRTimeline'


const font = "'DM Sans', sans-serif"

function MetricCard({ label, value, sub, accent }) {
  return (
    <div className="relative bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 overflow-hidden group hover:bg-white/[0.05] transition-all">
      <div className={`absolute top-0 left-0 w-1 h-full rounded-l-2xl ${accent}`} />
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-3xl font-bold text-white" style={{ fontFamily: "'DM Mono', monospace" }}>{value}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </div>
  )
}

function RepoCard({ repo, selected, onClick }) {
  const langColors = {
    JavaScript: '#F7DF1E', TypeScript: '#3178C6', Python: '#3776AB',
    Go: '#00ADD8', Rust: '#CE4A16', HTML: '#E34F26', CSS: '#1572B6'
  }

  return (
    <button onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all ${
        selected
          ? 'border-blue-500/40 bg-blue-500/10 text-white'
          : 'border-transparent hover:bg-white/[0.04] text-gray-400 hover:text-white'
      }`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium truncate">{repo.name}</p>
        <span className={`text-[9px] px-1.5 py-0.5 rounded flex-shrink-0 font-medium ${
          repo.private ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-400'
        }`}>
          {repo.private ? 'Private' : 'Public'}
        </span>
      </div>
      {repo.language && (
        <div className="flex items-center gap-1.5 mt-1">
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: langColors[repo.language] || '#6B7280' }} />
          <p className="text-[10px] text-gray-600">{repo.language}</p>
        </div>
      )}
    </button>
  )
}

export default function DashboardPage() {
    const token = useAuthStore(s => s.token)
    const logout = useAuthStore(s => s.logout)
    const navigate = useNavigate()

    const [user, setUser] = useState(null)
    const [repos, setRepos] = useState([])
    const [selectedRepo, setSelectedRepo] = useState(null)
    const [metrics, setMetrics] = useState(null)
    const [prs, setPrs] = useState([])
    const [prSizes, setPrSizes] = useState([])
    const [stalePRs, setStalePRs] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [customOwner, setCustomOwner] = useState('')
    const [customRepo, setCustomRepo] = useState('')
    const [healthScore, setHealthScore] = useState(null)
    const [activeTab, setActiveTab] = useState('overview')
    const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!token) { navigate('/'); return }
    getUser(token).then(setUser)
    getUserRepos(token).then(setRepos)
  }, [token])

  const handleRepoSelect = async (repo) => {
    setSelectedRepo(repo)
    setMetrics(null)
    setLoading(true)

    const prsData = await getRepoPRs(token, repo.owner.login, repo.name)
    const reviewsPerPR = await Promise.all(
      prsData.map(pr => getPRReviews(token, repo.owner.login, repo.name, pr.number))
    )
    const openPRs = await getOpenPRs(token, repo.owner.login, repo.name)

    const cycleTimes = prsData.map(pr => computeCycleTime(pr)).filter(v => v !== null)
    const reviewLags = prsData.map((pr, i) => computeReviewLag(pr, reviewsPerPR[i])).filter(v => v !== null)

    const avgCycleTime = cycleTimes.length
      ? Math.round(cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length) : 0
    const avgReviewLag = reviewLags.length
      ? Math.round(reviewLags.reduce((a, b) => a + b, 0) / reviewLags.length) : 0

        const score = computeHealthScore({
        avgCycleTime,
        avgReviewLag,
        stalePRs: openPRs.filter(pr => flagStale(pr)),
        reviewerLoad: computeReviewerLoad(prsData, reviewsPerPR),
        totalPRs: prsData.length
    })
    setHealthScore(score)

    setPrs(prsData)
    setPrSizes(prsData.map(pr => ({ number: pr.number, total: (pr.additions || 0) + (pr.deletions || 0) })))
    setStalePRs(openPRs.filter(pr => flagStale(pr)))
    setMetrics({ avgCycleTime, avgReviewLag, totalPRs: prsData.length, reviewerLoad: computeReviewerLoad(prsData, reviewsPerPR) })
    setLoading(false)
  }

  const filteredRepos = repos.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))

  if (!user) {
    return (
      <div style={{ fontFamily: font }} className="min-h-screen bg-[#080C14] flex items-center justify-center">
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-6">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 bg-blue-400 rounded-full"
                style={{ animation: 'bounce 1s infinite', animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
          <p className="text-white font-medium">Loading your workspace</p>
          <p className="text-gray-500 text-sm mt-1">Fetching from GitHub...</p>
        </div>
        <style>{`@keyframes bounce { 0%,100%{transform:translateY(0);opacity:.4} 50%{transform:translateY(-8px);opacity:1} }`}</style>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: font }} className="min-h-screen bg-[#080C14] text-white">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0);opacity:.4} 50%{transform:translateY(-8px);opacity:1} }`}</style>

      <Navbar user={user} />

      <div className="flex flex-col md:flex-row h-auto md:h-[calc(100vh-57px)]">

        {/* sidebar */}
        <>
          {/* mobile toggle button */}
          <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#060A11]">
            <p className="text-xs text-gray-500 uppercase tracking-widest">
              {selectedRepo ? selectedRepo.name : 'Select a repo'}
            </p>
            <button onClick={() => setSidebarOpen(true)}
              className="text-xs bg-white/[0.05] border border-white/[0.08] px-3 py-1.5 rounded-lg text-gray-300">
              Browse repos
            </button>
          </div>

          {/* mobile bottom sheet overlay */}
          {sidebarOpen && (
            <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
              <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
              <div className="relative bg-[#060A11] border-t border-white/[0.08] rounded-t-2xl max-h-[80vh] flex flex-col z-10">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                  <p className="text-sm font-medium text-white">Your repos</p>
                  <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-white text-lg">✕</button>
                </div>
                <div className="p-3 border-b border-white/[0.06]">
                  <input
                    type="text"
                    placeholder="Search repos..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/40 transition"
                  />
                </div>
                <div className="p-3 border-b border-white/[0.06]">
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">Analyze any public repo</p>
                  <div className="flex flex-col gap-1.5">
                    <input type="text" placeholder="owner (e.g. vercel)" value={customOwner}
                      onChange={e => setCustomOwner(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/40 transition" />
                    <input type="text" placeholder="repo (e.g. next.js)" value={customRepo}
                      onChange={e => setCustomRepo(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/40 transition" />
                    <button
                      onClick={() => { handleRepoSelect({ id: 'custom', name: customRepo, owner: { login: customOwner }, language: null, private: false }); setSidebarOpen(false) }}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs py-1.5 rounded-lg transition font-medium">
                      Analyze
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
                  {filteredRepos.map(repo => (
                    <RepoCard key={repo.id} repo={repo} selected={selectedRepo?.id === repo.id}
                      onClick={() => { handleRepoSelect(repo); setSidebarOpen(false) }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* desktop sidebar */}
          <aside className="hidden md:flex w-64 flex-shrink-0 border-r border-white/[0.06] flex-col bg-[#060A11] h-full">
            <div className="p-3 border-b border-white/[0.06]">
              <input type="text" placeholder="Search repos..." value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/40 transition" />
            </div>
            <div className="p-3 border-b border-white/[0.06]">
              <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-2">Analyze any public repo</p>
              <div className="flex flex-col gap-1.5">
                <input type="text" placeholder="owner (e.g. vercel)" value={customOwner}
                  onChange={e => setCustomOwner(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/40 transition" />
                <input type="text" placeholder="repo (e.g. next.js)" value={customRepo}
                  onChange={e => setCustomRepo(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.07] rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/40 transition" />
                <button
                  onClick={() => handleRepoSelect({ id: 'custom', name: customRepo, owner: { login: customOwner }, language: null, private: false })}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs py-1.5 rounded-lg transition font-medium">
                  Analyze
                </button>
              </div>
            </div>
            <div className="p-2 border-b border-white/[0.06]">
              <p className="text-[10px] text-gray-600 uppercase tracking-widest px-2 py-1">Your repos</p>
            </div>
            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
              {filteredRepos.map(repo => (
                <RepoCard key={repo.id} repo={repo} selected={selectedRepo?.id === repo.id}
                  onClick={() => handleRepoSelect(repo)} />
              ))}
            </div>
          </aside>
        </>

        {/* main content */}
        <main className="flex-1 overflow-y-auto">
          {!selectedRepo && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/[0.03] border border-white/[0.07] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-gray-400 font-medium">Select a repo to analyze</p>
                <p className="text-gray-600 text-sm mt-1 mb-4">Pick one from the sidebar</p>
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden bg-blue-600 hover:bg-blue-500 text-white text-sm px-6 py-2.5 rounded-xl transition font-medium">
                  Browse repos
                </button>
              </div>
            </div>
          )}

          {selectedRepo && (
            <div className="p-8">
                <div className="mb-6">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Analyzing</p>
                <h2 className="text-2xl font-bold mb-4">{selectedRepo.name}</h2>
                <div className="flex gap-1 border-b border-white/[0.06]">
                    {['overview', 'timeline', 'activity'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm capitalize transition ${
                        activeTab === tab
                            ? 'text-white border-b-2 border-blue-500'
                            : 'text-gray-500 hover:text-gray-300'
                        }`}>
                        {tab}
                    </button>
                    ))}
                </div>
                </div>

              {loading && (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <SkeletonCard /><SkeletonCard /><SkeletonCard />
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <div className="flex gap-1">
                      {[0,1,2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                          style={{ animation: 'bounce 1s infinite', animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                    Fetching PR data...
                  </div>
                </div>
              )}
                {metrics && !loading && (
                <div>
                    {activeTab === 'overview' && (
                    <div>
                        {healthScore !== null && (
                        <div className="mb-8 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 flex items-center gap-8">
                            <div className="relative w-24 h-24 flex-shrink-0">
                            <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ffffff08" strokeWidth="3" />
                                <circle cx="18" cy="18" r="15.9" fill="none"
                                stroke={healthScore >= 70 ? '#10B981' : healthScore >= 40 ? '#F59E0B' : '#EF4444'}
                                strokeWidth="3"
                                strokeDasharray={`${healthScore} 100`}
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dasharray 1s ease' }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-2xl font-bold text-white" style={{ fontFamily: "'DM Mono', monospace" }}>
                                {healthScore}
                                </span>
                            </div>
                            </div>
                            <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Repo Health Score</p>
                            <p className="text-xl font-bold mb-1"
                                style={{ color: healthScore >= 70 ? '#10B981' : healthScore >= 40 ? '#F59E0B' : '#EF4444' }}>
                                {healthScore >= 70 ? 'Healthy' : healthScore >= 40 ? 'Needs Attention' : 'Critical'}
                            </p>
                            <p className="text-sm text-gray-500">Based on cycle time, review lag, stale PRs and reviewer distribution.</p>
                            </div>
                        </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <MetricCard label="Avg Cycle Time" value={`${metrics.avgCycleTime}h`} sub="first commit → merge" accent="bg-blue-500" />
                        <MetricCard label="Avg Review Lag" value={`${metrics.avgReviewLag}h`} sub="open → first review" accent="bg-purple-500" />
                        <MetricCard label="PRs Analyzed" value={metrics.totalPRs} sub="last 100 closed" accent="bg-emerald-500" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <CycleTimeChart prs={prs} />
                        <PRSizeChart prSizes={prSizes} />
                        </div>

                        {metrics.reviewerLoad.length > 0 && (
                        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 mb-6">
                            <p className="text-xs text-gray-500 uppercase tracking-widest mb-5">Reviewer Load</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {metrics.reviewerLoad.slice(0, 8).map(({ login, count }, i) => (
                                <div key={login} className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                    {login[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-white truncate">{login}</span>
                                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{count} reviews</span>
                                    </div>
                                    <div className="w-full bg-white/[0.05] rounded-full h-1">
                                    <div className="h-1 rounded-full transition-all"
                                        style={{
                                        width: `${(count / metrics.reviewerLoad[0].count) * 100}%`,
                                        background: i === 0 ? '#3B82F6' : i === 1 ? '#8B5CF6' : '#6B7280'
                                        }} />
                                    </div>
                                </div>
                                </div>
                            ))}
                            </div>
                        </div>
                        )}

                        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs text-gray-500 uppercase tracking-widest">Stale PRs</p>
                            {stalePRs.length > 0 && (
                            <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">
                                {stalePRs.length} need attention
                            </span>
                            )}
                        </div>
                        {stalePRs.length === 0 ? (
                            <div className="flex items-center gap-3 py-2">
                            <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-white">All clear</p>
                                <p className="text-xs text-gray-600 mt-0.5">No stale open PRs — this repo moves fast</p>
                            </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                            {stalePRs.map(pr => (
                                <a key={pr.id} href={pr.html_url} target="_blank" rel="noreferrer"
                                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] transition group">
                                <div className="min-w-0">
                                    <p className="text-sm text-white truncate group-hover:text-blue-400 transition">{pr.title}</p>
                                    <p className="text-xs text-gray-600 mt-0.5">@{pr.user.login}</p>
                                </div>
                                <span className="text-xs text-red-400 flex-shrink-0 ml-4">
                                    {Math.floor((new Date() - new Date(pr.updated_at)) / (1000 * 60 * 60 * 24))}d ago
                                </span>
                                </a>
                            ))}
                            </div>
                        )}
                        </div>
                    </div>
                    )}

                    {activeTab === 'timeline' && <PRTimeline prs={prs} />}
                    {activeTab === 'activity' && <ActivityHeatmap prs={prs} />}
                </div>
)}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}