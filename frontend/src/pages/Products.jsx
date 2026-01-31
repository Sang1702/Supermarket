import { useEffect, useState } from 'react'
import KpiCard from '../components/KpiCard'
import { productService } from '../services/productService'
import { X, Plus, Upload, Download, AlertCircle, CheckCircle } from 'lucide-react'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [error, setError] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    unit: '',
    importPrice: '',
    salePrice: '',
    quantity: '',
    category: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    console.log('Products component mounted')
    fetchProducts()
  }, [])

  const handleAddProduct = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setSuccessMessage('')

    try {
      const productData = {
        code: formData.code,
        name: formData.name,
        description: formData.description || null,
        unit: formData.unit || null,
        importPrice: parseFloat(formData.importPrice),
        salePrice: parseFloat(formData.salePrice),
        quantity: parseInt(formData.quantity),
        category: formData.category || null,
      }

      console.log('Creating product:', productData)
      await productService.createProduct(productData)
      
      setSuccessMessage('Product created successfully!')
      setFormData({
        code: '',
        name: '',
        description: '',
        unit: '',
        importPrice: '',
        salePrice: '',
        quantity: '',
        category: '',
      })
      
      // Refresh products list
      setTimeout(() => {
        setShowAddModal(false)
        setSuccessMessage('')
        fetchProducts()
      }, 1500)
    } catch (err) {
      console.error('Error creating product:', err)
      setError(err.response?.data?.message || 'Failed to create product. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleExport = () => {
    try {
      // Convert products to CSV
      const headers = ['Code', 'Name', 'Description', 'Unit', 'Import Price', 'Sale Price', 'Quantity', 'Category']
      const csvContent = [
        headers.join(','),
        ...(products || []).map(p => [
          `"${p.code || ''}"`,
          `"${p.name || ''}"`,
          `"${p.description || ''}"`,
          `"${p.unit || ''}"`,
          p.importPrice || 0,
          p.salePrice || 0,
          p.quantity || 0,
          `"${p.category || ''}"`
        ].join(','))
      ].join('\n')

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `products_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      setSuccessMessage('Products exported successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Error exporting products:', err)
      setError('Failed to export products. Please try again.')
    }
  }

  const handleImport = async (file) => {
    if (!file) return

    try {
      const text = await file.text()
      const lines = text.split('\n').filter(line => line.trim())
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
      
      // Skip header row
      const importedProducts = []
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim())
        if (values.length >= 6) {
          importedProducts.push({
            code: values[0],
            name: values[1],
            description: values[2] || null,
            unit: values[3] || null,
            importPrice: parseFloat(values[4]) || 0,
            salePrice: parseFloat(values[5]) || 0,
            quantity: parseInt(values[6]) || 0,
            category: values[7] || null,
          })
        }
      }

      // Create products one by one
      let successCount = 0
      let errorCount = 0
      for (const product of importedProducts) {
        try {
          await productService.createProduct(product)
          successCount++
        } catch (err) {
          console.error('Error importing product:', product.code, err)
          errorCount++
        }
      }

      setSuccessMessage(`Imported ${successCount} products successfully. ${errorCount > 0 ? `${errorCount} failed.` : ''}`)
      setShowImportModal(false)
      setTimeout(() => {
        setSuccessMessage('')
        fetchProducts()
      }, 2000)
    } catch (err) {
      console.error('Error importing file:', err)
      setError('Failed to import file. Please check the file format.')
    }
  }

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...')
      const response = await productService.getProducts()
      console.log('Products response:', response)
      
      // Handle different response formats
      let productsData = []
      if (Array.isArray(response)) {
        productsData = response
      } else if (response?.result && Array.isArray(response.result)) {
        productsData = response.result
      } else if (response?.data && Array.isArray(response.data)) {
        productsData = response.data
      } else if (response?.content && Array.isArray(response.content)) {
        productsData = response.content
      }
      
      console.log('Products data:', productsData)
      setProducts(productsData)
      setError(null)
    } catch (error) {
      console.error('Error fetching products:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        stack: error.stack
      })
      setProducts([])
      setError(error.response?.data?.message || error.message || 'Failed to load products. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = (products || []).filter((product) => {
    if (!product) return false
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter
    const matchesSearch =
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const totalProducts = (products || []).length
  const inventoryValue = (products || []).reduce(
    (sum, p) => sum + ((p?.salePrice || 0) * (p?.quantity || 0)),
    0
  )
  const avgPrice = totalProducts > 0
    ? (products || []).reduce((sum, p) => sum + (p?.salePrice || 0), 0) / totalProducts
    : 0
  const lowStock = (products || []).filter((p) => (p?.quantity || 0) < 50).length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-2">⚠️ Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => {
              setError(null)
              setLoading(true)
              fetchProducts()
            }}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">
            Product Catalog
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Product Management
          </h1>
          <p className="text-gray-600 text-sm">
            Manage your product catalog, pricing, and inventory
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button 
            onClick={handleExport}
            className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-medium shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            + Add Product
          </button>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          title="Total Products"
          value={totalProducts}
          icon="📦"
          delta="7 in stock, 3 low"
          deltaType="neutral"
        />
        <KpiCard
          title="Inventory Value"
          value={`$${inventoryValue.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}`}
          icon="💲"
          delta="+12% from last month"
          deltaType="up"
        />
        <KpiCard
          title="Average Price"
          value={`$${avgPrice.toFixed(2)}`}
          icon="📊"
          delta="Across all products"
          deltaType="neutral"
        />
        <KpiCard
          title="Low Stock Items"
          value={lowStock}
          icon="⚠️"
          delta="Requires immediate action"
          deltaType="down"
        />
      </div>

      {/* Charts row (placeholder visuals) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-2">
            Category Distribution
          </h2>
          <div className="flex gap-6 items-center">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-green-100 via-blue-100 to-pink-100 flex items-center justify-center text-xs text-gray-500">
              [Pie chart]
            </div>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2" />
                Dairy – 30%
              </li>
              <li>
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2" />
                Bakery – 25%
              </li>
              <li>
                <span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-2" />
                Beverages – 20%
              </li>
              <li>
                <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-2" />
                Snacks – 12%
              </li>
              <li>
                <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mr-2" />
                Other – 13%
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-semibold text-gray-900">
                Price Range Analysis
              </h2>
              <p className="text-xs text-gray-500">
                Distribution of products by price
              </p>
            </div>
            <div className="flex gap-1 bg-gray-100 rounded-full p-1 text-xs">
              <button 
                onClick={() => alert('Showing products view')}
                className="px-3 py-1 rounded-full bg-white shadow-sm hover:bg-gray-50 transition-colors"
              >
                Products
              </button>
              <button 
                onClick={() => alert('Showing revenue view')}
                className="px-3 py-1 rounded-full text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Revenue
              </button>
            </div>
          </div>
          <div className="h-40 bg-gradient-to-t from-emerald-50 to-transparent rounded-lg flex items-center justify-center text-gray-400 text-sm mb-3">
            [Bar chart]
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-emerald-50 rounded-lg py-2">
              <div className="font-semibold">3</div>
              <div className="text-gray-500">$0–$2</div>
            </div>
            <div className="bg-emerald-50 rounded-lg py-2">
              <div className="font-semibold">4</div>
              <div className="text-gray-500">$2–$4</div>
            </div>
            <div className="bg-emerald-50 rounded-lg py-2">
              <div className="font-semibold">2</div>
              <div className="text-gray-500">$4–$6</div>
            </div>
            <div className="bg-emerald-50 rounded-lg py-2">
              <div className="font-semibold">1</div>
              <div className="text-gray-500">$6+</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top selling + Recently added + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl p-5 text-white shadow-md">
          <h2 className="font-semibold mb-3">Top Selling</h2>
          <div className="space-y-3 text-sm">
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-xs opacity-80 mb-1">#1</div>
              <div className="font-semibold">Fresh Milk 1L</div>
              <div className="text-xs opacity-90">
                $2.99 × 245 = <span className="font-semibold">$732.55</span>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-xs opacity-80 mb-1">#2</div>
              <div className="font-semibold">Whole Wheat Bread</div>
              <div className="text-xs opacity-90">
                $1.99 × 198 = <span className="font-semibold">$394.02</span>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <div className="text-xs opacity-80 mb-1">#3</div>
              <div className="font-semibold">Chocolate Bar</div>
              <div className="text-xs opacity-90">
                $1.29 × 167 = <span className="font-semibold">$215.43</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3">Recently Added</h2>
          <ul className="space-y-3 text-sm">
            {(products || []).slice(0, 3).map((p) => (
              <li
                key={p?.id || Math.random()}
                className="flex items-center justify-between gap-4"
              >
                <div>
                  <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-emerald-50 text-emerald-700 mr-2">
                    New
                  </span>
                  <span className="font-semibold text-gray-900">
                    {p?.name || 'N/A'}
                  </span>
                  <div className="text-xs text-gray-500">{p?.category || 'N/A'}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">{p?.code || 'N/A'}</div>
                  <div className="text-emerald-600 font-semibold">
                    ${((p?.salePrice) || 0).toFixed(2)}
                  </div>
                </div>
              </li>
            ))}
            {(!products || products.length === 0) && (
              <li className="text-sm text-gray-500 text-center py-4">No products yet</li>
            )}
          </ul>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3">Quick Actions</h2>
          <div className="space-y-3 text-sm">
            <button 
              onClick={() => setShowAddModal(true)}
              className="w-full flex justify-between items-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              <span>+ Add New Product</span>
              <span>→</span>
            </button>
            <button 
              onClick={() => setShowImportModal(true)}
              className="w-full flex justify-between items-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              <span>Bulk Import</span>
              <span>⬆</span>
            </button>
            <button 
              onClick={() => {
                const lowStockProducts = products.filter((p) => (p.quantity || 0) < 50)
                alert(`Found ${lowStockProducts.length} low stock items. Filtering...`)
                setCategoryFilter('All')
                setSearchQuery('')
              }}
              className="w-full flex justify-between items-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              <span>Manage Low Stock</span>
              <span>!</span>
            </button>
            <button 
              onClick={() => alert('Analytics page - Coming soon!')}
              className="w-full flex justify-between items-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity"
            >
              <span>View Analytics</span>
              <span>📊</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product filters + table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Category tabs */}
        <div className="px-5 pt-4 pb-3 border-b border-gray-100 flex items-center gap-3 overflow-x-auto text-sm">
          {['All', ...new Set((products || []).map(p => p?.category).filter(Boolean))].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setCategoryFilter(tab)}
                className={`px-4 py-1.5 rounded-full whitespace-nowrap ${categoryFilter === tab
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Search + view toggle */}
        <div className="px-5 py-3 flex items-center justify-between gap-3 border-b border-gray-100">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name, code, or category..."
              className="w-full pl-8 pr-3 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <button 
            onClick={() => alert('Advanced filters - Coming soon!')}
            className="px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium">CODE</th>
                <th className="px-4 py-3 text-left text-xs font-medium">
                  PRODUCT NAME
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium">UNIT</th>
                <th className="px-4 py-3 text-left text-xs font-medium">
                  IMPORT PRICE
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium">
                  SALE PRICE
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium">STOCK</th>
                <th className="px-4 py-3 text-left text-xs font-medium">
                  STATUS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(!filteredProducts || filteredProducts.length === 0) ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    No products found. {products.length === 0 ? 'Try adding some products first.' : 'Try adjusting your filters.'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  if (!p) return null
                  const margin = p.importPrice && p.salePrice
                    ? ((p.salePrice - p.importPrice) / p.importPrice)
                    : 0
                  const status = (p.quantity || 0) < 50 ? 'Low Stock' : 'In Stock'
                  return (
                    <tr key={p.id || Math.random()} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-600">
                      <span className="inline-flex px-2 py-1 rounded-md bg-gray-100 text-gray-700 font-mono">
                        {p.code}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.category}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{p.unit || '-'}</td>
                    <td className="px-4 py-3 text-gray-700">
                      ${(p.importPrice || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-emerald-600 font-semibold">
                      ${(p.salePrice || 0).toFixed(2)}
                      {margin > 0 && (
                        <div className="text-xs text-emerald-700">
                          +{Math.round(margin * 100)}% margin
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      <div className="flex items-center gap-2">
                        <span>{p.quantity || 0}</span>
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden max-w-[80px]">
                          <div
                            className={`h-full rounded-full ${status === 'Low Stock'
                                ? 'bg-orange-500'
                                : 'bg-emerald-500'
                              }`}
                            style={{
                              width: `${Math.min(((p.quantity || 0) / 200) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs rounded-full font-medium ${status === 'Low Stock'
                            ? 'bg-orange-50 text-orange-700'
                            : 'bg-emerald-50 text-emerald-700'
                          }`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <CheckCircle className="w-5 h-5" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setFormData({
                    code: '',
                    name: '',
                    description: '',
                    unit: '',
                    importPrice: '',
                    salePrice: '',
                    quantity: '',
                    category: '',
                  })
                  setError(null)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-5">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="SP001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Product Name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    rows={3}
                    placeholder="Product description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="kg, L, pcs, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select category</option>
                    <option value="Thực phẩm">Thực phẩm</option>
                    <option value="Đồ khô">Đồ khô</option>
                    <option value="Sữa - Trứng">Sữa - Trứng</option>
                    <option value="Đồ uống">Đồ uống</option>
                    <option value="Rau củ">Rau củ</option>
                    <option value="Trái cây">Trái cây</option>
                    <option value="Thịt cá">Thịt cá</option>
                    <option value="Vệ sinh">Vệ sinh</option>
                    <option value="Gia dụng">Gia dụng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Import Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="0"
                    value={formData.importPrice}
                    onChange={(e) => setFormData({ ...formData, importPrice: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sale Price <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="0"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setFormData({
                      code: '',
                      name: '',
                      description: '',
                      unit: '',
                      importPrice: '',
                      salePrice: '',
                      quantity: '',
                      category: '',
                    })
                    setError(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Create Product</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Import Products</h2>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">CSV Format</h3>
                <p className="text-sm text-blue-800 mb-2">
                  Upload a CSV file with the following columns:
                </p>
                <code className="text-xs bg-white px-2 py-1 rounded block">
                  Code, Name, Description, Unit, Import Price, Sale Price, Quantity, Category
                </code>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleImport(file)
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
