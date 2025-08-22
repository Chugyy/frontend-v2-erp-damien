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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <p className="muted small" style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
              <Icon name={isUp ? 'arrow-up' : 'arrow-down'} size={14} color={isUp ? 'var(--success)' : 'var(--danger)'} />
              <span style={{ color: isUp ? 'var(--success)' : 'var(--danger)', fontWeight: '500' }}>
                {Math.abs(change).toFixed(1)}%
              </span>
            </p>
            <p className="muted small" style={{ margin: 0, fontSize: '12px' }}>vs période précédente</p>
          </div>
        )}
      </div>
    </div>
  )
}