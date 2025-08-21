import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Button from '../components/Button'
import Table from '../components/Table'
import Modal from '../components/Modal'
import Input from '../components/Input'
import Icon from '../components/Icon'
import LoadingOverlay from '../components/LoadingOverlay'
import { useApi } from '../hooks/useApi'
import { adminApi } from '../scripts/admin'

function CreateUserModal({ isOpen, onClose, onSuccess }) {
  const [email, setEmail] = useState('')
  const [creating, setCreating] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    try {
      setCreating(true)
      await adminApi.createUser(email.trim())
      onSuccess()
      setEmail('')
      onClose()
    } catch (error) {
      console.error('Erreur création utilisateur:', error)
      alert('Erreur lors de la création de l\'utilisateur')
    } finally {
      setCreating(false)
    }
  }

  return (
    <Modal open={isOpen} onClose={onClose} title="Créer un utilisateur">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Email de l'utilisateur
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="utilisateur@exemple.com"
            required
            style={{ width: '100%' }}
          />
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            L'utilisateur recevra ses identifiants par email
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button variant="default" onClick={onClose} disabled={creating}>
            Annuler
          </Button>
          <Button type="submit" disabled={creating || !email.trim()}>
            {creating ? 'Création...' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { loading, request } = useApi()
  const navigate = useNavigate()

  const loadUsers = async () => {
    try {
      const data = await request(
        () => adminApi.getUsers(),
        'Chargement des utilisateurs...'
      )
      setUsers(data.users || [])
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const userColumns = [
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Rôle' },
    { key: 'created_at', header: 'Créé le' },
    { key: 'actions', header: 'Actions' }
  ]

  const userRows = users.map(user => ({
    ...user,
    email: (
      <div>
        <div style={{ fontWeight: '500' }}>{user.email}</div>
        {(user.firstname || user.lastname) && (
          <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            {[user.firstname, user.lastname].filter(Boolean).join(' ')}
          </div>
        )}
      </div>
    ),
    role: (
      <span className={`badge ${user.is_admin ? 'badge-purple' : 'badge-default'}`}>
        {user.is_admin ? 'Admin' : 'Utilisateur'}
      </span>
    ),
    created_at: new Date(user.created_at).toLocaleDateString('fr-FR'),
    actions: (
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button variant="subtle" size="sm" onClick={() => navigate(`/admin/users/${user.user_id}/kpis`)}>
          <Icon name="bar-chart" size={14} /> Voir KPIs
        </Button>
        <Button variant="default" size="sm" onClick={() => openEdit(user)}>
          <Icon name="edit" size={14} /> Éditer
        </Button>
        <Button variant="subtle" size="sm" onClick={() => handleResendInvite(user)}>
          <Icon name="send" size={14} /> Renvoyer
        </Button>
        <Button variant="danger" size="sm" onClick={() => handleDelete(user)}>
          <Icon name="trash" size={14} /> Supprimer
        </Button>
      </div>
    )
  }))

  const [editingUser, setEditingUser] = useState(null)
  const [editEmail, setEditEmail] = useState('')
  const [editIsAdmin, setEditIsAdmin] = useState(false)
  const [saving, setSaving] = useState(false)

  const openEdit = (user) => {
    setEditingUser(user)
    setEditEmail(user.email || '')
    setEditIsAdmin(!!user.is_admin)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!editingUser) return
    try {
      setSaving(true)
      await adminApi.updateUser(editingUser.user_id, { email: editEmail, is_admin: editIsAdmin })
      await loadUsers()
      setEditingUser(null)
    } catch (err) {
      console.error('Erreur mise à jour utilisateur:', err)
      alert('Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (user) => {
    if (!confirm('Supprimer cet utilisateur ?')) return
    try {
      await adminApi.deleteUser(user.user_id)
      await loadUsers()
    } catch (err) {
      console.error('Erreur suppression utilisateur:', err)
      alert('Erreur lors de la suppression')
    }
  }

  const handleResendInvite = async (user) => {
    try {
      await adminApi.resendInvite(user.user_id)
      alert('Email renvoyé avec succès')
    } catch (err) {
      console.error('Erreur renvoi email:', err)
      alert('Erreur lors de l\'envoi de l\'email')
    }
  }

  return (
    <Layout>
      <LoadingOverlay show={loading} message={loading} />
      
      <div className="page-header">
        <div>
          <h1>Administration</h1>
          <p className="muted">Gestion des utilisateurs et aperçu des performances</p>
        </div>
        <div className="header-right">
          <Button onClick={() => setShowCreateModal(true)}>
            <Icon name="plus" size={16} />
            Créer un utilisateur
          </Button>
        </div>
      </div>

      <div className="card">
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
            Utilisateurs ({users.length})
          </h2>
        </div>
        
        <Table
          rows={userRows}
          columns={userColumns}
          emptyMessage="Aucun utilisateur trouvé"
        />
      </div>

      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={loadUsers}
      />

      {/* Modal d'édition */}
      <Modal open={!!editingUser} onClose={() => setEditingUser(null)} title="Éditer l'utilisateur">
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6 }}>Email</label>
              <Input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required />
            </div>
            <label className="checkbox">
              <input type="checkbox" checked={editIsAdmin} onChange={(e) => setEditIsAdmin(e.target.checked)} />
              Admin
            </label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
            <Button variant="default" onClick={() => setEditingUser(null)} disabled={saving}>Annuler</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</Button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
