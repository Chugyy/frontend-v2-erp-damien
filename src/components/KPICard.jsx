import Icon from './Icon'

export default function KPICard({ title, value, change, trend, suffix = '', icon, color }) {
  const isUp = trend === 'up'

  return (
    <div className="card">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          {icon && <Icon name={icon} size={16} color={color || 'var(--text-muted)'} />}
          <p className="muted" style={{ fontSize: '14px', margin: 0 }}>{title}</p>
        </div>
        <h3 style={{ fontSize: '28px', fontWeight: '700', margin: '8px 0' }}>{value}{suffix}</h3>
        {change !== 0 && (
          <p className="muted small" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: isUp ? 'var(--success)' : 'var(--danger)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Icon name={isUp ? 'arrow-up' : 'arrow-down'} size={14} /> {Math.abs(change).toFixed(1)}%
            </span>
            <span>vs période précédente</span>
          </p>
        )}
      </div>
    </div>
  )
}