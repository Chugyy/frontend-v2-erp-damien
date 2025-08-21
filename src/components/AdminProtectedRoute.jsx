import { useAuth } from '../hooks/useAuth'
import LoadingOverlay from './LoadingOverlay'

export default function AdminProtectedRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return <LoadingOverlay show={true} message="Vérification des autorisations..." />
  }

  if (!isAuthenticated) {
    return <div className="error-page">Accès non autorisé - Connexion requise</div>
  }

  if (!isAdmin) {
    return <div className="error-page">Accès non autorisé - Privilèges administrateur requis</div>
  }

  return children
}
