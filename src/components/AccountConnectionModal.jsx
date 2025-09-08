import { useState } from 'react'
import Modal from './Modal'
import Button from './Button'
import Input from './Input'
import Notification from './Notification'
import ArkoseCaptcha from './ArkoseCaptcha'
import api from '../scripts/api'

export default function AccountConnectionModal({ open, onClose, platform, onConnect }) {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    accountId: null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [checkpointMode, setCheckpointMode] = useState(false)
  const [checkpointType, setCheckpointType] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [notification, setNotification] = useState(null)
  const [checkpointData, setCheckpointData] = useState(null)
  const [polling, setPolling] = useState(false)
  const [linkedInTwoFA, setLinkedInTwoFA] = useState('')

  const isLinkedIn = platform?.toLowerCase() === 'linkedin'
  const isInstagram = platform?.toLowerCase() === 'instagram'

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setError('')
    setSuccessMessage('')
    setNotification(null)
  }

  const showNotification = (type, message, title = null) => {
    setNotification({ type, message, title })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.password) {
      setError('Le mot de passe est requis')
      return
    }

    if (isLinkedIn && !formData.email) {
      setError('L\'email est requis pour LinkedIn')
      return
    }

    if (isInstagram && !formData.username) {
      setError('Le nom d\'utilisateur est requis pour Instagram')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      const data = await api.post('/accounts/connect', {
        platform: platform.toLowerCase(),
        email: isLinkedIn ? formData.email : null,
        username: isInstagram ? formData.username : null,
        password: formData.password
      })

      // Handle successful connection (code 201 - immediate success)
      if (data.success && !data.checkpoint_required) {
        const message = data.connection_status === 'connecting' 
          ? (data.success_message || 'Compte en cours de connexion')
          : (data.success_message || 'Connexion réussie !')
        showNotification('success', message, 'Succès')
        onConnect && onConnect(data)
        handleClose()
        return
      }


      // Handle checkpoint required (code 202 - authentication needed)
      if (data.checkpoint_required) {
        setCheckpointMode(true)
        setCheckpointType(data.checkpoint_type)
        setCheckpointData(data)
        setFormData(prev => ({
          ...prev,
          accountId: data.account_id
        }))
        
        if (data.checkpoint_type === 'CAPTCHA') {
          showNotification('info', 'Veuillez résoudre le captcha pour continuer', 'Vérification anti-robot')
        } else {
          showNotification('info', data.message || 'Code de vérification requis', 'Vérification nécessaire')
        }
        setError('')
        setSuccessMessage('')
      }

    } catch (error) {
      if (error.message && error.message.includes('attendre')) {
        showNotification('warning', error.message, 'Connexion en cours')
      } else {
        showNotification('error', error.message || 'Erreur de connexion au serveur', 'Erreur')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckpointSubmit = async (e) => {
    e.preventDefault()

    if (!verificationCode) {
      setError('Le code de vérification est requis')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const data = await api.post(`/accounts/${formData.accountId}/checkpoint`, {
        code: verificationCode
      })

      if (data.success) {
        showNotification('success', data.message || 'Vérification réussie !', 'Succès')
        onConnect && onConnect(data)
        handleClose()
      }

    } catch (error) {
      showNotification('error', error.message || 'Code de vérification invalide', 'Erreur de vérification')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCaptchaSolved = async (token) => {
    console.log('Captcha solved with token:', token)
    setIsLoading(true)
    setError('')

    try {
      // Send captcha token to backend
      const data = await api.post(`/accounts/${formData.accountId}/captcha`, {
        captcha_token: token
      })

      if (data.success) {
        showNotification('success', 'Captcha résolu avec succès !', 'Vérification réussie')
        onConnect && onConnect(data)
        handleClose()
      } else {
        // Start polling account status
        startAccountPolling()
      }

    } catch (error) {
      showNotification('error', error.message || 'Erreur lors de la validation du captcha', 'Erreur de captcha')
    } finally {
      setIsLoading(false)
    }
  }

  const startAccountPolling = () => {
    if (polling || !formData.accountId) return

    setPolling(true)
    showNotification('info', 'Vérification en cours...', 'Validation du compte')

    const pollInterval = setInterval(async () => {
      try {
        const statusData = await api.get(`/accounts/${formData.accountId}/poll-status`)
        
        if (statusData.connection_status === 'connected') {
          clearInterval(pollInterval)
          setPolling(false)
          showNotification('success', 'Compte connecté avec succès !', 'Connexion réussie')
          onConnect && onConnect(statusData)
          handleClose()
        } else if (statusData.connection_status === 'error') {
          clearInterval(pollInterval)
          setPolling(false)
          showNotification('error', statusData.connection_error || 'Erreur de connexion', 'Échec de connexion')
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, 3000)

    // Stop polling after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval)
      if (polling) {
        setPolling(false)
        showNotification('warning', 'Délai d\'attente dépassé. Veuillez réessayer.', 'Timeout')
      }
    }, 5 * 60 * 1000)
  }

  const handleCaptchaError = (error) => {
    console.error('Captcha error:', error)
    setError(error)
  }

  const handleClose = () => {
    setFormData({ email: '', username: '', password: '', accountId: null })
    setVerificationCode('')
    setError('')
    setSuccessMessage('')
    setCheckpointMode(false)
    setCheckpointType('')
    setCheckpointData(null)
    setPolling(false)
    setIsLoading(false)
    setNotification(null)
    setLinkedInTwoFA('')
    onClose()
  }

  const getCheckpointMessage = () => {
    switch (checkpointType) {
      case '2FA':
        return 'Veuillez entrer le code à 6 chiffres de votre application d\'authentification'
      case 'OTP':
        return 'Veuillez entrer le code OTP reçu par SMS ou email'
      case 'IN_APP_VALIDATION':
        return 'Veuillez valider la connexion dans l\'application mobile'
      case 'CAPTCHA':
        return 'Veuillez résoudre le CAPTCHA'
      default:
        return 'Vérification supplémentaire requise'
    }
  }

  const platformIcon = {
    linkedin: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#0077B5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    instagram: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#E4405F">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )
  }

  return (
    <Modal 
      open={open} 
      onClose={handleClose}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {platformIcon[platform?.toLowerCase()]}
          <span>
            {checkpointMode 
              ? `Vérification ${platform?.charAt(0).toUpperCase() + platform?.slice(1)}`
              : `Connexion ${platform?.charAt(0).toUpperCase() + platform?.slice(1)}`
            }
          </span>
        </div>
      }
    >
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          title={notification.title}
          onClose={() => setNotification(null)}
          autoClose={notification.type === 'success'}
          duration={notification.type === 'success' ? 3000 : 0}
        />
      )}
      
      {!checkpointMode ? (
        <>
          {isLinkedIn && !linkedInTwoFA ? (
            <div className="linkedin-2fa-section">
              <h3 style={{ marginBottom: '20px' }}>Configuration LinkedIn</h3>
              <p style={{ marginBottom: '16px', fontSize: '14px', color: '#666' }}>
                Avez-vous activé l'authentification à double facteur (A2F) sur votre compte LinkedIn ?
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="twoFA"
                    value="yes"
                    checked={linkedInTwoFA === 'yes'}
                    onChange={(e) => setLinkedInTwoFA(e.target.value)}
                    style={{ marginRight: '8px' }}
                  />
                  Oui, j'ai l'A2F activée
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="twoFA"
                    value="no"
                    checked={linkedInTwoFA === 'no'}
                    onChange={(e) => setLinkedInTwoFA(e.target.value)}
                    style={{ marginRight: '8px' }}
                  />
                  Non, je n'ai pas l'A2F
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="twoFA"
                    value="unknown"
                    checked={linkedInTwoFA === 'unknown'}
                    onChange={(e) => setLinkedInTwoFA(e.target.value)}
                    style={{ marginRight: '8px' }}
                  />
                  Je ne sais pas
                </label>
              </div>
            </div>
          ) : isLinkedIn && linkedInTwoFA && linkedInTwoFA !== 'no' ? (
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px',
              border: '1px solid #dee2e6'
            }}>
              {linkedInTwoFA === 'unknown' && (
                <p style={{ marginBottom: '12px', fontSize: '13px', color: '#666' }}>
                  💡 Pour vérifier si vous avez l'A2F : connectez-vous sur LinkedIn. Si on vous demande un code par SMS ou d'une app d'authentification, alors vous avez l'A2F.
                </p>
              )}
              
              <p style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '500' }}>
                🔗 Intégration spéciale requise (moins de 5 minutes)
              </p>
              
              <div style={{ 
                position: 'relative', 
                paddingBottom: '56.25%', 
                height: 0, 
                overflow: 'hidden',
                borderRadius: '4px',
                marginBottom: '12px'
              }}>
                <iframe
                  src="https://calendly.com/hugo-hoarau/30min?hide_event_type_details=1&hide_gdpr_banner=1"
                  title="Planifier intégration LinkedIn"
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
              
              <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
                Prenez rendez-vous pour configurer l'intégration LinkedIn avec A2F
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                {isLinkedIn && (
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="votre-email@exemple.com"
                    required
                  />
                )}
            
            {isInstagram && (
              <Input
                label="Nom d'utilisateur"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="votre_nom_utilisateur"
                required
              />
            )}
            
            <Input
              label="Mot de passe"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="error-message" style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#fee', color: '#c53030', borderRadius: '4px' }}>
              {error}
            </div>
          )}

          {successMessage && (
            <div className="success-message" style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f0fff4', color: '#22543d', borderRadius: '4px' }}>
              {successMessage}
            </div>
          )}

              <div className="modal-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </Button>
              </div>
            </form>
          )}
          
          {isLinkedIn && linkedInTwoFA && linkedInTwoFA !== 'no' && (
            <div className="modal-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <Button variant="secondary" onClick={handleClose}>
                Annuler
              </Button>
            </div>
          )}
          
          {isLinkedIn && !linkedInTwoFA && (
            <div className="modal-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <Button variant="secondary" onClick={handleClose}>
                Annuler
              </Button>
            </div>
          )}
        </>
      ) : (
        <form onSubmit={handleCheckpointSubmit}>
          <div className="checkpoint-info" style={{ marginBottom: '20px' }}>
            <p style={{ marginBottom: '12px' }}>{getCheckpointMessage()}</p>
            {checkpointType === '2FA' && (
              <div style={{ padding: '12px', backgroundColor: '#f7fafc', borderRadius: '4px', fontSize: '14px' }}>
                📱 Ouvrez votre application d'authentification (Google Authenticator, Authy, etc.) et saisissez le code à 6 chiffres
              </div>
            )}
            {checkpointType === 'IN_APP_VALIDATION' && (
              <div style={{ padding: '12px', backgroundColor: '#f7fafc', borderRadius: '4px', fontSize: '14px' }}>
                ⏱️ Vous avez 5 minutes pour valider dans l'application mobile
              </div>
            )}
            {checkpointType === 'CAPTCHA' && (
              <div style={{ padding: '12px', backgroundColor: '#f7fafc', borderRadius: '4px', fontSize: '14px' }}>
                🤖 Veuillez résoudre le captcha ci-dessous pour prouver que vous n'êtes pas un robot
              </div>
            )}
          </div>

          {checkpointType === 'CAPTCHA' ? (
            <ArkoseCaptcha
              accountId={formData.accountId}
              publicKey={checkpointData?.checkpoint?.public_key}
              data={checkpointData?.checkpoint?.data}
              onSolved={handleCaptchaSolved}
              onError={handleCaptchaError}
            />
          ) : checkpointType !== 'IN_APP_VALIDATION' && (
            <div className="form-group">
              <Input
                label="Code de vérification"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="123456"
                required
              />
            </div>
          )}

          {error && (
            <div className="error-message" style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#fee', color: '#c53030', borderRadius: '4px' }}>
              {error}
            </div>
          )}

          {successMessage && (
            <div className="success-message" style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f0fff4', color: '#22543d', borderRadius: '4px' }}>
              {successMessage}
            </div>
          )}

          <div className="modal-actions" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <Button variant="secondary" onClick={handleClose} disabled={isLoading || polling}>
              Annuler
            </Button>
            {checkpointType === 'CAPTCHA' ? (
              <div style={{ fontSize: '14px', color: '#666', alignSelf: 'center' }}>
                {polling ? 'Vérification en cours...' : isLoading ? 'Validation...' : 'Résolvez le captcha ci-dessus'}
              </div>
            ) : checkpointType !== 'IN_APP_VALIDATION' && (
              <Button 
                type="submit" 
                variant="primary" 
                disabled={isLoading || !verificationCode}
              >
                {isLoading ? 'Vérification...' : 'Vérifier'}
              </Button>
            )}
          </div>
        </form>
      )}
    </Modal>
  )
}