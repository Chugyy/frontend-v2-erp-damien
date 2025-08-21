import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'

export default function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = (() => {
      try {
        return localStorage.getItem('sidebarCollapsed')
      } catch {
        return null
      }
    })()
    return saved === 'true'
  })

  useEffect(() => {
    try {
      localStorage.setItem('sidebarCollapsed', String(sidebarCollapsed))
    } catch {
      // ignore
    }
  }, [sidebarCollapsed])

  return (
    <div className="layout">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />
      <main className={`content ${sidebarCollapsed ? 'collapsed' : ''}`}>{children}</main>
    </div>
  )
}