const STATUS_LABELS = {
  lead: 'Lead',
  relance_1: 'Relance 1',
  relance_2: 'Relance 2',
  relance_3: 'Relance 3',
  relance_4: 'Relance 4',
  relance_5: 'Relance 5',
  relance_6: 'Relance 6',
  relance_7: 'Relance 7',
  relance_8: 'Relance 8',
  relance_9: 'Relance 9',
  relance_10: 'Relance 10',
  contacted: 'Contacté',
  replied: 'Répondu',
  value_shared: 'Valeur Partagée',
  meeting_scheduled: 'RDV Planifié',
  prospect: 'Prospect',
  client: 'Client',
  inactive: 'Inactif'
}

const STATUS_COLORS = {
  lead: '#F59E0B',
  relance_1: '#F97316',
  relance_2: '#F97316',
  relance_3: '#F97316',
  relance_4: '#F97316',
  relance_5: '#F97316',
  relance_6: '#F97316',
  relance_7: '#F97316',
  relance_8: '#F97316',
  relance_9: '#F97316',
  relance_10: '#F97316',
  contacted: '#06B6D4',
  replied: '#14B8A6',
  value_shared: '#8B5CF6',
  meeting_scheduled: '#EC4899',
  prospect: '#3B82F6',
  client: '#10B981',
  inactive: '#6B7280'
}

const SOURCE_LABELS = {
  LinkedIn: 'LinkedIn',
  Instagram: 'Instagram',
  Facebook: 'Facebook',
  Autre: 'Autre'
}

const SOURCE_COLORS = {
  LinkedIn: '#0077b5',
  Instagram: '#e4405f',
  Facebook: '#1877f2',
  Autre: '#6b7280'
}

function getBaseStatus(status) {
  if (!status) return 'lead'
  const parts = status.split('_r')
  return parts[0]
}

function getRelanceNumber(status) {
  if (!status) return null
  const parts = status.split('_r')
  return parts.length > 1 ? parseInt(parts[1]) : null
}

function StatusIcon({ baseStatus, size = 12 }) {
  const iconStyle = { marginRight: '4px' }
  
  if (baseStatus === 'lead') {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  } else if (baseStatus === 'contacted') {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  } else if (baseStatus === 'replied') {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  } else if (baseStatus === 'value_shared') {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
  } else if (baseStatus === 'meeting_scheduled') {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
  } else if (baseStatus === 'prospect') {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0-6 0"/><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0z"/></svg>
  } else if (baseStatus === 'client') {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
  } else if (baseStatus === 'inactive') {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
  }
  return null
}

function SourceIcon({ source, size = 10 }) {
  const iconStyle = { marginRight: '4px' }
  
  if (source === 'LinkedIn') {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={iconStyle}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
  } else if (source === 'Instagram') {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={iconStyle}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
  } else if (source === 'Facebook') {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" style={iconStyle}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={iconStyle}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
}

export function StatusBadge({ status }) {
  if (!status) return null
  
  const baseStatus = getBaseStatus(status)
  const color = STATUS_COLORS[baseStatus] || '#6B7280'
  const relanceNumber = getRelanceNumber(status)
  
  const badgeStyle = {
    backgroundColor: `${color}20`,
    color: color,
    padding: '5px 10px',
    borderRadius: '14px',
    fontSize: '12px',
    fontWeight: '500',
    border: `1px solid ${color}40`,
    display: 'inline-flex',
    alignItems: 'center',
    whiteSpace: 'nowrap'
  }
  
  return (
    <span className="custom-status-badge" style={badgeStyle}>
      <StatusIcon baseStatus={baseStatus} size={12} />
      {STATUS_LABELS[baseStatus] || baseStatus}
      {relanceNumber && <span style={{marginLeft: '4px', fontWeight: 'bold'}}>R{relanceNumber}</span>}
    </span>
  )
}

export function SourceBadge({ source }) {
  if (!source) return null
  
  const color = SOURCE_COLORS[source] || '#6b7280'
  
  const badgeStyle = {
    backgroundColor: `${color}20`,
    color: color,
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '500',
    border: `1px solid ${color}40`,
    display: 'inline-flex',
    alignItems: 'center',
    whiteSpace: 'nowrap'
  }
  
  return (
    <span className="custom-source-badge" style={badgeStyle}>
      <SourceIcon source={source} size={10} />
      {SOURCE_LABELS[source] || source}
    </span>
  )
}

export { STATUS_LABELS, STATUS_COLORS, SOURCE_LABELS, SOURCE_COLORS, getBaseStatus, getRelanceNumber }