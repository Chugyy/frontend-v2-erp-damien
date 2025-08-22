import { useState, useMemo, useEffect, useCallback } from 'react'
import Layout from '../components/Layout'
import Button from '../components/Button'
import Table from '../components/Table'
import Kanban from '../components/Kanban'
import LeadModal from '../components/LeadModal'
import ActionModal from '../components/ActionModal'
import LoadingOverlay from '../components/LoadingOverlay'
import { useApi } from '../hooks/useApi'
import { contacts as contactsApi } from '../scripts/contacts'

function Header({ title, subtitle, right }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
      <div className="header-right">{right}</div>
    </div>
  )
}

// Fonction pour extraire le statut de base (sans relance)
function getBaseStatus(status) {
  if (!status) return 'lead'
  const parts = status.split('_r')
  return parts[0]
}

// Fonction pour générer l'objet urls à partir des URLs individuelles
function generateUrls(contact) {
  const urls = {}
  if (contact.linkedin_url) urls.linkedin = contact.linkedin_url
  if (contact.instagram_url) urls.instagram = contact.instagram_url
  if (contact.facebook_url) urls.facebook = contact.facebook_url
  if (contact.website_url) urls.website = contact.website_url
  return urls
}

// Fonction pour transformer un contact du backend vers le format frontend
function transformContactForDisplay(contact) {
  return {
    ...contact,
    urls: generateUrls(contact)
    // Le backend retourne déjà full_name et phone (mappé depuis phonenumber)
  }
}

