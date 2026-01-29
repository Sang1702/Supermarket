import { useState, useEffect } from 'react'
import {
  ShoppingCart,
  Package,
  Truck,
  CheckCircle,
  Plus,
  Filter,
  User,
  Phone,
  MapPin,
  Calendar,
  Printer,
  TrendingUp,
} from 'lucide-react'
import { orderService } from '../services/orderService'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [statusFilter, setStatusFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const data = await orderService.getOrders()
      // Map order data to include customer info
      const ordersWithCustomerInfo = data.map((order) => ({
        id: order.id,
        customer: {
          name: order.customer?.user?.fullName || 'N/A',
          email: order.customer?.user?.email || 'N/A',
          phone: order.phone || order.customer?.user?.phone || 'N/A',
          avatar: order.customer?.user?.fullName?.charAt(0) || '?',
        },
        date: order.dateTime || new Date().toISOString().split('T')[0],
        time: '00:00',
        items: order.onlineOrderDetails?.length || 0,
        totalAmount: order.totalPrice || 0,
        status: order.status || 'New',
        shippingAddress: order.shipAddress || 'N/A',
        receiverName: order.receiverName || 'N/A',
        ...order,
      }))
      setOrders(ordersWithCustomerInfo)
      if (ordersWithCustomerInfo.length > 0) {
        setSelectedOrder(ordersWithCustomerInfo[0])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const newOrders = orders.filter((o) => o.status === 'New').length
  const processing = orders.filter((o) => o.status === 'Processing').length
  const shipped = orders.filter((o) => o.status === 'Shipped').length
  const delivered = orders.filter((o) => o.status === 'Delivered').length

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0
  )
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0
  const totalItems = orders.reduce((sum, o) => sum + (o.items || 0), 0)

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === 'All' || order.status === statusFilter
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  const getStatusBadge = (status) => {
    const styles = {
      New: 'bg-blue-50 text-blue-700 border-blue-200',
      Processing: 'bg-orange-50 text-orange-700 border-orange-200',
      Shipped: 'bg-purple-50 text-purple-700 border-purple-200',
      Delivered: 'bg-green-50 text-green-700 border-green-200',
    }

    const icons = {
      New: <ShoppingCart className="w-3 h-3" />,
      Processing: <Package className="w-3 h-3" />,
      Shipped: <Truck className="w-3 h-3" />,
      Delivered: <CheckCircle className="w-3 h-3" />,
    }

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.New}`}
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
            <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-pink-600" />
            </div>
            <div className="text-xs font-semibold text-pink-600 uppercase tracking-wide">
              Online Orders
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Orders Management
          </h1>
          <p className="text-gray-600 text-sm">
            Track and manage online customer orders with real-time updates
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm hover:bg-gray-50 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Advanced Filters
          </button>
          <button className="px-4 py-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-medium shadow-md hover:shadow-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Order
          </button>
        </div>
      </div>

      {/* Today's Order Statistics */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Today's Order Statistics
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-xs text-gray-500 mb-1">New Orders</div>
                <div className="text-2xl font-bold text-gray-900">8</div>
                <div className="text-xs text-green-600 mt-1">+25% vs yesterday</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-xs text-gray-500 mb-1">Processing</div>
                <div className="text-2xl font-bold text-gray-900">
                  {processing}
                </div>
                <div className="text-xs text-orange-600 mt-1">Needs attention</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-xs text-gray-500 mb-1">Shipped</div>
                <div className="text-2xl font-bold text-gray-900">{shipped}</div>
                <div className="text-xs text-purple-600 mt-1">Out for delivery</div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <Truck className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-xs text-gray-500 mb-1">Delivered</div>
                <div className="text-2xl font-bold text-gray-900">
                  {delivered}
                </div>
                <div className="text-xs text-green-600 mt-1">
                  Success rate 100%
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-5 text-white shadow-md">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="text-xs opacity-90 mb-1">Total Revenue</div>
              <div className="text-2xl font-bold">
                ${totalRevenue.toFixed(2)}
              </div>
              <div className="text-xs opacity-90 mt-1">From {orders.length} orders</div>
            </div>
            <TrendingUp className="w-6 h-6 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl p-5 text-white shadow-md">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="text-xs opacity-90 mb-1 flex items-center gap-1">
                Avg Order Value
                <span className="px-1.5 py-0.5 bg-white/20 rounded text-xs">
                  Avg
                </span>
              </div>
              <div className="text-2xl font-bold">
                ${avgOrderValue.toFixed(2)}
              </div>
              <div className="text-xs opacity-90 mt-1">Per order</div>
            </div>
            <ShoppingCart className="w-6 h-6 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-5 text-white shadow-md">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="text-xs opacity-90 mb-1 flex items-center gap-1">
                Total Items
                <span className="px-1.5 py-0.5 bg-white/20 rounded text-xs">
                  Total
                </span>
              </div>
              <div className="text-2xl font-bold">{totalItems}</div>
              <div className="text-xs opacity-90 mt-1">Across all orders</div>
            </div>
            <Package className="w-6 h-6 opacity-80" />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Order Status</h3>
          <div className="flex gap-6 items-center">
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 flex items-center justify-center text-xs text-gray-500">
              [Donut Chart]
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                Delivered: {delivered}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                Processing: {processing}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500" />
                Shipped: {shipped}
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Orders by Hour</h3>
            <div className="flex gap-1 bg-gray-100 rounded-full p-1 text-xs">
              <button className="px-3 py-1 rounded-full bg-white shadow-sm">
                Today
              </button>
              <button className="px-3 py-1 rounded-full text-gray-600">
                Yesterday
              </button>
              <button className="px-3 py-1 rounded-full text-gray-600">
                Week
              </button>
            </div>
          </div>
          <div className="h-48 bg-gradient-to-t from-pink-50 to-transparent rounded-lg flex items-center justify-center text-gray-400 text-sm">
            [Bar Chart - Orders by Hour]
          </div>
        </div>
      </div>

      {/* Main Content: Order Details + Order List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details Panel */}
        <div className="lg:col-span-1 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-semibold text-gray-900">
                  {selectedOrder.id}
                </span>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <div className="text-sm text-gray-500">Order Details</div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              CUSTOMER INFORMATION
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Customer Name:</span>
                <span className="font-medium text-gray-900">
                  {selectedOrder.customer.name}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium text-gray-900">
                  {selectedOrder.customer.phone}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Shipping Address:</span>
                <span className="font-medium text-gray-900">
                  {selectedOrder.shippingAddress}
                </span>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              ORDER INFORMATION
            </h4>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Order Date</div>
                <div className="text-sm font-medium text-gray-900">
                  {selectedOrder.date}
                </div>
                <div className="text-xs text-gray-500">{selectedOrder.time}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">Total Items</div>
                <div className="text-sm font-medium text-gray-900">
                  {selectedOrder.items} items
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="text-xs text-gray-600 mb-1">Total Amount</div>
              <div className="text-2xl font-bold text-green-700">
                ${selectedOrder.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-blue-600 hover:bg-gray-50 flex items-center justify-center gap-2">
              <Printer className="w-4 h-4" />
              Print Invoice
            </button>
            <button className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-medium hover:shadow-lg">
              Update Status
            </button>
          </div>
        </div>

        {/* Order List Panel */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Status Filters */}
          <div className="px-6 pt-4 pb-3 border-b border-gray-100 flex items-center gap-3 overflow-x-auto">
            {['All', 'Processing', 'Shipped', 'Delivered'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 rounded-full whitespace-nowrap text-sm transition-colors ${statusFilter === status
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search orders by ID, customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <ShoppingCart className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <button className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`cursor-pointer transition-colors ${selectedOrder.id === order.id
                          ? 'bg-green-50 border-l-4 border-green-500'
                          : 'hover:bg-gray-50'
                        }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono font-semibold text-green-600">
                          {order.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-pink-700 font-semibold">
                            {order.customer.avatar}
                          </div>
                          <div className="font-medium text-gray-900">
                            {order.customer.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.date} {order.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.items} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(order.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
