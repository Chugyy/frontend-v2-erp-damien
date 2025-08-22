import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import LoadingOverlay from './LoadingOverlay'

export default function SmartRedirect() {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return <LoadingOverlay show={true} message="Redirection..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />
}