export default function CRM() {
  const [allContacts, setAllContacts] = useState([]) // Cache local complet
  const [filteredLeads, setFilteredLeads] = useState([])
  const [formOpen, setFormOpen] = useState(false)
  const [editLead, setEditLead] = useState(null)
  const [view, setView] = useState('table')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalContacts, setTotalContacts] = useState(0)
  const [kanbanPage, setKanbanPage] = useState(1)
  const [hasMoreKanban, setHasMoreKanban] = useState(true)
  const [selectedRows, setSelectedRows] = useState([])
  const [actionModalOpen, setActionModalOpen] = useState(false)
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [paginationCache, setPaginationCache] = useState(new Map())
  const [filters, setFilters] = useState({
    statuses: [],
    sources: [],
    sortBy: 'created_at',
    sortOrder: 'desc'
  })
  const itemsPerPage = 100
  const { loading, request } = useApi()

    const columns = [
      { key: 'full_name', header: 'Nom', width: 180, type: 'name' },
      { key: 'company', header: 'Entreprise', width: 160 },
      { key: 'email', header: 'Email', width: 200 },
      { key: 'phone', header: 'Téléphone', width: 140 }, // Backend: phonenumber
      { key: 'status', header: 'Statut', width: 140, type: 'status' },
      { key: 'source', header: 'Provenance', width: 140, type: 'source' },
      { key: 'urls', header: 'Liens', width: 100, type: 'urls' }, // URLs calculé depuis linkedin_url, instagram_url, etc
      { key: 'created_at', header: 'Ajouté le', width: 130, type: 'date' },
      { key: 'updated_at', header: 'Modifié le', width: 130, type: 'date' },
      // Colonnes manquantes disponibles dans le backend:
      // - follow_up: Suivi prévu
      // - date: Date du contact 
      // - account_url: URL du compte
      // - profile_picture_url: Photo de profil
    ]

  // Tri local intelligent avec recherche différée
  const localFilter = useCallback((contacts, searchTerm, statusFilter, sourceFilter) => {
    let filtered = contacts
    
    // Filtres sélectionnés en premier
    if (statusFilter.length > 0) {
      filtered = filtered.filter(contact => {
        const baseStatus = getBaseStatus(contact.status)
        return statusFilter.includes(baseStatus)
      })
    }
    
    if (sourceFilter.length > 0) {
      filtered = filtered.filter(contact => {
        if (!contact.source) return false
        return sourceFilter.some(filter => 
          contact.source.toLowerCase() === filter.toLowerCase()
        )
      })
    }
    
    // Recherche textuelle
    if (searchTerm.trim()) {
      const term = searchTerm.trim()
      filtered = filtered.filter(contact => 
        contact.full_name?.includes(term) ||
        contact.full_name?.toLowerCase().includes(term.toLowerCase()) ||
        contact.company?.includes(term) ||
        contact.company?.toLowerCase().includes(term.toLowerCase()) ||
        contact.email?.includes(term) ||
        contact.email?.toLowerCase().includes(term.toLowerCase()) ||
        contact.source?.includes(term) ||
        contact.source?.toLowerCase().includes(term.toLowerCase())
      )
    }
    
    // Tri final
    filtered.sort((a, b) => {
      let aVal, bVal
      
      switch (filters.sortBy) {
        case 'name':
          aVal = a.full_name || ''
          bVal = b.full_name || ''
          break
        case 'company':
          aVal = a.company || ''
          bVal = b.company || ''
          break
        case 'created_at':
          aVal = new Date(a.created_at || 0)
          bVal = new Date(b.created_at || 0)
          break
        case 'updated_at':
          aVal = new Date(a.updated_at || 0)
          bVal = new Date(b.updated_at || 0)
          break
        default:
          return 0
      }
      
      if (filters.sortBy === 'name' || filters.sortBy === 'company') {
        const result = aVal.localeCompare(bVal)
        return filters.sortOrder === 'asc' ? result : -result
      } else {
        const result = aVal - bVal
        return filters.sortOrder === 'asc' ? result : -result
      }
    })
    
    return filtered
  }, [filters.sortBy, filters.sortOrder])


  const getPaginationCacheKey = (page, status, search) => {
    return `page_${page}_status_${status || 'null'}_search_${search || ''}`
  }

  const isCacheValid = (timestamp) => {
    return Date.now() - timestamp < 3600000 // 1h = 3600000ms
  }


  // Effet simple : appliquer filtres ET faire recherche serveur si nécessaire
  useEffect(() => {
    // 1. Filtrage local d'abord
    const filtered = localFilter(allContacts, search, filters.statuses, filters.sources)
    setFilteredLeads(filtered)
    
    // 2. Recherche serveur si nécessaire (terme > 2 caractères ET pas de résultats locaux)
    const hasSearch = search.trim().length > 2
    const hasFilters = filters.statuses.length > 0 || filters.sources.length > 0
    
    if ((hasSearch || hasFilters) && filtered.length === 0) {
      if (searchTimeout) clearTimeout(searchTimeout)
      
      const timeoutId = setTimeout(async () => {
        setIsSearching(true)
        try {
          const serverResults = await contactsApi.searchContacts(search, 
            filters.statuses,
            filters.sources
          )
          
          if (serverResults.length > 0) {
            // Ajouter nouveaux contacts au cache local
            setAllContacts(prev => {
              const existingIds = new Set(prev.map(c => c.contact_id))
              const newContacts = serverResults
                .filter(c => !existingIds.has(c.contact_id))
                .map(transformContactForDisplay)
              return [...prev, ...newContacts]
            })
          }
        } catch (error) {
          console.error('Erreur recherche serveur:', error)
        } finally {
          setIsSearching(false)
        }
      }, 1000)
      
      setSearchTimeout(timeoutId)
    }
    
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout)
    }
  }, [search, filters.statuses, filters.sources, allContacts, localFilter])

  const handleSearch = (value) => {
    setSearch(value)
    setCurrentPage(1)
    setKanbanPage(1)
    setHasMoreKanban(true)
    // Reset pagination et recharger depuis le serveur
    if (value.trim() === '') {
      loadContacts(1)
    }
  }

  const paginatedLeads = filteredLeads
  const totalPages = Math.ceil(totalContacts / itemsPerPage)

  const handleSaveLead = async (leadData) => {
    try {
      if (editLead) {
        await request(
          () => contactsApi.update(editLead.contact_id, leadData),
          'Mise à jour du contact...'
        )
      } else {
        await request(
          () => contactsApi.create(leadData),
          'Création du contact...'
        )
      }
      // Invalider cache et recharger
      setPaginationCache(new Map())
      await loadContacts(currentPage, true)
    } catch (error) {
      console.error('Erreur sauvegarde contact:', error)
    }
  }

  const handleKanbanUpdate = async (leadId, updatedLead) => {
    try {
      // Appeler l'API pour mettre à jour le contact
      await request(
        () => contactsApi.update(leadId, { status: updatedLead.status }),
        'Mise à jour du statut...'
      )
      
      // Invalider cache et recharger
      setPaginationCache(new Map())
      await loadContacts(currentPage, true)
    } catch (error) {
      console.error('Erreur mise à jour statut:', error)
    }
  }

  const handleKanbanEdit = (lead) => {
    setEditLead(lead)
    setFormOpen(true)
  }

  const handleKanbanDelete = async (leadId) => {
    const lead = allContacts.find(l => l.contact_id === leadId)
    const message = `Êtes-vous sûr de vouloir supprimer "${lead?.full_name}" ?`
    
    if (!window.confirm(message)) return
    
    try {
      await request(
        () => contactsApi.delete(leadId),
        'Suppression du contact...'
      )
      
      // Invalider cache et recharger
      setPaginationCache(new Map())
      await loadContacts(currentPage, true)
    } catch (error) {
      console.error('Erreur suppression contact:', error)
    }
  }

  const loadContacts = useCallback(async (page = currentPage, forceRefresh = false, isKanbanLoad = false) => {
    const statusFilter = filters.statuses.length > 0 ? filters.statuses[0] : null
    const searchTerm = search.trim() || null
    const cacheKey = getPaginationCacheKey(page, statusFilter, searchTerm)
    
    // Vérifier cache 1h
    if (!forceRefresh) {
      const cached = paginationCache.get(cacheKey)
      if (cached && isCacheValid(cached.timestamp)) {
        setFilteredLeads(cached.contacts)
        setTotalContacts(cached.total)
        return
      }
    }
    
    try {
      const data = await request(
        () => contactsApi.getAll(statusFilter, page, itemsPerPage, searchTerm),
        'Chargement des contacts...'
      )
      const contacts = data.contacts || []
      const transformedContacts = contacts.map(transformContactForDisplay)
      
      setFilteredLeads(transformedContacts)
      setTotalContacts(data.total || contacts.length)
      
      // Mise en cache pour 1h
      setPaginationCache(prev => new Map([
        ...prev,
        [cacheKey, {
          contacts: transformedContacts,
          total: data.total || contacts.length,
          timestamp: Date.now()
        }]
      ]))
      
      // Mise à jour du cache global pour éviter doublons
      setAllContacts(prev => {
        const existingIds = new Set(prev.map(c => c.contact_id))
        const newContacts = transformedContacts.filter(c => !existingIds.has(c.contact_id))
        return isKanbanLoad ? [...prev, ...newContacts] : [...prev, ...newContacts]
      })
      
      // Pour Kanban : vérifier s'il y a plus de résultats
      if (isKanbanLoad) {
        setHasMoreKanban(transformedContacts.length === itemsPerPage)
      }
    } catch (error) {
      console.error('Erreur chargement contacts:', error)
      setFilteredLeads([])
      setTotalContacts(0)
    }
  }, [request, currentPage, filters.statuses, itemsPerPage, search, paginationCache])

  const loadMoreKanban = async () => {
    const nextPage = kanbanPage + 1
    await loadContacts(nextPage, false, true)
    setKanbanPage(nextPage)
  }

  useEffect(() => {
    loadContacts(currentPage)
  }, [loadContacts, currentPage, filters.statuses]) // Recharger à chaque changement de page ou statut

  const handleRowSelect = (rowId, checked) => {
    if (checked) {
      setSelectedRows(prev => [...prev, rowId])
    } else {
      setSelectedRows(prev => prev.filter(id => id !== rowId))
    }
  }

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedRows(paginatedLeads.map(lead => lead.contact_id))
    } else {
      setSelectedRows([])
    }
  }

  const handleDeleteSelected = async () => {
    const count = selectedRows.length
    const message = count > 1 
      ? `Êtes-vous sûr de vouloir supprimer ces ${count} leads ?` 
      : 'Êtes-vous sûr de vouloir supprimer ce lead ?'
    
    if (!window.confirm(message)) return
    
    try {
      await request(
        () => contactsApi.bulkDelete(selectedRows),
        'Suppression des contacts...'
      )
      
      // Invalider cache et recharger
      setPaginationCache(new Map())
      await loadContacts(currentPage, true)
    } catch (error) {
      console.error('Erreur suppression contacts:', error)
    }
    setSelectedRows([])
    setActionModalOpen(false)
  }

  const handleDuplicateSelected = async () => {
    try {
      const selectedLeads = allContacts.filter(contact => selectedRows.includes(contact.contact_id))
      
      const duplicateData = {
        contact_ids: selectedRows,
        modifications: {
          firstname: selectedLeads[0]?.firstname ? `${selectedLeads[0].firstname} (copie)` : 'Copie'
        }
      }
      
      await request(
        () => contactsApi.bulkDuplicate(selectedRows, duplicateData.modifications),
        'Duplication des contacts...'
      )
      
      // Invalider cache et recharger
      setPaginationCache(new Map())
      await loadContacts(currentPage, true)
    } catch (error) {
      console.error('Erreur duplication contacts:', error)
    }
    setSelectedRows([])
    setActionModalOpen(false)
  }

  const handleEditSelected = () => {
    const selectedLead = allContacts.find(contact => selectedRows.includes(contact.contact_id))
    if (selectedLead) {
      setEditLead(selectedLead)
      setFormOpen(true)
      setSelectedRows([])
      setActionModalOpen(false)
    }
  }

  useEffect(() => {
    if (selectedRows.length > 0) {
      setActionModalOpen(true)
    } else {
      setActionModalOpen(false)
    }
  }, [selectedRows])


  return (
    <Layout>
      <LoadingOverlay show={loading || isSearching} message={loading || (isSearching ? 'Recherche en cours...' : '')} />
      <Header
        title="CRM"
        subtitle={`${totalContacts} contacts trouvés ${isSearching ? '(recherche...)' : ''}`}
        right={(
          <div className="header-actions">
            <Button 
              variant={view === 'table' ? 'primary' : 'default'}
              onClick={() => {
                setView('table')
                setSelectedRows([])
                setActionModalOpen(false)
              }}
            >
              Tableau
            </Button>
            <Button 
              variant={view === 'kanban' ? 'primary' : 'default'}
              onClick={() => {
                setView('kanban')
                setSelectedRows([])
                setActionModalOpen(false)
              }}
            >
              Kanban
            </Button>
            <Button 
              variant="primary" 
              onClick={() => { setEditLead(null); setFormOpen(true) }}
            >
              + Ajouter
            </Button>
          </div>
        )}
      />
      
      {/* Barre de filtres et recherche unifiée */}
      <div className="filters-bar card" style={{ display: 'flex', gap: '12px', padding: '16px', marginBottom: '16px', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div className="search-container" style={{ flex: 2, position: 'relative' }}>
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', zIndex: 1 }}>
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input 
            type="text" 
            placeholder="Rechercher un contact..." 
            className="input"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: '100%', minWidth: '300px', paddingLeft: '40px', borderRadius: '6px', fontSize: '14px', height: '85%' }}
          />
        </div>
        
        <select 
          className="input"
          value={filters.statuses[0] || ''}
          onChange={(e) => {
            setFilters({...filters, statuses: e.target.value ? [e.target.value] : []})
          }}
          style={{ minWidth: '110px', fontSize: '13px', height: '36px' }}
        >
          <option value="">Tous statuts</option>
          <option value="lead">Lead</option>
          <option value="contacted">Contacted</option>
          <option value="replied">Replied</option>
          <option value="shared_value">Value Shared</option>
          <option value="meeting_scheduled">Meeting Scheduled</option>
          <option value="prospect">Prospect</option>
          <option value="client">Client</option>
          <option value="inactive">Inactive</option>
        </select>
        
        <select 
          className="input"
          value={filters.sources[0] || ''}
          onChange={(e) => {
            setFilters({...filters, sources: e.target.value ? [e.target.value] : []})
          }}
          style={{ minWidth: '110px', fontSize: '13px', height: '36px' }}
        >
          <option value="">Toutes sources</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Instagram">Instagram</option>
          <option value="Facebook">Facebook</option>
          <option value="Autre">Autre</option>
        </select>
        
        <select 
          className="input"
          value={filters.sortBy}
          onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
          style={{ minWidth: '130px', fontSize: '13px', height: '36px' }}
        >
          <option value="created_at">Date création</option>
          <option value="updated_at">Date modification</option>
          <option value="name">Nom (A-Z)</option>
          <option value="company">Entreprise (A-Z)</option>
        </select>
        
        <select 
          className="input"
          value={filters.sortOrder}
          onChange={(e) => setFilters({...filters, sortOrder: e.target.value})}
          style={{ minWidth: '100px', fontSize: '13px', height: '36px' }}
        >
          <option value="desc">Plus récent</option>
          <option value="asc">Plus ancien</option>
        </select>
        
        <Button 
          variant="subtle"
          onClick={() => {
            setFilters({statuses: [], sources: [], sortBy: 'created_at', sortOrder: 'desc'})
            setSearch('')
          }}
          style={{ height: '38px', minWidth: '70px' }}
        >
          Reset
        </Button>
      </div>
      
      <div className="card">
        {view === 'table' ? (
          <>
            <Table 
              columns={columns} 
              rows={paginatedLeads} 
              onRowClick={(row) => { 
                setEditLead(row); 
                setFormOpen(true); 
                setSelectedRows([]);
                setActionModalOpen(false);
              }} 
              selectedRows={selectedRows}
              onRowSelect={handleRowSelect}
              onSelectAll={handleSelectAll}
            />
            <div className="pagination">
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                ← Précédent
              </Button>
              <span className="page-info">
                Page {currentPage} sur {totalPages} ({totalContacts} résultats)
              </span>
              <Button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                Suivant →
              </Button>
            </div>
          </>
        ) : (
          <>
            {hasMoreKanban && (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <Button 
                  variant="subtle" 
                  onClick={loadMoreKanban}
                  disabled={loading}
                >
                  Charger plus de résultats
                </Button>
              </div>
            )}
            <Kanban 
              items={filteredLeads} 
              onUpdate={handleKanbanUpdate}
              onEdit={handleKanbanEdit}
              onDelete={handleKanbanDelete}
            />
          </>
        )}
      </div>
      <LeadModal
        open={formOpen}
        initial={editLead}
        onClose={() => setFormOpen(false)}
        onSaved={handleSaveLead}
      />
      <ActionModal
        open={actionModalOpen}
        onClose={() => setActionModalOpen(false)}
        selectedCount={selectedRows.length}
        onDelete={handleDeleteSelected}
        onDuplicate={handleDuplicateSelected}
        onEdit={handleEditSelected}
      />
    </Layout>
  )
}