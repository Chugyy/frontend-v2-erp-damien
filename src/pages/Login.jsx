import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/Button'
import Input from '../components/Input'
import Icon from '../components/Icon'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { theme, toggleTheme } = useTheme()
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (error) {
      setError(error.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div></div>
          <div className="auth-logo">
            <img
              src={theme === 'dark' ? '/SalesSystem2.svg' : '/SalesSystem1.svg'}
              alt="ERP SAAS"
              style={{ width: 28, height: 28, borderRadius: 4 }}
            />
            <h1 className="auth-title">ERP SAAS</h1>
          </div>
          <button 
            className="auth-theme-toggle"
            onClick={toggleTheme}
            title={`Basculer vers le thème ${theme === 'dark' ? 'clair' : 'sombre'}`}
          >
            <Icon 
              name={theme === 'dark' ? 'sun' : 'moon'} 
              size={16} 
            />
          </button>
        </div>

        <div className="auth-content">
          <h2 className="auth-subtitle">Connexion</h2>
          <p className="auth-description">Connectez-vous à votre espace ERP</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Adresse email</label>
              <Input
                type="email"
                placeholder="email@exemple.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Mot de passe</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            
            {error && (
              <div style={{ color: 'red', fontSize: '14px', marginBottom: '8px' }}>
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              variant="primary" 
              disabled={loading}
              style={{ width: '100%', marginTop: '8px' }}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}