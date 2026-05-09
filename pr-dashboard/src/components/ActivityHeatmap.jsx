function ActivityHeatmap({ prs }) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const counts = Array(7).fill(0)

  prs.forEach(pr => {
    if (pr.merged_at) {
      counts[new Date(pr.merged_at).getDay()]++
    }
  })

  const max = Math.max(...counts, 1)
  const peak = counts.indexOf(Math.max(...counts))

  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs text-gray-500 uppercase tracking-widest">Merge Activity by Day</p>
        <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
          Peak: {days[peak]}
        </span>
      </div>

      <div className="flex items-end gap-3 h-32">
        {days.map((day, i) => {
          const isPeak = i === peak
          const ratio = counts[i] / max
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-xs font-medium"
                style={{ color: isPeak ? '#60A5FA' : counts[i] === 0 ? '#374151' : '#6B7280' }}>
                {counts[i]}
              </span>
              <div className="w-full relative rounded-lg overflow-hidden"
                style={{ height: `${Math.max(6, ratio * 96)}px` }}>
                <div className="absolute inset-0 rounded-lg"
                  style={{
                    background: isPeak
                      ? 'linear-gradient(180deg, #60A5FA, #3B82F6)'
                      : counts[i] === 0
                      ? '#ffffff06'
                      : `rgba(59,130,246,${0.15 + ratio * 0.4})`,
                    boxShadow: isPeak ? '0 0 16px rgba(59,130,246,0.3)' : 'none'
                  }}
                />
              </div>
              <span className="text-xs" style={{ color: isPeak ? '#93C5FD' : '#4B5563' }}>{day}</span>
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/[0.05]">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        <p className="text-xs text-gray-600">
          Most merges happen on <span className="text-white font-medium">{days[peak]}</span> —
          weekends are typically quieter
        </p>
      </div>
    </div>
  )
}

export default ActivityHeatmap