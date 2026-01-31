import { useEffect, useState } from 'react'
import KpiCard from '../components/KpiCard'
import { dashboardService } from '../services/dashboardService'
import { FileText, X } from 'lucide-react'

export default function DashboardHome() {
  const [stats, setStats] = useState({
    ordersToday: 0,
    revenueToday: 0,
    newCustomers: 0,
    avgOrderValue: 0,
    totalRevenue: 0,
    totalOrders: 0,
    products: 0,
    customers: 0,
  })
  const [loading, setLoading] = useState(true)
  const [showReportsModal, setShowReportsModal] = useState(false)
  const [revenuePeriod, setRevenuePeriod] = useState('Monthly')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const data = await dashboardService.getSummary()
      setStats({
        ordersToday: data.ordersToday || 0,
        revenueToday: data.revenueToday || 0,
        newCustomers: data.newCustomers || 0,
        avgOrderValue: data.avgOrderValue || 0,
        totalRevenue: data.totalRevenue || 0,
        totalOrders: data.totalOrders || 0,
        products: data.products || 0,
        customers: data.customers || 0,
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Fallback to default values if API fails
      setStats({
        ordersToday: 0,
        revenueToday: 0,
        newCustomers: 0,
        avgOrderValue: 0,
        totalRevenue: 0,
        totalOrders: 0,
        products: 0,
        customers: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">
            Dashboard Overview
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, <span className="text-green-600">Admin</span>
          </h1>
          <p className="text-gray-600">
            Here's your complete business overview for today
          </p>
        </div>
        <button
          onClick={() => setShowReportsModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-sm font-medium hover:shadow-lg transition-shadow flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          View Reports
        </button>
      </div>

      {/* Today's Performance KPIs */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium text-gray-700">Today's Performance</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Orders Today"
            value={stats.ordersToday}
            icon="🛒"
            delta="+18% vs yesterday"
            deltaType="up"
          />
          <KpiCard
            title="Revenue Today"
            value={`$${stats.revenueToday.toLocaleString()}`}
            icon="💵"
            delta="+12% vs yesterday"
            deltaType="up"
          />
          <KpiCard
            title="New Customers"
            value={stats.newCustomers}
            icon="👤"
            delta="Registered today"
            deltaType="neutral"
          />
          <KpiCard
            title="Avg Order Value"
            value={`$${stats.avgOrderValue.toFixed(2)}`}
            icon="📈"
            delta="+8% improvement"
            deltaType="up"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Revenue (7 months)</span>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              +12.5%
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            ${stats.totalRevenue.toLocaleString()}
          </div>
          <div className="h-16 bg-gradient-to-t from-blue-50 to-transparent rounded-lg mt-3"></div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Orders</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              +8.2%
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.totalOrders}</div>
          <p className="text-xs text-gray-500 mt-2">Orders in last 7 days</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Products</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{stats.products}</div>
          <p className="text-xs text-gray-500 mt-2">3 new this week</p>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Revenue Analytics</h3>
              <p className="text-xs text-gray-500">7-month performance overview</p>
            </div>
            <div className="flex gap-1 bg-gray-100 rounded-full p-1">
              <button 
                onClick={() => setRevenuePeriod('Monthly')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${revenuePeriod === 'Monthly' ? 'bg-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setRevenuePeriod('Weekly')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${revenuePeriod === 'Weekly' ? 'bg-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                Weekly
              </button>
              <button 
                onClick={() => setRevenuePeriod('Daily')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${revenuePeriod === 'Daily' ? 'bg-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}
              >
                Daily
              </button>
            </div>
          </div>
          <div className="h-48 bg-gradient-to-t from-green-50 to-transparent rounded-lg flex items-center justify-center text-gray-400 text-sm">
            [Revenue Chart - Install recharts to display]
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900">Orders Trend</h3>
            <p className="text-xs text-gray-500">Last 7 months activity</p>
          </div>
          <div className="h-48 bg-gradient-to-t from-blue-50 to-transparent rounded-lg flex items-center justify-center text-gray-400 text-sm">
            [Orders Chart - Install recharts to display]
          </div>
        </div>
      </div>

      {/* Reports Modal */}
      {showReportsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Business Reports</h2>
                <p className="text-sm text-gray-600 mt-1">Comprehensive analytics and insights</p>
              </div>
              <button
                onClick={() => setShowReportsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Report Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-green-500 transition-colors cursor-pointer">
                  <h3 className="font-semibold text-gray-900 mb-2">Sales Report</h3>
                  <p className="text-sm text-gray-600">Revenue, orders, and sales trends</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-green-500 transition-colors cursor-pointer">
                  <h3 className="font-semibold text-gray-900 mb-2">Inventory Report</h3>
                  <p className="text-sm text-gray-600">Stock levels and product performance</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-green-500 transition-colors cursor-pointer">
                  <h3 className="font-semibold text-gray-900 mb-2">Customer Report</h3>
                  <p className="text-sm text-gray-600">Customer analytics and behavior</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:border-green-500 transition-colors cursor-pointer">
                  <h3 className="font-semibold text-gray-900 mb-2">Supplier Report</h3>
                  <p className="text-sm text-gray-600">Supplier performance and orders</p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-gray-600">Total Revenue</div>
                    <div className="text-lg font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Total Orders</div>
                    <div className="text-lg font-bold text-gray-900">{stats.totalOrders}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Products</div>
                    <div className="text-lg font-bold text-gray-900">{stats.products}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600">Customers</div>
                    <div className="text-lg font-bold text-gray-900">{stats.customers}</div>
                  </div>
                </div>
              </div>

              {/* Export Options */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Export Reports</h3>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                    Export as PDF
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                    Export as Excel
                  </button>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                    Export as CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
