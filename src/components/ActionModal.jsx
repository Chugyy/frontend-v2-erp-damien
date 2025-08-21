import { useEffect, useState } from 'react'
import Button from './Button'

export default function ActionModal({ open, onClose, selectedCount, onDelete, onDuplicate, onEdit }) {
  const [isClosing, setIsClosing] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (open) {
      setShouldRender(true)
      setIsClosing(false)
      document.body.style.overflow = 'hidden'
    } else if (shouldRender) {
      setIsClosing(true)
      const timeout = setTimeout(() => {
        setShouldRender(false)
        setIsClosing(false)
      }, 250)
      return () => clearTimeout(timeout)
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open, shouldRender])

  if (!shouldRender) return null

  const isMultiple = selectedCount > 1

  return (
    <div 
      className={`action-modal-backdrop ${isClosing ? 'modal-closing' : 'modal-open'}`} 
      onClick={onClose}
    >
      <div 
        className="action-modal"
        onClick={e => e.stopPropagation()}
      >
        <div className="action-modal-content">
          <div className="action-modal-info">
            {selectedCount} élément{selectedCount > 1 ? 's' : ''} sélectionné{selectedCount > 1 ? 's' : ''}
          </div>
          <div className="action-modal-buttons">
            {!isMultiple && (
              <Button variant="primary" onClick={onEdit}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Modifier
              </Button>
            )}
            <Button onClick={onDuplicate}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Dupliquer
            </Button>
            <button className="action-modal-delete-btn" onClick={onDelete}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3,6 5,6 21,6"/>
                <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
              Supprimer {isMultiple ? 'tout' : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}