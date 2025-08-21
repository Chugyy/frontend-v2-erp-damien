// components/ProtectedRoute.jsx - Route protégée par authentification

import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Vérification connexion...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // La redirection est gérée par useAuth
    return null;
  }

  return children;
}