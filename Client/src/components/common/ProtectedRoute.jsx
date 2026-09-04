import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Loading from './Loading'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth()
  const location = useLocation()

  useEffect(() => {
    console.log('ProtectedRoute: Auth State:', {
      isAuthenticated,
      user: user?.email || 'none',
      loading,
      path: location.pathname
    })
  }, [isAuthenticated, user, loading, location.pathname])

  if (loading) {
    console.log('ProtectedRoute: Still loading auth state...')
    return <Loading />
  }

  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login')
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    console.log('ProtectedRoute: Wrong role, redirecting to dashboard')
    return <Navigate to="/dashboard" replace />
  }

  console.log('ProtectedRoute: Access granted, rendering protected content')
  return children
}

export default ProtectedRoute