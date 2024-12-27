// ProtectedRoute.tsx
import Transition from '@/components/transition'
import { useAuth } from '@/hooks/useAuth'
import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? (
    <Transition trigger={location.pathname}>
      <Outlet />
    </Transition>
  ) : (
    <Navigate to="/login" />
  )
}

export default ProtectedRoute
