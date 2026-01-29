import { useState } from 'react'
import KpiCard from '../components/KpiCard'
import { Package, Download, Plus, AlertTriangle } from 'lucide-react'

// Mock data - sẽ thay bằng API thật sau
const mockInventory = [
  {
    id: 'INV001',
    product: {
      name: 'Fresh Milk 1L',
      icon: '🥛',
      category: 'Dairy',
    },
    currentStock: 145,
    reorderLevel: 50,
    status: 'Sufficient',
    lastRestocked: '2026-01-20',
    supplier: 'DairyFr Co.',
  },
  {
    id: 'INV002',
    product: {
      name: 'Whole Wheat Bread',
      icon: '🍞',
      category: 'Bakery',
    },
    currentStock: 89,
    reorderLevel: 30,
    status: 'Sufficient',
    lastRestocked: '2026-01-24',
    supplier: 'Golden Bakery',
  },
  {
    id: 'INV003',
    product: {
      name: 'Organic Eggs (12)',
      icon: '🥚',
      category: 'Dairy',
    },
    currentStock: 12,
    reorderLevel: 25,
    status: 'Reorder Needed',
    lastRestocked: '2026-01-15',
    supplier: 'Farm Fresh Li',
  },
  {
    id: 'INV004',
    product: {
      name: 'Apple Juice 1L',
      icon: '🧃',
      category: 'Beverages',
    },
    currentStock: 203,
    reorderLevel: 40,
    status: 'Sufficient',
    lastRestocked: '2026-01-22',
    supplier: 'Fruit Valley',
  },
  {
    id: 'INV005',
    product: {
      name: 'Brown Rice 2kg',
      icon: '🌾',
      category: 'Grains',
    },
    currentStock: 67,
    reorderLevel: 30,
    status: 'Sufficient',
    lastRestocked: '2026-01-18',
    supplier: 'Grain Masters',
  },
]

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState('')

  const totalItems = mockInventory.length
  const needsReorder = mockInventory.filter(
    (item) => item.status === 'Reorder Needed'
  ).length
  const totalStock = mockInventory.reduce(
    (sum, item) => sum + item.currentStock,
    0
  )

  const filteredInventory = mockInventory.filter(
    (item) =>
      item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
              Warehouse Management
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Inventory Management
          </h1>
          <p className="text-gray-600 text-sm">
            Track and manage stock levels across warehouses
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm hover:bg-gray-50 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-medium shadow-md hover:shadow-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Stock Entry
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-purple-200 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Total Items</div>
              <div className="text-3xl font-bold text-gray-900">{totalItems}</div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-xs text-gray-500">Products tracked</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-xl p-5 text-white shadow-md">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs opacity-90 mb-1">Needs Reorder</div>
              <div className="text-3xl font-bold">{needsReorder}</div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <div className="text-xs opacity-90">Critical attention</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-green-200 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Total Stock</div>
              <div className="text-3xl font-bold text-gray-900">
                {totalStock.toLocaleString()}
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-xs text-gray-500">Units in warehouse</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search inventory by product or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <button className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filters
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Inventory ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Reorder Level
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Last Restocked
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Supplier
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No inventory items found
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 rounded-md bg-gray-100 text-gray-800 font-mono text-sm font-semibold">
                        {item.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-xl">
                          {item.product.icon}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.product.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.product.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          {item.currentStock}
                        </span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
                          <div
                            className={`h-full rounded-full ${
                              item.currentStock < item.reorderLevel
                                ? 'bg-red-500'
                                : item.currentStock < item.reorderLevel * 1.5
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                            style={{
                              width: `${Math.min(
                                (item.currentStock / (item.reorderLevel * 3)) *
                                  100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {item.reorderLevel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Reorder Needed'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-green-50 text-green-700'
                        }`}
                      >
                        {item.status === 'Reorder Needed' && (
                          <AlertTriangle className="w-3 h-3" />
                        )}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                      {item.lastRestocked}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-700">
                        {item.supplier}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
