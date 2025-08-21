import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Button from '../components/Button'
import AccountConnectionModal from '../components/AccountConnectionModal'
import { NotificationContainer } from '../components/Notification'
import useNotifications from '../hooks/useNotifications'
import api from '../scripts/api'

function Header({ title, subtitle, right }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
      <div className="header-right">{right}</div>
    </div>
  )
}

function AccountCard({ account, onConnect, onDisconnect, onRefreshStatus, onDelete }) {
  const isConnected = account.connection_status === 'connected'
  const isConnecting = account.connection_status === 'connecting'
  const hasCheckpoint = account.connection_status === 'checkpoint_required'
  const hasError = account.connection_status === 'error'
  
  const platformIcons = {
    instagram: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#E4405F">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
    linkedin: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#0077B5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )
  }

  const getStatusText = () => {
    if (isConnected) return `Connecté en tant que ${account.display_name || 'Compte connecté'}`
    if (isConnecting) return 'Connexion en cours...'
    if (hasCheckpoint) return `Vérification requise (${account.checkpoint_type})`
    if (account.connection_status === 'credentials_required') return 'Identifiants expirés'
    if (account.connection_status === 'deleted') return 'Compte supprimé'
    if (hasError) return account.connection_error || 'Erreur de connexion'
    if (account.connection_status === 'disconnected') return 'Déconnecté - Supprimez et reconnectez ce compte'
    return 'Non connecté'
  }

  const getStatusClass = () => {
    if (isConnected) return 'connected'
    if (isConnecting) return 'connecting'
    if (hasCheckpoint) return 'checkpoint'
    if (account.connection_status === 'credentials_required') return 'credentials'
    if (account.connection_status === 'deleted') return 'deleted'
    if (hasError) return 'error'
    return 'disconnected'
  }

  return (
    <div className="card account-card">
      <div className="account-header">
        <div className="account-info">
          <div className="account-icon">
            {platformIcons[account.plateforme]}
          </div>
          <div>
            <h3 className="account-title">
              {account.plateforme.charAt(0).toUpperCase() + account.plateforme.slice(1)}
            </h3>
            <div className="account-status">
              <div className={`status-dot ${getStatusClass()}`}></div>
              <span className="status-text">{getStatusText()}</span>
            </div>
            {account.last_connection_attempt && (
              <div className="last-attempt">
                Dernière tentative: {new Date(account.last_connection_attempt).toLocaleString()}
              </div>
            )}
            {account.connection_error && (
              <div className="connection-error">
                {account.connection_error}
              </div>
            )}
          </div>
        </div>
        <div className="account-actions">
          {isConnected ? (
            <Button variant="danger" onClick={() => onDisconnect(account.account_id)}>
              Déconnecter
            </Button>
          ) : account.connection_status === 'disconnected' ? (
            <Button 
              variant="danger" 
              onClick={() => onDelete(account.account_id)}
            >
              Supprimer
            </Button>
          ) : (
            <Button 
              variant="primary" 
              onClick={() => onConnect(account.plateforme)}
              disabled={isConnecting}
            >
              {isConnecting ? 'Connexion...' : 'Connecter'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Settings() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showConnectionModal, setShowConnectionModal] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState(null)
  const [error, setError] = useState('')
  const { notifications, removeNotification, showSuccess, showError, showInfo } = useNotifications()

  // Platforms to show (including non-connected ones)
  const availablePlatforms = ['linkedin', 'instagram']

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      const data = await api.get('/accounts')
      
      // Afficher UNIQUEMENT les comptes existants en BDD
      const existingAccounts = data.accounts || []
      setAccounts(existingAccounts)
      
    } catch (error) {
      setError(error.message || 'Erreur lors du chargement des comptes')
    } finally {
      setLoading(false)
    }
  }

  const handleConnect = (platform) => {
    setSelectedPlatform(platform)
    setShowConnectionModal(true)
  }

  const handleConnectionSuccess = (data) => {
    setShowConnectionModal(false)
    setSelectedPlatform(null)
    showSuccess('Compte connecté avec succès !', { title: 'Connexion réussie' })
    loadAccounts() // Refresh accounts list
  }

  const handleDisconnect = async (accountId) => {
    if (!accountId) return // Ignore placeholder accounts
    
    try {
      await api.post(`/accounts/${accountId}/disconnect`, {})
      showSuccess('Compte déconnecté avec succès', { title: 'Déconnexion réussie' })
      loadAccounts() // Refresh accounts list
    } catch (error) {
      showError(error.message || 'Erreur lors de la déconnexion', { title: 'Erreur de déconnexion' })
    }
  }

  const handleRefreshStatus = async (accountId) => {
    if (!accountId) return // Ignore placeholder accounts
    
    try {
      // Refresh real-time status from Unipile
      await api.get(`/accounts/${accountId}/connection-status`)
      loadAccounts() // Refresh accounts list
    } catch (error) {
      console.error('Error refreshing status:', error)
    }
  }

  const handleRefreshAllAccounts = async () => {
    setLoading(true)
    try {
      showInfo('Actualisation en cours...', { title: 'Rafraîchissement' })
      const result = await api.post('/accounts/refresh-all')
      
      if (result.updated_accounts > 0) {
        showSuccess(`Statut mis à jour pour ${result.updated_accounts} comptes`, { 
          title: 'Actualisation terminée' 
        })
      } else {
        showInfo('Aucun compte à mettre à jour', { title: 'Actualisation terminée' })
      }
      
      loadAccounts() // Refresh list
    } catch (error) {
      showError(error.message || 'Erreur lors du rafraîchissement', { 
        title: 'Erreur d\'actualisation' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddNewPlatform = (platform) => {
    setSelectedPlatform(platform)
    setShowConnectionModal(true)
  }

  const handleDelete = async (accountId) => {
    if (!accountId) return
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement ce compte ?')) {
      return
    }
    
    try {
      await api.delete(`/accounts/${accountId}`)
      showSuccess('Compte supprimé avec succès', { title: 'Suppression réussie' })
      loadAccounts() // Refresh accounts list
    } catch (error) {
      showError(error.message || 'Erreur lors de la suppression', { 
        title: 'Erreur de suppression' 
      })
    }
  }

  return (
    <Layout>
      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
      
      <Header 
        title="Paramètres" 
        subtitle="Gérez vos comptes et préférences"
        right={
          <Button 
            variant="primary" 
            onClick={handleRefreshAllAccounts}
            disabled={loading}
          >
            {loading ? 'Actualisation...' : '↻ Actualiser'}
          </Button>
        }
      />
      
      {error && (
        <div className="error-banner" style={{ 
          padding: '12px', 
          backgroundColor: '#fee', 
          color: '#c53030', 
          borderRadius: '4px',
          marginBottom: '20px' 
        }}>
          {error}
          <button onClick={() => setError('')} style={{ float: 'right' }}>×</button>
        </div>
      )}
      
      <div className="settings-section">
        <h2 className="section-title">Comptes connectés</h2>
        <p className="section-description">
          Gérez vos comptes de réseaux sociaux pour automatiser vos actions CRM
        </p>
        
        {loading ? (
          <div className="loading-state" style={{ textAlign: 'center', padding: '40px' }}>
            Chargement des comptes...
          </div>
        ) : (
          <div className="accounts-grid">
            {accounts.map((account, index) => (
              <AccountCard
                key={account.account_id || `${account.plateforme}-${index}`}
                account={account}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                onRefreshStatus={handleRefreshStatus}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
        
        <div className="add-account-section" style={{ marginTop: '30px' }}>
          <h3>Ajouter un compte</h3>
          
          {/* Instagram warning section */}
          <div className="instagram-warning" style={{
            marginTop: '16px',
            marginBottom: '20px',
            padding: '16px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <h4 style={{ margin: 0, color: '#dc2626', fontWeight: 'bold' }}>ATTENTION : Important avant de pouvoir connecter un compte Instagram</h4>
            </div>
            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#7f1d1d' }}>
              Il faut activer l'authentification à double facteur avec "Google Authenticator" pour pouvoir connecter un compte Instagram. 
              Suivez ce tuto simple sur mobile (semblable si vous le faites sur ordinateur) :
            </p>
            <div style={{ 
              position: 'relative', 
              paddingBottom: '56.25%', 
              height: 0, 
              overflow: 'hidden',
              borderRadius: '4px'
            }}>
              <iframe
                src="https://www.youtube.com/embed/TA25t0x8i_o?start=18"
                title="Tutoriel activation 2FA Instagram"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            {availablePlatforms.map(platform => (
              <Button
                key={platform}
                variant="secondary"
                onClick={() => handleAddNewPlatform(platform)}
              >
                + {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <AccountConnectionModal
        open={showConnectionModal}
        onClose={() => {
          setShowConnectionModal(false)
          setSelectedPlatform(null)
        }}
        platform={selectedPlatform}
        onConnect={handleConnectionSuccess}
      />
    </Layout>
  )
}