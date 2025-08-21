export default function Button({ children, variant = 'default', className = '', ...props }) {
  const variantClass = {
    default: 'btn',
    primary: 'btn primary',
    secondary: 'btn secondary',
    subtle: 'btn subtle',
    danger: 'btn danger'
  }[variant]

  return (
    <button className={`${variantClass} ${className}`} {...props}>
      {children}
    </button>
  )
}