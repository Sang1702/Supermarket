import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Warehouse,
  FileText,
  Building2,
  Users,
  UserCog,
  ShoppingCart,
  ShoppingBag,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Package, label: 'Products', path: '/products' },
  { icon: Warehouse, label: 'Inventory', path: '/inventory' },
  { icon: FileText, label: 'Import Slips', path: '/import-slips' },
  { icon: Building2, label: 'Suppliers', path: '/suppliers' },
  { icon: Users, label: 'Customers', path: '/customers' },
  { icon: UserCog, label: 'Staff', path: '/staff' },
  { icon: ShoppingCart, label: 'Online Orders', path: '/orders' },
  { icon: ShoppingBag, label: 'Shopping Cart', path: '/shopping-cart' },
]

export default function Sidebar({ isOpen, onToggle }) {
  return (
    <aside
      className={`bg-gradient-to-br from-slate-900 to-slate-950 text-gray-200 transition-all duration-300 relative ${isOpen ? 'w-64' : 'w-20'
        } flex flex-col`}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 z-10 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
        title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        {isOpen ? (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        )}
      </button>

      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
          ⚡
        </div>
        {isOpen && (
          <div>
            <div className="text-white font-bold text-lg">SuperMart</div>
            <div className="text-gray-400 text-xs">Management Pro</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                  ? 'bg-green-500/20 text-green-400'
                  : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="text-sm">{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-semibold">
            AD
          </div>
          {isOpen && (
            <div>
              <div className="text-white text-sm font-medium">Admin User</div>
              <div className="text-gray-400 text-xs">Administrator</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
