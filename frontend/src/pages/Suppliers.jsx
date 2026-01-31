import { useState, useEffect } from 'react'
import { Building2, Plus, Mail, Phone, User } from 'lucide-react'
import { supplierService } from '../services/supplierService'

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log('Suppliers component mounted')
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      console.log('Fetching suppliers...')
      const response = await supplierService.getSuppliers()
      console.log('Suppliers response:', response)
      
      // Handle different response formats
      let suppliersData = []
      if (Array.isArray(response)) {
        suppliersData = response
      } else if (response?.result && Array.isArray(response.result)) {
        suppliersData = response.result
      } else if (response?.data && Array.isArray(response.data)) {
        suppliersData = response.data
      } else if (response?.content && Array.isArray(response.content)) {
        suppliersData = response.content
      }
      
      console.log('Suppliers data:', suppliersData)
      setSuppliers(Array.isArray(suppliersData) ? suppliersData : [])
      setError(null)
    } catch (error) {
      console.error('Error fetching suppliers:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        stack: error.stack
      })
      setSuppliers([]) // keep state as array on error
      setError(error.response?.data?.message || error.message || 'Failed to load suppliers. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const safeSuppliers = Array.isArray(suppliers) ? suppliers : []
  const filteredSuppliers = safeSuppliers.filter((supplier) => {
    if (!supplier) return false
    return (
      supplier.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.representative?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading suppliers...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-2">⚠️ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null)
              setLoading(true)
              fetchSuppliers()
            }}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
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
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
              Supplier Relations
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Supplier Management
          </h1>
          <p className="text-gray-600 text-sm">
            Manage relationships with your suppliers
          </p>
        </div>
        <button 
          onClick={() => alert('Add New Supplier form - Coming soon!')}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium shadow-md hover:shadow-lg flex items-center gap-2 transition-shadow"
        >
          <Plus className="w-4 h-4" />
          Add New Supplier
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="Search suppliers by name, contact, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Supplier ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Company Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Contact Person
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Category
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No suppliers found
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 rounded-md bg-gray-100 text-gray-800 font-mono text-sm font-semibold">
                        {supplier.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="font-medium text-gray-900">
                          {supplier.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {supplier.representative || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <a
                          href={`mailto:${supplier.email}`}
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {supplier.email}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <a
                          href={`tel:${supplier.phone}`}
                          className="text-sm text-gray-700 hover:text-gray-900"
                        >
                          {supplier.phone}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-medium">
                        {supplier.address || '-'}
                      </span>
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
