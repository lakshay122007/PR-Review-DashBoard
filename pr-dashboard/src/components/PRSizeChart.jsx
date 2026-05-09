import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function PRSizeChart({ prSizes }) {
    const buckets = { Small: 0, Medium: 0, Large: 0 }

    prSizes.forEach(pr => {
        if (pr.total < 100) buckets.Small++
        else if (pr.total < 500) buckets.Medium++
        else buckets.Large++
    })

    const data = Object.entries(buckets).map(([name, count]) => ({ name, count }))

    return (
        <div className="bg-gray-900 rounded-lg p-4 mt-6">
        <p className="text-sm text-gray-400 mb-4">PR size distribution</p>
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
            <XAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <YAxis tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <Tooltip contentStyle={{ background: '#111827', border: '1px solid #374151' }} />
            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
        </div>
    )
}

export default PRSizeChart