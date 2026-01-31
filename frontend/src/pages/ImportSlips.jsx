import { useState } from 'react'
import { FileText, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react'

// Mock data - sẽ thay bằng API thật sau
const mockImportSlips = [
  {
    id: 'IMP001',
    supplier: 'DairyFresh Co.',
    warehouseStaff: 'James Wilson',
    importDate: '2026-01-20',
    items: 5,
    totalPrice: 450.0,
    status: 'Completed',
  },
  {
    id: 'IMP002',
    supplier: 'Golden Bakery',
    warehouseStaff: 'James Wilson',
    importDate: '2026-01-22',
    items: 3,
    totalPrice: 236.45,
    status: 'Completed',
  },
  {
    id: 'IMP003',
    supplier: 'Farm Fresh Ltd',
    warehouseStaff: 'Sarah Johnson',
    importDate: '2026-01-24',
    items: 4,
    totalPrice: 650.0,
    status: 'Pending',
  },
  {
    id: 'IMP004',
    supplier: 'Grain Masters',
    warehouseStaff: 'James Wilson',
    importDate: '2026-01-25',
    items: 6,
    totalPrice: 400.0,
    status: 'Processing',
  },
]

export default function ImportSlips() {
  const [searchQuery, setSearchQuery] = useState('')

  const totalImports = mockImportSlips.length
  const totalValue = mockImportSlips.reduce(
    (sum, slip) => sum + slip.totalPrice,
    0
  )
  const completed = mockImportSlips.filter(
    (slip) => slip.status === 'Completed'
  ).length
  const inProgress = mockImportSlips.filter(
    (slip) => slip.status === 'Processing'
  ).length
  const pending = mockImportSlips.filter(
    (slip) => slip.status === 'Pending'
  ).length

  const filteredSlips = mockImportSlips.filter(
    (slip) =>
      slip.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slip.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slip.warehouseStaff.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status) => {
    const styles = {
      Completed: 'bg-green-50 text-green-700 border-green-200',
      Processing: 'bg-blue-50 text-blue-700 border-blue-200',
      Pending: 'bg-orange-50 text-orange-700 border-orange-200',
    }

    const icons = {
      Completed: <CheckCircle className="w-3 h-3" />,
      Processing: <Clock className="w-3 h-3" />,
      Pending: <AlertCircle className="w-3 h-3" />,
    }

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}
      >
        {icons[status]}
        {status}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-xs font-semibold text-red-600 uppercase tracking-wide">
              Import Management
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Import Slips Management
          </h1>
          <p className="text-gray-600 text-sm">
            Track product imports from suppliers to warehouse
          </p>
        </div>
        <button 
          onClick={() => alert('Create Import Slip form - Coming soon!')}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium shadow-md hover:shadow-lg flex items-center gap-2 transition-shadow"
        >
          <Plus className="w-4 h-4" />
          Create Import Slip
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Total Imports (Jan)</div>
              <div className="text-2xl font-bold text-gray-900">
                ${totalValue.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {totalImports} import slips
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Completed</div>
              <div className="text-2xl font-bold text-gray-900">{completed}</div>
              <div className="text-xs text-gray-500 mt-1">
                {inProgress} in progress
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Pending</div>
              <div className="text-2xl font-bold text-gray-900">{pending}</div>
              <div className="text-xs text-gray-500 mt-1">
                Awaiting confirmation
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="Search import slips by ID, supplier, or staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Import Slips Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Import Slip ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Warehouse Staff
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Import Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Total Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredSlips.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No import slips found
                  </td>
                </tr>
              ) : (
                filteredSlips.map((slip) => (
                  <tr
                    key={slip.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 rounded-md bg-gray-100 text-gray-800 font-mono text-sm font-semibold">
                        {slip.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {slip.supplier}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        {slip.warehouseStaff}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                      {slip.importDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm">
                        {slip.items}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-gray-900">
                        ${slip.totalPrice.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(slip.status)}
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
