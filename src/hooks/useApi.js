import { useState, useCallback } from 'react'
import api from '../scripts/api'

export function useApi() {
  const [loading, setLoading] = useState(false)

  const request = useCallback(async (apiCall, loadingMessage = 'Chargement...') => {
    setLoading(loadingMessage)
    try {
      const result = await apiCall()
      return result
    } catch (error) {
      console.error('API Error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, request }
}