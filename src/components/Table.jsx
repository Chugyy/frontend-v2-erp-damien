import { StatusBadge, SourceBadge } from './BadgeComponents.jsx'
import { isValidElement } from 'react'

function BoolDot({ value }) {
  return <span className="dot" data-on={!!value} />
}

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

function UrlLinks({ row }) {
  const urls = []
  if (row.linkedin_url) urls.push({ 
    type: 'LinkedIn', 
    url: row.linkedin_url, 
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="#0077b5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
  })
  if (row.instagram_url) urls.push({ 
    type: 'Instagram', 
    url: row.instagram_url, 
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="url(#instagram-gradient)"><defs><linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#833ab4"/><stop offset="50%" stopColor="#fd1d1d"/><stop offset="100%" stopColor="#fcb045"/></linearGradient></defs><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
  })
  if (row.facebook_url) urls.push({ 
    type: 'Facebook', 
    url: row.facebook_url, 
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877f2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  })
  if (row.website_url) urls.push({ 
    type: 'Site web', 
    url: row.website_url, 
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
  })
  
  if (urls.length === 0) return <div className="cell-clip">-</div>
  
  return (
    <div className="url-links">
      {urls.map((link, i) => (
        <a
          key={i}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="url-link"
          title={link.type}
          onClick={(e) => e.stopPropagation()}
        >
          {link.icon}
        </a>
      ))}
    </div>
  )
}

function NameCell({ name, avatarUrl }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          width={24}
          height={24}
          style={{ borderRadius: '50%', objectFit: 'cover', border: '1px solid #e5e7eb' }}
          onError={(e) => { 
            e.target.style.display = 'none'
            e.target.nextSibling.style.display = 'flex'
          }}
        />
      ) : null}
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: '#3b82f6',
        display: avatarUrl ? 'none' : 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: 'bold',
        color: 'white',
        flexShrink: 0
      }}>
        {name?.charAt(0)?.toUpperCase() || '?'}
      </div>
      <div className="cell-clip" title={name || ''}>{String(name ?? '')}</div>
    </div>
  )
}

export default function Table({ columns, rows = [], onRowClick, selectedRows = [], onRowSelect, onSelectAll, emptyMessage = "Aucune donnée" }) {
  const DEFAULT_COL_WIDTH = 180
  const isAllSelected = rows.length > 0 && selectedRows.length === rows.length
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < rows.length
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            {onRowSelect && (
              <th style={{ width: '40px' }}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={input => {
                    if (input) input.indeterminate = isIndeterminate
                  }}
                  onChange={(e) => onSelectAll && onSelectAll(e.target.checked)}
                />
              </th>
            )}
            {onRowSelect && (
              <th style={{ width: '32px' }}></th>
            )}
            {columns.map((c) => (
              <th key={c.key} style={{ width: c.width || DEFAULT_COL_WIDTH }}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const rowId = row.contact_id || row.user_id || index
            const isSelected = selectedRows.includes(rowId)
            return (
              <tr 
                key={rowId} 
                className="table-row"
              >
                {onRowSelect && (
                  <td style={{ width: '40px' }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        e.stopPropagation()
                        onRowSelect(rowId, e.target.checked)
                      }}
                    />
                  </td>
                )}
                {onRowSelect && (
                  <td style={{ width: '32px', padding: '4px' }}>
                    {row.profile_picture_url ? (
                      <img
                        src={row.profile_picture_url}
                        alt={row.full_name}
                        width={24}
                        height={24}
                        style={{ borderRadius: '50%', objectFit: 'cover', border: '1px solid #e5e7eb'}}
                        onError={(e) => { 
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#3b82f6',
                      display: row.profile_picture_url ? 'none' : 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: 'white'
                    }}>
                      {row.full_name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                  </td>
                )}
                {columns.map((c, index) => {
                  const val = row[c.key]
                  let content
                  if (typeof c.render === 'function') {
                    content = c.render(row)
                  } else if (isValidElement(val)) {
                    content = val
                  } else {
                    content = <div className="cell-clip" title={val || ''}>{String(val ?? '')}</div>
                  }
                  if (c.type === 'bool') content = <BoolDot value={val} />
                  if (c.type === 'status') content = <StatusBadge status={val} />
                  if (c.type === 'source') content = <SourceBadge source={val} />
                  if (c.type === 'date') content = <div className="cell-clip">{formatDate(val)}</div>
                  if (c.type === 'urls') content = <UrlLinks row={row} />
                  if (c.type === 'name') {
                    content = (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {row.profile_picture_url ? (
                          <img
                            src={row.profile_picture_url}
                            alt={val}
                            width={24}
                            height={24}
                            style={{ borderRadius: '50%', objectFit: 'cover', border: '1px solid #e5e7eb' }}
                            onError={(e) => { 
                              e.target.style.display = 'none'
                              e.target.nextSibling.style.display = 'flex'
                            }}
                          />
                        ) : null}
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: '#3b82f6',
                          display: row.profile_picture_url ? 'none' : 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          color: 'white',
                          flexShrink: 0
                        }}>
                          {val?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="cell-clip" title={val || ''} style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>{String(val ?? '')}</div>
                      </div>
                    )
                  }
                  
                  // Ajouter la flèche pour modifier sur la première colonne (nom)
                  if (index === 0 && onRowClick) {
                    content = (
                      <div className="table-cell-with-action">
                        <div className="cell-clip" title={val || ''} style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>{String(val ?? '')}</div>
                        <button 
                          className="table-edit-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            onRowClick(row)
                          }}
                          title="Modifier"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="9,18 15,12 9,6"/>
                          </svg>
                        </button>
                      </div>
                    )
                  }
                  
                  return <td key={c.key} style={{ width: c.width || DEFAULT_COL_WIDTH }}>{content}</td>
                })}
              </tr>
            )
          })}
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length + (onRowSelect ? 2 : 0)} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}