import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardHome from './pages/DashboardHome'
import Products from './pages/Products'
import Customers from './pages/Customers'
import Orders from './pages/Orders'
import Inventory from './pages/Inventory'
import Staff from './pages/Staff'
import Suppliers from './pages/Suppliers'
import ImportSlips from './pages/ImportSlips'
import ShoppingCart from './pages/ShoppingCart'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/products" element={<Products />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/import-slips" element={<ImportSlips />} />
          <Route path="/shopping-cart" element={<ShoppingCart />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
