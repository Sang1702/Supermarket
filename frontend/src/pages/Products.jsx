import { useEffect, useState } from 'react'
import KpiCard from '../components/KpiCard'
import { productService } from '../services/productService'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const data = await productService.getProducts()
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter
    const matchesSearch =
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const totalProducts = products.length
  const inventoryValue = products.reduce(
    (sum, p) => sum + (p.salePrice || 0) * (p.quantity || 0),
    0
  )
  const avgPrice = totalProducts > 0
    ? products.reduce((sum, p) => sum + (p.salePrice || 0), 0) / totalProducts
    : 0
  const lowStock = products.filter((p) => (p.quantity || 0) < 50).length

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
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
          <button className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm hover:bg-gray-50">
            Import
          </button>
          <button className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm hover:bg-gray-50">
            Export
          </button>
          <button className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-medium shadow-md hover:shadow-lg">
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
              <button className="px-3 py-1 rounded-full bg-white shadow-sm">
                Products
              </button>
              <button className="px-3 py-1 rounded-full text-gray-600">
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
            {products.slice(0, 3).map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-4"
              >
                <div>
                  <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-emerald-50 text-emerald-700 mr-2">
                    New
                  </span>
                  <span className="font-semibold text-gray-900">
                    {p.name}
                  </span>
                  <div className="text-xs text-gray-500">{p.category}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">{p.code}</div>
                  <div className="text-emerald-600 font-semibold">
                    ${(p.salePrice || 0).toFixed(2)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-3">Quick Actions</h2>
          <div className="space-y-3 text-sm">
            <button className="w-full flex justify-between items-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium">
              <span>+ Add New Product</span>
              <span>→</span>
            </button>
            <button className="w-full flex justify-between items-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium">
              <span>Bulk Import</span>
              <span>⬆</span>
            </button>
            <button className="w-full flex justify-between items-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium">
              <span>Manage Low Stock</span>
              <span>!</span>
            </button>
            <button className="w-full flex justify-between items-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-medium">
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
          {['All', ...new Set(products.map(p => p.category).filter(Boolean))].map(
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
          <button className="px-3 py-1.5 rounded-full border border-gray-200 text-sm text-gray-700 bg-white hover:bg-gray-50">
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
              {filteredProducts.map((p) => {
                const margin = p.importPrice && p.salePrice
                  ? ((p.salePrice - p.importPrice) / p.importPrice)
                  : 0
                const status = (p.quantity || 0) < 50 ? 'Low Stock' : 'In Stock'
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
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
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
