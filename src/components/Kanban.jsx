import { useState } from 'react'
import Icon from './Icon'
import { StatusBadge, SourceBadge, getBaseStatus } from './BadgeComponents.jsx'



function KanbanUrlLinks({ card }) {
  const urls = []
  if (card.linkedin_url) urls.push({ 
    type: 'LinkedIn', 
    url: card.linkedin_url, 
    icon: <Icon name="linkedin" size={16} />
  })
  if (card.instagram_url) urls.push({ 
    type: 'Instagram', 
    url: card.instagram_url, 
    icon: <Icon name="instagram" size={16} />
  })
  if (card.facebook_url) urls.push({ 
    type: 'Facebook', 
    url: card.facebook_url, 
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  })
  if (card.website_url) urls.push({ 
    type: 'Site web', 
    url: card.website_url, 
    icon: <Icon name="link" size={16} />
  })
  
  if (urls.length === 0) return null
  
  return (
    <div className="card-footer">
      {urls.map((link, i) => (
        <a
          key={i}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link"
          title={link.type}
          onClick={(e) => e.stopPropagation()}
        >
          {link.icon}
        </a>
      ))}
    </div>
  )
}

export default function Kanban({ items, onUpdate, onEdit, onDelete }) {
  const [draggedItem, setDraggedItem] = useState(null)
  
  
  const columns = [
    { key: 'contacted', title: 'Contacté', color: '#06B6D4' },
    { key: 'replied', title: 'Répondu', color: '#14B8A6' },
    { key: 'shared_value', title: 'Valeur Partagée', color: '#8B5CF6' },
    { key: 'relance_1', title: 'Relance 1', color: '#F97316' },
    { key: 'relance_2', title: 'Relance 2', color: '#F97316' },
    { key: 'relance_3', title: 'Relance 3', color: '#F97316' },
    { key: 'relance_4', title: 'Relance 4', color: '#F97316' },
    { key: 'relance_5', title: 'Relance 5', color: '#F97316' },
    { key: 'relance_6', title: 'Relance 6', color: '#F97316' },
    { key: 'relance_7', title: 'Relance 7', color: '#F97316' },
    { key: 'relance_8', title: 'Relance 8', color: '#F97316' },
    { key: 'relance_9', title: 'Relance 9', color: '#F97316' },
    { key: 'relance_10', title: 'Relance 10', color: '#F97316' },
    { key: 'meeting_scheduled', title: 'RDV Planifié', color: '#EC4899' },
    { key: 'client', title: 'Client', color: '#10B981' },
    { key: 'inactive', title: 'Inactif', color: '#6B7280' },
  ]
  
  const grouped = Object.fromEntries(columns.map(c => [c.key, []]))
  for (const it of items) {
    const baseStatus = getBaseStatus(it.status)
    if (grouped[baseStatus]) {
      grouped[baseStatus].push(it)
    }
  }
  
  const handleDragStart = (e, item) => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = 'move'
  }
  
  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }
  
  const handleDrop = async (e, newStatus) => {
    e.preventDefault()
    if (!draggedItem) {
      setDraggedItem(null)
      return
    }
    
    if (draggedItem.status !== newStatus && onUpdate) {
      onUpdate(draggedItem.contact_id, { ...draggedItem, status: newStatus })
    }
    
    setDraggedItem(null)
  }
  
  return (
    <div className="kanban">
      {columns.map(col => (
        <div 
          key={col.key} 
           className="kanban-col"
           style={{ backgroundColor: col.color + '20' }}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, col.key)}
        >
          <div className="kanban-col-title">
            {col.title}
            <span className="kanban-count">{grouped[col.key].length}</span>
          </div>
          <div className="kanban-list" style={{borderLeftColor: col.color}}>
            {grouped[col.key].map(card => (
              <div 
                key={card.contact_id} 
                className={`kanban-card ${draggedItem?.contact_id === card.contact_id ? 'dragging' : ''}`}
                draggable
                onDragStart={(e) => handleDragStart(e, card)}
                onDragEnd={() => setDraggedItem(null)}
              >
                <div className="card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    {card.profile_picture_url ? (
                      <img 
                        src={card.profile_picture_url} 
                        alt={card.full_name}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '1px solid #e5e7eb'
                        }}
                        onError={(e) => { 
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6',
                      display: card.profile_picture_url ? 'none' : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: 'white',
                      flexShrink: 0
                    }}>
                      {card.full_name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="cell-clip bold" style={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      flex: 1,
                      minWidth: 0,
                      maxWidth: '120px'
                    }}>{card.full_name}</div>
                  </div>
                  <div className="kanban-card-actions">
                    <button 
                      className="kanban-action-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (onEdit) onEdit(card)
                      }}
                      title="Modifier"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button 
                      className="kanban-action-btn danger"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (onDelete) onDelete(card.contact_id)
                      }}
                      title="Supprimer"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <StatusBadge status={card.status} />
                  {card.source && <SourceBadge source={card.source} />}
                </div>
                <div className="cell-clip muted small" style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  width: '100%'
                }}>{card.company}</div>
                <div className="cell-clip small" style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  width: '100%'
                }}>{card.title}</div>
                {card.location && (
                  <div className="cell-clip tiny muted" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 6,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '100%'
                  }}>
                    <Icon name="map-pin" size={12} style={{ flexShrink: 0 }} /> 
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {card.location}
                    </span>
                  </div>
                )}
                <div className="card-indicators">
                  {card.checked && <span className="indicator"><Icon name="check-circle" size={14} /></span>}
                  {card.messaged && <span className="indicator"><Icon name="message" size={14} /></span>}
                  {card.interested && <span className="indicator"><Icon name="star" size={14} /></span>}
                </div>
                <KanbanUrlLinks card={card} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}