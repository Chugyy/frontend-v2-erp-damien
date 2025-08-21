import { Routes, Route } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import ProtectedRoute from './components/ProtectedRoute'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CRM from './pages/CRM'
import Settings from './pages/Settings'
import AdminDashboard from './pages/AdminDashboard'
import AdminUserKPIs from './pages/AdminUserKPIs'
import './App.css'

export default function App() {
  useTheme()

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Routes utilisateur */}
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/crm" element={
        <ProtectedRoute>
          <CRM />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } />
      
      {/* Routes admin */}
      <Route path="/admin" element={
        <AdminProtectedRoute>
          <AdminDashboard />
        </AdminProtectedRoute>
      } />
      <Route path="/admin/users/:userId/kpis" element={
        <AdminProtectedRoute>
          <AdminUserKPIs />
        </AdminProtectedRoute>
      } />
    </Routes>
  )
}