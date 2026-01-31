import { NavLink } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
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
  ChevronRight,
  User,
  Settings,
  LogOut
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
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  const handleLogout = () => {
    // Xóa token và redirect về trang login
    localStorage.removeItem('token')
    window.location.href = '/login'
    setShowUserMenu(false)
  }

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
      <div className="p-4 border-t border-gray-800 relative" ref={userMenuRef}>
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-full flex items-center gap-3 hover:bg-gray-800 rounded-lg p-2 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
            AD
          </div>
          {isOpen && (
            <div className="flex-1 text-left">
              <div className="text-white text-sm font-medium">Admin User</div>
              <div className="text-gray-400 text-xs">Administrator</div>
            </div>
          )}
        </button>

        {/* Dropdown Menu */}
        {showUserMenu && isOpen && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
            <button
              onClick={() => {
                setShowUserMenu(false)
                // Navigate to profile page hoặc mở modal profile
                alert('Profile page - Coming soon!')
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="text-sm">My Profile</span>
            </button>
            <button
              onClick={() => {
                setShowUserMenu(false)
                // Navigate to settings page hoặc mở modal settings
                alert('Settings page - Coming soon!')
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </button>
            <div className="border-t border-gray-200"></div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
