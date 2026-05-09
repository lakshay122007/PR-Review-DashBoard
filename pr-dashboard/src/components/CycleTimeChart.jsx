import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-[#0D1117] border border-white/10 rounded-lg px-3 py-2">
        <p className="text-xs text-gray-500">PR #{payload[0].payload.name}</p>
        <p className="text-white font-semibold text-sm">{payload[0].value}h</p>
      </div>
    )
  }
  return null
}

function CycleTimeChart({ prs }) {
  const data = prs
    .filter(pr => pr.merged_at)
    .map(pr => ({
      name: pr.number,
      hours: Math.round((new Date(pr.merged_at) - new Date(pr.created_at)) / (1000 * 60 * 60))
    }))
    .reverse()

  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-5">Cycle Time per PR</p>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="cycleGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
          <XAxis dataKey="name" tick={{ fill: '#4B5563', fontSize: 10 }} axisLine={false} tickLine={false} label={{ value: 'PR #', position: 'insideBottom', fill: '#4B5563', fontSize: 10 }} />
          <YAxis tick={{ fill: '#4B5563', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area type="monotone" dataKey="hours" stroke="#3B82F6" strokeWidth={2} fill="url(#cycleGrad)" dot={false} activeDot={{ r: 4, fill: '#3B82F6', stroke: '#080C14', strokeWidth: 2 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CycleTimeChart