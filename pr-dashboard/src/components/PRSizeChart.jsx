import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts'

const COLORS = { Small: '#10B981', Medium: '#F59E0B', Large: '#EF4444' }

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#0D1117] border border-white/10 rounded-lg px-3 py-2">
        <p className="text-xs text-gray-500">{payload[0].payload.name}</p>
        <p className="text-white font-semibold text-sm">{payload[0].value} PRs</p>
      </div>
    )
  }
  return null
}

function PRSizeChart({ prSizes }) {
  const buckets = { Small: 0, Medium: 0, Large: 0 }
  prSizes.forEach(pr => {
    if (pr.total < 100) buckets.Small++
    else if (pr.total < 500) buckets.Medium++
    else buckets.Large++
  })

  const data = Object.entries(buckets).map(([name, count]) => ({ name, count }))

  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-5">PR Size Distribution</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} barSize={40}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#4B5563', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#4B5563', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {data.map(entry => (
              <Cell key={entry.name} fill={COLORS[entry.name]} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-4 mt-3 justify-center">
        {data.map(d => (
          <div key={d.name} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: COLORS[d.name] }} />
            <span className="text-xs text-gray-500">{d.name} &lt;{d.name === 'Small' ? '100' : d.name === 'Medium' ? '500' : '500+'} lines</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PRSizeChart