import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Button from '../components/Button'
import KPICard from '../components/KPICard'
import Icon from '../components/Icon'
import LoadingOverlay from '../components/LoadingOverlay'
import { useApi } from '../hooks/useApi'
import { adminApi } from '../scripts/admin'

export default function AdminUserKPIs() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [kpisData, setKpisData] = useState({})
  const { loading, request } = useApi()

  const loadUserKPIs = async () => {
    try {
      const data = await request(
        () => adminApi.getUserKPIs(userId),
        'Chargement des KPIs...'
      )
      setUserData(data.user)
      setKpisData(data.kpis)
    } catch (error) {
      console.error('Erreur chargement KPIs:', error)
      if (error.status === 404) {
        navigate('/admin')
      }
    }
  }

  useEffect(() => {
    loadUserKPIs()
  }, [userId])

  // Métadonnées des KPIs comme dans Dashboard.jsx
  const kpiMetadata = {
    total_contacts: { title: 'Contacts total', icon: 'users', color: 'var(--cyan)' },
    total_responses: { title: 'Réponses reçues', icon: 'reply', color: 'var(--green)' },
    total_appointments: { title: 'RDV programmés', icon: 'calendar-check', color: 'var(--purple)' },
    response_rate: { title: 'Taux de réponse', icon: 'percent', color: 'var(--indigo)', suffix: '%' }
  }

  const renderKPIComparison = (kpiKey, kpiData) => {
    const meta = kpiMetadata[kpiKey]
    const { current, previous, change_percent } = kpiData
    
    const getTrendIcon = () => {
      if (change_percent > 0) return 'trending-up'
      if (change_percent < 0) return 'trending-down'
      return 'minus'
    }
    
    const getTrendColor = () => {
      if (change_percent > 0) return 'var(--green)'
      if (change_percent < 0) return 'var(--red)'
      return 'var(--text-muted)'
    }

    return (
      <div key={kpiKey} className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '8px', 
            backgroundColor: meta.color + '20',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon name={meta.icon} size={20} color={meta.color} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>{meta.title}</h3>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Semaine actuelle
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: meta.color }}>
              {current}{meta.suffix || ''}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Semaine précédente
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {previous}{meta.suffix || ''}
            </div>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px',
          padding: '8px 12px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '6px'
        }}>
          <Icon name={getTrendIcon()} size={16} color={getTrendColor()} />
          <span style={{ fontSize: '14px', fontWeight: '500', color: getTrendColor() }}>
            {change_percent > 0 ? '+' : ''}{change_percent}%
          </span>
          <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            vs semaine précédente
          </span>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <Layout>
        <LoadingOverlay show={loading} message={loading} />
        <div className="page-header">
          <Button variant="default" onClick={() => navigate('/admin')}>
            <Icon name="arrow-left" size={16} />
            Retour
          </Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <LoadingOverlay show={loading} message={loading} />
      
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Button variant="default" onClick={() => navigate('/admin')}>
              <Icon name="arrow-left" size={16} />
              Retour
            </Button>
          </div>
          <h1>KPIs de {userData.email}</h1>
          <p className="muted">Performance sur les 14 derniers jours</p>
        </div>
        <div className="header-right">
          <Button variant="subtle" onClick={loadUserKPIs}>
            <Icon name="refresh" size={16} />
            Actualiser
          </Button>
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                {userData.email}
              </h3>
              {(userData.firstname || userData.lastname) && (
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-muted)' }}>
                  {[userData.firstname, userData.lastname].filter(Boolean).join(' ')}
                </p>
              )}
            </div>
            <span className={`badge ${userData.is_admin ? 'badge-purple' : 'badge-default'}`}>
              {userData.is_admin ? 'Admin' : 'Utilisateur'}
            </span>
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '16px' 
      }}>
        {Object.entries(kpisData).map(([key, data]) => 
          renderKPIComparison(key, data)
        )}
      </div>

      {Object.keys(kpisData).length === 0 && (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <Icon name="bar-chart" size={48} color="var(--text-muted)" />
          <h3 style={{ margin: '16px 0 8px 0', color: 'var(--text-muted)' }}>
            Aucune donnée disponible
          </h3>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>
            Cet utilisateur n'a pas encore de données KPI.
          </p>
        </div>
      )}
    </Layout>
  )
}
