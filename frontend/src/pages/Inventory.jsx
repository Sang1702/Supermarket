import { useState, useEffect } from 'react'
import { Package, Download, Plus, AlertTriangle } from 'lucide-react'
import { productService } from '../services/productService'

export default function Inventory() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await productService.getProducts()
      let productsData = []
      if (Array.isArray(response)) {
        productsData = response
      } else if (response?.result && Array.isArray(response.result)) {
        productsData = response.result
      } else if (response?.data && Array.isArray(response.data)) {
        productsData = response.data
      }
      setProducts(productsData)
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    try {
      const headers = [
        'Product Code',
        'Product Name',
        'Category',
        'Current Stock',
        'Unit',
        'Sale Price',
        'Status',
      ]
      const safeProducts = Array.isArray(products) ? products : []
      const csvContent = [
        headers.join(','),
        ...safeProducts.map((p) => {
          const status = (p.quantity || 0) < 50 ? 'Low Stock' : 'Sufficient'
          return [
            `"${p.code || ''}"`,
            `"${p.name || ''}"`,
            `"${p.category || ''}"`,
            p.quantity || 0,
            `"${p.unit || ''}"`,
            p.salePrice || 0,
            `"${status}"`,
          ].join(',')
        }),
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(link.href)
      alert('Inventory report exported successfully!')
    } catch (err) {
      console.error('Error exporting inventory:', err)
      alert('Failed to export inventory report.')
    }
  }

  const safeProducts = Array.isArray(products) ? products : []
  const inventoryItems = safeProducts.map((p) => ({
    id: p.id,
    product: {
      name: p.name,
      icon: '📦',
      category: p.category || 'N/A',
    },
    currentStock: p.quantity || 0,
    reorderLevel: 50,
    status: (p.quantity || 0) < 50 ? 'Reorder Needed' : 'Sufficient',
    lastRestocked: 'N/A',
    supplier: 'N/A',
  }))

  const totalItems = inventoryItems.length
  const needsReorder = inventoryItems.filter((i) => i.status === 'Reorder Needed').length
  const totalStock = inventoryItems.reduce((sum, i) => sum + i.currentStock, 0)

  const filteredInventory = inventoryItems.filter(
    (item) =>
      (item.product?.name || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (item.id || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600 text-sm">
            Track and manage stock levels across warehouses
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button
            onClick={() => (window.location.href = '/import-slips')}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-medium shadow-md hover:shadow-lg flex items-center gap-2 transition-shadow"
          >
            <Plus className="w-4 h-4" />
            New Stock Entry
          </button>
        </div>
      </div>

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
          <button
            onClick={() => alert('Inventory filters - Coming soon!')}
            className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-2 transition-colors"
          >
            Filters
          </button>
        </div>
      </div>

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
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No inventory items found
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 rounded-md bg-gray-100 text-gray-800 font-mono text-sm font-semibold">
                        {item.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-xl">
                          {item.product?.icon}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.product?.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.product?.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-bold text-gray-900">
                        {item.currentStock}
                      </span>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.supplier}
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
