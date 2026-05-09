function PRTimeline({ prs }) {
  const merged = prs
    .filter(pr => pr.merged_at)
    .slice(0, 15)
    .map(pr => {
      const start = new Date(pr.created_at)
      const end = new Date(pr.merged_at)
      const hours = Math.round((end - start) / (1000 * 60 * 60))
      return { title: pr.title, number: pr.number, hours, url: pr.html_url, author: pr.user.login }
    })

  const maxHours = Math.max(...merged.map(p => p.hours), 1)

  const getColor = (hours) => {
    if (hours < 24) return { bar: '#10B981', bg: 'rgba(16,185,129,0.1)', text: '#10B981' }
    if (hours < 72) return { bar: '#F59E0B', bg: 'rgba(245,158,11,0.1)', text: '#F59E0B' }
    return { bar: '#EF4444', bg: 'rgba(239,68,68,0.1)', text: '#EF4444' }
  }

  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-500 uppercase tracking-widest">PR Timeline</p>
        <div className="flex items-center gap-4">
          {[['< 24h', '#10B981'], ['< 72h', '#F59E0B'], ['72h+', '#EF4444']].map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: color }} />
              <span className="text-xs text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-600 mb-5">Last 15 merged PRs — width = cycle time</p>

      <div className="flex flex-col gap-2">
        {merged.map(pr => {
          const { bar, bg, text } = getColor(pr.hours)
          return (
            <a key={pr.number} href={pr.url} target="_blank" rel="noreferrer"
              className="group flex items-center gap-3 hover:bg-white/[0.02] rounded-lg p-1.5 -mx-1.5 transition">
              <span className="text-xs text-gray-600 w-14 flex-shrink-0 text-right">#{pr.number}</span>
              <div className="flex-1 relative h-7 bg-white/[0.03] rounded-md overflow-hidden">
                <div className="h-full rounded-md flex items-center px-3 transition-all"
                  style={{ width: `${Math.max(4, (pr.hours / maxHours) * 100)}%`, background: bg, borderLeft: `2px solid ${bar}` }}>
                  <span className="text-xs truncate group-hover:text-white transition"
                    style={{ color: text }}>
                    {pr.title}
                  </span>
                </div>
              </div>
              <span className="text-xs flex-shrink-0 w-12 text-right" style={{ color: text }}>
                {pr.hours < 24 ? `${pr.hours}h` : `${Math.round(pr.hours / 24)}d`}
              </span>
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default PRTimeline