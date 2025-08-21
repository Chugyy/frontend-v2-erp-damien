import { useState, useCallback } from 'react'

export function useNotifications() {
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random()
    const newNotification = {
      id,
      autoClose: true,
      duration: 5000,
      ...notification
    }
    
    setNotifications(prev => [...prev, newNotification])
    return id
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  // Méthodes de convenance
  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      ...options
    })
  }, [addNotification])

  const showError = useCallback((message, options = {}) => {
    return addNotification({
      type: 'error',
      message,
      autoClose: false, // Les erreurs ne se ferment pas automatiquement
      ...options
    })
  }, [addNotification])

  const showWarning = useCallback((message, options = {}) => {
    return addNotification({
      type: 'warning',
      message,
      duration: 7000, // Un peu plus long pour les warnings
      ...options
    })
  }, [addNotification])

  const showInfo = useCallback((message, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      ...options
    })
  }, [addNotification])

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}

export default useNotifications
