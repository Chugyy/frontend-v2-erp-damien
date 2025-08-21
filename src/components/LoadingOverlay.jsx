import { createPortal } from 'react-dom'

export default function LoadingOverlay({ show, message = 'Chargement...' }) {
  if (!show) return null

  return createPortal(
    <div className="loading-overlay">
      <div className="loading-content">
        <div className="spinner"></div>
        <p>{message}</p>
      </div>
    </div>,
    document.body
  )
}