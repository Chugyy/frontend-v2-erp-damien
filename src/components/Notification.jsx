import { useState, useEffect } from 'react'

const NOTIFICATION_TYPES = {
  success: {
    icon: '✅',
    bgColor: '#f0fff4',
    borderColor: '#68d391',
    textColor: '#22543d'
  },
  error: {
    icon: '❌',
    bgColor: '#fed7d7',
    borderColor: '#fc8181',
    textColor: '#c53030'
  },
  warning: {
    icon: '⚠️',
    bgColor: '#fefcbf',
    borderColor: '#f6e05e',
    textColor: '#744210'
  },
  info: {
    icon: 'ℹ️',
    bgColor: '#ebf8ff',
    borderColor: '#63b3ed',
    textColor: '#2a69ac'
  }
}

export function Notification({ 
  type = 'info', 
  message, 
  title, 
  autoClose = true, 
  duration = 5000, 
  onClose,
  className = ''
}) {
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  const config = NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.info

  useEffect(() => {
    if (autoClose && duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [autoClose, duration])

  const handleClose = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose && onClose()
    }, 200)
  }

  if (!isVisible) return null

  return (
    <div 
      className={`notification notification-${type} ${isAnimating ? 'notification-closing' : ''} ${className}`}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '16px',
        backgroundColor: config.bgColor,
        border: `1px solid ${config.borderColor}`,
        borderRadius: '8px',
        color: config.textColor,
        fontSize: '14px',
        lineHeight: '1.4',
        margin: '12px 0',
        position: 'relative',
        animation: isAnimating ? 'slideOut 0.2s ease-in' : 'slideIn 0.3s ease-out',
        transform: isAnimating ? 'translateX(100%)' : 'translateX(0)',
        opacity: isAnimating ? 0 : 1,
        transition: 'all 0.2s ease'
      }}
    >
      <span style={{ fontSize: '16px', flexShrink: 0 }}>
        {config.icon}
      </span>
      
      <div style={{ flex: 1 }}>
        {title && (
          <div style={{ 
            fontWeight: '600', 
            marginBottom: '4px',
            color: config.textColor
          }}>
            {title}
          </div>
        )}
        <div style={{ color: config.textColor }}>
          {message}
        </div>
      </div>

      <button
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          color: config.textColor,
          cursor: 'pointer',
          fontSize: '18px',
          lineHeight: '1',
          padding: '0',
          marginLeft: '8px',
          opacity: 0.7,
          flexShrink: 0
        }}
        onMouseEnter={(e) => e.target.style.opacity = '1'}
        onMouseLeave={(e) => e.target.style.opacity = '0.7'}
      >
        ×
      </button>
    </div>
  )
}

export function NotificationContainer({ notifications = [], onRemove }) {
  return (
    <div 
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        maxWidth: '400px',
        width: '100%'
      }}
    >
      {notifications.map((notification, index) => (
        <Notification
          key={notification.id || index}
          {...notification}
          onClose={() => onRemove && onRemove(notification.id || index)}
        />
      ))}
    </div>
  )
}

export default Notification
