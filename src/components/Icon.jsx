export default function Icon({ name, size = 16, color = 'currentColor' }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    xmlns: 'http://www.w3.org/2000/svg',
  }

  const strokeProps = {
    fill: 'none',
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  }

  if (name === 'linkedin') {
    return (
      <svg {...common} fill={color} aria-hidden="true" focusable="false">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
      </svg>
    )
  }

  if (name === 'instagram') {
    return (
      <svg {...common} fill={color} aria-hidden="true" focusable="false">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    )
  }

  if (name === 'map-pin') {
    return (
      <svg {...common} {...strokeProps} aria-hidden="true" focusable="false">
        <path d="M12 21s-6-4.35-6-9a6 6 0 1 1 12 0c0 4.65-6 9-6 9z" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    )
  }

  if (name === 'check-circle') {
    return (
      <svg {...common} {...strokeProps} aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    )
  }

  if (name === 'message') {
    return (
      <svg {...common} {...strokeProps} aria-hidden="true" focusable="false">
        <path d="M21 15a4 4 0 0 1-4 4H8l-4 4V7a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4z" />
      </svg>
    )
  }

  if (name === 'star') {
    return (
      <svg {...common} {...strokeProps} aria-hidden="true" focusable="false">
        <path d="M12 3l2.9 5.88 6.1.89-4.4 4.29 1.04 6.06L12 17.77 6.36 20.12 7.4 14.06 3 9.77l6.1-.89L12 3z" />
      </svg>
    )
  }

  if (name === 'send') {
    return (
      <svg {...common} {...strokeProps} aria-hidden="true" focusable="false">
        <path d="M22 2 11 13" />
        <path d="M22 2 15 22 11 13 2 9 22 2" />
      </svg>
    )
  }

  if (name === 'calendar-check') {
    return (
      <svg {...common} {...strokeProps} aria-hidden="true" focusable="false">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="m9 16 2 2 4-4" />
      </svg>
    )
  }

  if (name === 'clock') {
    return (
      <svg {...common} {...strokeProps} aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    )
  }

  if (name === 'percent') {
    return (
      <svg {...common} {...strokeProps} aria-hidden="true" focusable="false">
        <circle cx="19" cy="5" r="2" />
        <circle cx="5" cy="19" r="2" />
        <path d="M6 18 18 6" />
      </svg>
    )
  }

  if (name === 'pie-chart') {
    return (
      <svg {...common} {...strokeProps} aria-hidden="true" focusable="false">
        <path d="M12 3a9 9 0 1 1-9 9" />
        <path d="M12 3v9h9" />
      </svg>
    )
  }

  if (name === 'arrow-up') {
    return (
      <svg {...common} {...strokeProps} aria-hidden="true" focusable="false">
        <path d="m5 12 7-7 7 7" />
        <path d="M12 19V5" />
      </svg>
    )
  }

  if (name === 'arrow-down') {
    return (
      <svg {...common} {...strokeProps} aria-hidden="true" focusable="false">
        <path d="m19 12-7 7-7-7" />
        <path d="M12 5v14" />
      </svg>
    )
  }

  if (name === 'refresh') {
    return (
      <svg {...common} {...strokeProps} aria-hidden="true" focusable="false">
        <path d="M3 12a9 9 0 0 1 15.36-6.36" />
        <polyline points="21 3 21 9 15 9" />
        <path d="M21 12a9 9 0 0 1-15.36 6.36" />
        <polyline points="3 21 3 15 9 15" />
      </svg>
    )
  }

  if (name === 'link') {
    return (
      <svg {...common} {...strokeProps} aria-hidden="true" focusable="false">
        <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1" />
        <path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" />
      </svg>
    )
  }

  if (name === 'settings') {
    return (
      <svg {...common} {...strokeProps} aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a2 2 0 0 0 .4 2.2l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a2 2 0 0 0-2.2-.4 2 2 0 0 0-1.2 1.8V22a2 2 0 1 1-4 0v-.2a2 2 0 0 0-1.2-1.8 2 2 0 0 0-2.2.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a2 2 0 0 0 .4-2.2 2 2 0 0 0-1.8-1.2H2a2 2 0 1 1 0-4h.2a2 2 0 0 0 1.8-1.2 2 2 0 0 0-.4-2.2l-.1-.1A2 2 0 1 1 6.3 3.5l.1.1a2 2 0 0 0 2.2.4A2 2 0 0 0 9.8 2.8V2a2 2 0 1 1 4 0v.2a2 2 0 0 0 1.2 1.8 2 2 0 0 0 2.2-.4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a2 2 0 0 0-.4 2.2 2 2 0 0 0 1.8 1.2H22a2 2 0 1 1 0 4h-.2a2 2 0 0 0-1.8 1.2z" />
      </svg>
    )
  }

  if (name === 'sun') {
    return (
      <svg {...common} {...strokeProps} aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2m11-10h-2M3 12H1m15.5-6.5l-1.4 1.4M6.9 17.1l-1.4 1.4m12.7 0l-1.4-1.4M6.9 6.9L5.5 5.5" />
      </svg>
    )
  }

  if (name === 'moon') {
    return (
      <svg {...common} {...strokeProps} aria-hidden="true" focusable="false">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    )
  }

  if (name === 'users') {
    return (
      <svg {...common} {...strokeProps} aria-hidden="true" focusable="false">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  }

  if (name === 'reply') {
    return (
      <svg {...common} {...strokeProps} aria-hidden="true" focusable="false">
        <polyline points="9 17 4 12 9 7" />
        <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
      </svg>
    )
  }

  if (name === 'dollar-sign') {
    return (
      <svg {...common} {...strokeProps} aria-hidden="true" focusable="false">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    )
  }

  if (name === 'shield') {
    return (
      <svg {...common} {...strokeProps} aria-hidden="true" focusable="false">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    )
  }

  if (name === 'log-out') {
    return (
      <svg {...common} {...strokeProps} aria-hidden="true" focusable="false">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    )
  }

  if (name === 'erp-logo') {
    return (
      <svg {...common} viewBox="0 0 100 100" fill={color} aria-hidden="true" focusable="false">
        <g transform="translate(50,50)">
          {/* Cube isométrique avec lettres SA intégrées */}
          <path d="M-25,-15 L0,-30 L25,-15 L25,5 L0,20 L-25,5 Z" fill="currentColor" opacity="0.9"/>
          <path d="M0,-30 L25,-15 L25,5 L0,20 L0,-30" fill="currentColor" opacity="0.7"/>
          <path d="M-25,-15 L0,-30 L0,20 L-25,5 Z" fill="currentColor" opacity="0.5"/>
          
          {/* Face avant avec S */}
          <path d="M-15,-8 L-8,-8 Q-5,-8 -5,-5 Q-5,-2 -8,-2 L-12,-2 Q-15,-2 -15,1 Q-15,4 -12,4 L-5,4" 
                stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          
          {/* Face droite avec A */}
          <path d="M8,-8 L12,4 M16,-8 L12,4 M9,-2 L15,-2" 
                stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </g>
      </svg>
    )
  }

  return null
}


