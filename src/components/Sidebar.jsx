import { NavLink } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'
import Icon from './Icon'

const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
)

const CrmIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/><path d="m22 21-3-3m0 0a2 2 0 0 0-2-2 4 4 0 0 1 4 4Z"/>
  </svg>
)

const SettingsIcon = () => <Icon name="settings" size={20} />
const AdminIcon = () => <Icon name="shield" size={20} />

export default function Sidebar({ collapsed, onToggle }) {
  const { theme, toggleTheme } = useTheme()
  const { isAdmin, logout } = useAuth()
  
  const linkClass = ({ isActive }) => `sidebar-nav-button ${isActive ? 'active' : ''}`

  const navigationItems = isAdmin ? [
    { id: 'admin', label: 'Administration', icon: AdminIcon, path: '/admin' }
  ] : [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, path: '/dashboard' },
    { id: 'crm', label: 'CRM', icon: CrmIcon, path: '/crm' }
  ]

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed ? (
          <div className="sidebar-title">
            <div className="sidebar-logo">
              <img
                src={theme === 'dark' ? '/SalesSystem2.svg' : '/SalesSystem1.svg'}
                alt="ERP SAAS"
                style={{ width: 24, height: 24, borderRadius: 4 }}
              />
            </div>
            <span className="sidebar-title-text">ERP SAAS</span>
          </div>
        ) : (
          <div className="sidebar-logo">
            <img
              src={theme === 'dark' ? '/SalesSystem2.svg' : '/SalesSystem1.svg'}
              alt="ERP SAAS"
              style={{ width: 20, height: 20, borderRadius: 4 }}
            />
          </div>
        )}
        <button className="sidebar-toggle" onClick={onToggle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={collapsed ? "m9 18 6-6-6-6" : "m15 18-6-6 6-6"}/>
          </svg>
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <div className="sidebar-main-nav">
          <ul className="sidebar-nav-list">
            {navigationItems.map((item) => {
              const IconComponent = item.icon
              return (
                <li key={item.id}>
                  <NavLink to={item.path} className={linkClass}>
                    <span className="sidebar-nav-icon">
                      <IconComponent />
                    </span>
                    {!collapsed && (
                      <span className="sidebar-nav-label">{item.label}</span>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </div>
        
        <div className="sidebar-bottom-nav">
          <button 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Basculer vers le thème ${theme === 'dark' ? 'clair' : 'sombre'}`}
          >
            <span className="sidebar-nav-icon">
              {theme === 'dark' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <path d="M12 1v2M12 21v2m11-10h-2M3 12H1m15.5-6.5l-1.4 1.4M6.9 17.1l-1.4 1.4m12.7 0l-1.4-1.4M6.9 6.9L5.5 5.5"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </span>
            {!collapsed && (
              <span className="sidebar-nav-label">
                Thème {theme === 'dark' ? 'clair' : 'sombre'}
              </span>
            )}
          </button>
          
          {!isAdmin && (
            <NavLink to="/settings" className={linkClass}>
              <span className="sidebar-nav-icon">
                <SettingsIcon />
              </span>
              {!collapsed && (
                <span className="sidebar-nav-label">Paramètres</span>
              )}
            </NavLink>
          )}
          
          <button 
            className="sidebar-nav-button"
            onClick={logout}
            title="Se déconnecter"
          >
            <span className="sidebar-nav-icon">
              <Icon name="log-out" size={20} />
            </span>
            {!collapsed && (
              <span className="sidebar-nav-label">Se déconnecter</span>
            )}
          </button>
        </div>
      </nav>
    </aside>
  )
}