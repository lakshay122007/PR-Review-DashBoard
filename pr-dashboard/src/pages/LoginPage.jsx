import { useEffect, useState } from 'react'

const WORDS = ['Cycle Time', 'Review Lag', 'Bottlenecks', 'Team Health']

const STATS = [
  { value: '2.4x', label: 'faster merge cycles' },
  { value: '68%', label: 'reduction in stale PRs' },
  { value: '3min', label: 'to get your first insight' },
]

const FEATURES = [
  { title: 'Cycle Time', desc: 'From first commit to merge — see where time goes.' },
  { title: 'Review Lag', desc: 'How long PRs sit before someone looks at them.' },
  { title: 'Reviewer Load', desc: 'Who is doing all the reviews? Find the bottleneck.' },
  { title: 'Stale PRs', desc: 'Open PRs going cold. Catch them before they rot.' },
]

export default function LoginPage() {
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID
  const redirectUri = 'https://pr-dashboard-puce.vercel.app/callback'
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const word = WORDS[wordIndex]
    let t
    if (!deleting && displayed.length < word.length)
      t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80)
    else if (!deleting && displayed.length === word.length)
      t = setTimeout(() => setDeleting(true), 1500)
    else if (deleting && displayed.length > 0)
      t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
    else { setDeleting(false); setWordIndex((wordIndex + 1) % WORDS.length) }
    return () => clearTimeout(t)
  }, [displayed, deleting, wordIndex])

  const handleLogin = () => {
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=repo,user`
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-[#080C14] text-white overflow-x-hidden">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* ambient blobs */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px]"
        style={{ background: 'radial-gradient(circle, #3B82F6, transparent)' }} />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[100px]"
        style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }} />

      {/* grid */}
      <div className="fixed inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

      {/* navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-500 rounded-md flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </div>
          <span className="font-semibold text-sm">PR Dashboard</span>
        </div>
        <button onClick={handleLogin}
          className="text-sm text-gray-400 hover:text-white border border-white/10 hover:border-white/20 px-4 py-1.5 rounded-lg transition">
          Sign in
        </button>
      </nav>

      {/* hero */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 pt-24 pb-16 text-center"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-xs text-blue-400 mb-8">
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
          Free for all GitHub repos
        </div>

        <h1 className="text-6xl font-bold leading-tight mb-4" style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: '-0.03em' }}>
          Track your team's
          <br />
          <span className="text-blue-400">{displayed}<span className="animate-pulse">|</span></span>
        </h1>

        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Real engineering metrics from your GitHub repos. Know exactly where your code is getting stuck.
        </p>

        <button onClick={handleLogin}
          className="inline-flex items-center gap-3 bg-white text-gray-950 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 active:scale-95 transition-all duration-150 shadow-2xl text-base">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Continue with GitHub
        </button>
        <p className="text-gray-600 text-xs mt-4">Only reads data. Never writes anything.</p>
      </section>

      {/* stats bar */}
      <section className="relative z-10 border-y border-white/5 py-8">
        <div className="max-w-3xl mx-auto grid grid-cols-3 divide-x divide-white/5">
          {STATS.map(s => (
            <div key={s.value} className="text-center px-8">
              <p className="text-3xl font-bold text-white" style={{ fontFamily: "'DM Mono', monospace" }}>{s.value}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* features grid */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 py-20">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-8 text-center">What you get</p>
        <div className="grid grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <div key={f.title}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.05] transition"
              style={{ animationDelay: `${i * 100}ms` }}>
              <p className="font-semibold text-white mb-2">{f.title}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}