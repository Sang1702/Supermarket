import { TrendingUp } from 'lucide-react'

export default function KpiCard({ title, value, icon, delta, deltaType = 'up' }) {
  const deltaColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  }

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs text-gray-500 mb-1">{title}</div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
        </div>
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-xl">
          {icon}
        </div>
      </div>
      <div className={`text-xs flex items-center gap-1 ${deltaColors[deltaType]}`}>
        {deltaType === 'up' && <TrendingUp className="w-3 h-3" />}
        <span>{delta}</span>
      </div>
    </div>
  )
}
