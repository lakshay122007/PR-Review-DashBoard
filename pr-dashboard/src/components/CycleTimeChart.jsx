import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from 'recharts'

function CycleTimeChart({ prs }) {
    const data = prs
        .filter(pr => pr.merged_at)
        .map(pr => ({
        name: pr.number,
        hours: Math.round(
            (new Date(pr.merged_at) - new Date(pr.created_at)) / (1000 * 60 * 60)
        )
        }))
        .reverse()

    return (
        <div className="bg-gray-900 rounded-lg p-4 mt-6">
        <p className="text-sm text-gray-400 mb-4">Cycle time per PR (hours)</p>
        <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
                dataKey="name"
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                label={{ value: 'PR #', position: 'insideBottom', fill: '#9CA3AF' }}
            />
            <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} />
            <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #374151' }}
                labelStyle={{ color: '#F9FAFB' }}
            />
            <Line
                type="monotone"
                dataKey="hours"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
            />
            </LineChart>
        </ResponsiveContainer>
        </div>
    )
}

export default CycleTimeChart