import { useState, useEffect } from 'react'
import { UserCog, Plus, Mail, Phone, Shield, Package, Users, Truck } from 'lucide-react'
import { staffService } from '../services/staffService'

export default function Staff() {
  const [staffs, setStaffs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchStaffs()
  }, [])

  const fetchStaffs = async () => {
    try {
      const data = await staffService.getStaffs()
      // Map staff data to include user info
      const staffsWithUserInfo = data.map((staff) => ({
        id: staff.id,
        name: staff.user?.fullName || 'N/A',
        role: staff.position || 'N/A',
        email: staff.user?.email || 'N/A',
        phone: staff.user?.phone || 'N/A',
        joinDate: staff.user?.birthDay || 'N/A',
      }))
      setStaffs(staffsWithUserInfo)
    } catch (error) {
      console.error('Error fetching staffs:', error)
      setStaffs([])
    } finally {
      setLoading(false)
    }
  }

  const filteredStaff = staffs.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Tính toán số lượng theo role
  const adminCount = staffs.filter(
    (s) => s.role === 'Management Staff' || s.role?.toLowerCase().includes('management')
  ).length
  const warehouseCount = staffs.filter(
    (s) => s.role === 'Warehouse Staff' || s.role?.toLowerCase().includes('warehouse')
  ).length
  const salesCount = staffs.filter(
    (s) => s.role === 'Sales Staff' || s.role?.toLowerCase().includes('sales')
  ).length
  const deliveryCount = staffs.filter(
    (s) => s.role === 'Delivery Staff' || s.role?.toLowerCase().includes('delivery')
  ).length

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  const getRoleBadge = (role) => {
    const styles = {
      'Management Staff': 'bg-gray-100 text-gray-700',
      'Warehouse Staff': 'bg-blue-50 text-blue-700',
      'Sales Staff': 'bg-green-50 text-green-700',
      'Delivery Staff': 'bg-orange-50 text-orange-700',
    }

    return (
      <span
        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${styles[role] || 'bg-gray-100 text-gray-700'}`}
      >
        {role}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <UserCog className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
              Staff Administration
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Staff Management
          </h1>
          <p className="text-gray-600 text-sm">
            Manage staff members and their roles
          </p>
        </div>
        <button className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium shadow-md hover:shadow-lg flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add New Staff
        </button>
      </div>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Admin</div>
              <div className="text-3xl font-bold text-gray-900">
                {adminCount}
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Warehouse Staff</div>
              <div className="text-3xl font-bold text-gray-900">
                {warehouseCount}
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Sales Staff</div>
              <div className="text-3xl font-bold text-gray-900">
                {salesCount}
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Delivery Staff</div>
              <div className="text-3xl font-bold text-gray-900">
                {deliveryCount}
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
              <Truck className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="Search staff by name, role, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <UserCog className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Staff ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Join Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No staff members found
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staff) => (
                  <tr
                    key={staff.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 rounded-md bg-gray-100 text-gray-800 font-mono text-sm font-semibold">
                        {staff.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-purple-700 font-semibold">
                          {staff.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </div>
                        <div className="font-medium text-gray-900">
                          {staff.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(staff.role)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <a
                          href={`mailto:${staff.email}`}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {staff.email}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <a
                          href={`tel:${staff.phone}`}
                          className="hover:text-gray-900"
                        >
                          {staff.phone}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {staff.joinDate}
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
