import Icon from './Icon'

export default function KPICard({ title, value, suffix = '', icon, color }) {
  return (
    <div className="card">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          {icon && <Icon name={icon} size={16} color={color || 'var(--text-muted)'} />}
          <p className="muted" style={{ fontSize: '14px', margin: 0 }}>{title}</p>
        </div>
        <h3 style={{ fontSize: '28px', fontWeight: '700', margin: '8px 0' }}>{value}{suffix}</h3>
      </div>
    </div>
  )
}