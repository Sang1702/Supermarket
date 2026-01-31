import { Navigate } from 'react-router-dom'
import { authService } from '../services/authService'

export default function ProtectedRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated()
  
  console.log('ProtectedRoute check - isAuthenticated:', isAuthenticated)
  console.log('Token exists:', !!localStorage.getItem('token'))

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login')
    return <Navigate to="/login" replace />
  }

  console.log('Authenticated, rendering children')
  return children
}
