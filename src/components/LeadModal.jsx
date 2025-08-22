import { useEffect, useState } from 'react'
import Modal from './Modal'
import Button from './Button'
import Input from './Input'

export default function LeadModal({ open, onClose, initial, onSaved }) {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    company: '',
    email: '',
    phonenumber: '',
    status: 'lead',
    source: 'Autre',
    linkedin_url: '',
    instagram_url: '',
    facebook_url: '',
    website_url: '',
    date: '',
    follow_up: '',
    notes: ''
  })

  useEffect(() => {
    if (initial) {
      // Diviser le full_name en firstname et lastname
      const nameParts = (initial.full_name || '').trim().split(' ')
      const firstname = nameParts[0] || ''
      const lastname = nameParts.slice(1).join(' ') || ''
      
      setForm({
        firstname: initial.firstname || firstname,
        lastname: initial.lastname || lastname,
        company: initial.company || '',
        email: initial.email || '',
        phonenumber: initial.phonenumber || initial.phone || '', // Support des deux formats
        status: initial.status || 'lead',
        source: initial.source || 'Autre',
        linkedin_url: initial.linkedin_url || '',
        instagram_url: initial.instagram_url || '',
        facebook_url: initial.facebook_url || '',
        website_url: initial.website_url || '',
        profile_picture_url: initial.profile_picture_url || '',
        date: initial.date || '',
        follow_up: initial.follow_up || '',
        notes: initial.notes || ''
      })
    } else {
      setForm({
        firstname: '',
        lastname: '',
        company: '',
        email: '',
        phonenumber: '',
        status: 'lead',
        source: 'Autre',
        linkedin_url: '',
        instagram_url: '',
        facebook_url: '',
        website_url: '',
        profile_picture_url: '',
        date: '',
        follow_up: '',
        notes: ''
      })
    }
  }, [initial, open])

  const save = (e) => {
    e.preventDefault()
    if (onSaved) {
      // Ne pas envoyer created_at/updated_at - géré par le backend
      // Filtrer les champs système
      const formData = Object.entries(form).reduce((acc, [key, value]) => {
        if (!['created_at', 'updated_at'].includes(key)) {
          acc[key] = value
        }
        return acc
      }, {})
      onSaved(formData)
    }
    onClose()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.type !== 'submit') {
      e.preventDefault()
      // Passer au champ suivant
      const inputs = Array.from(e.target.form.querySelectorAll('input, select'))
      const currentIndex = inputs.indexOf(e.target)
      const nextInput = inputs[currentIndex + 1]
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={initial?.id ? 'Modifier le lead' : 'Nouveau lead'}>
      <form className="form" onSubmit={save} onKeyDown={handleKeyDown}>
        <div className="form-group">
          <label>Prénom</label>
          <Input 
            placeholder="Jean" 
            value={form.firstname} 
            onChange={(e) => setForm({ ...form, firstname: e.target.value })} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Nom</label>
          <Input 
            placeholder="Dupont" 
            value={form.lastname} 
            onChange={(e) => setForm({ ...form, lastname: e.target.value })} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Entreprise</label>
          <Input 
            placeholder="TechCorp" 
            value={form.company} 
            onChange={(e) => setForm({ ...form, company: e.target.value })} 
          />
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <Input 
            type="email"
            placeholder="jean.dupont@techcorp.com" 
            value={form.email} 
            onChange={(e) => setForm({ ...form, email: e.target.value })} 
          />
        </div>
        
        <div className="form-group">
          <label>Téléphone</label>
          <Input 
            placeholder="+33 1 23 45 67 89" 
            value={form.phonenumber} 
            onChange={(e) => setForm({ ...form, phonenumber: e.target.value })} 
          />
        </div>
        
        <div className="form-group">
          <label>Statut</label>
          <select 
            className="input" 
            value={form.status} 
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="lead">Lead</option>
            <option value="relance_1">Relance 1</option>
            <option value="relance_2">Relance 2</option>
            <option value="relance_3">Relance 3</option>
            <option value="relance_4">Relance 4</option>
            <option value="relance_5">Relance 5</option>
            <option value="relance_6">Relance 6</option>
            <option value="relance_7">Relance 7</option>
            <option value="relance_8">Relance 8</option>
            <option value="relance_9">Relance 9</option>
            <option value="relance_10">Relance 10</option>
            <option value="contacted">Contacté</option>
            <option value="replied">Répondu</option>
            <option value="shared_value">Valeur Partagée</option>
            <option value="meeting_scheduled">RDV Planifié</option>
            <option value="prospect">Prospect</option>
            <option value="client">Client</option>
            <option value="inactive">Inactif</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Provenance</label>
          <select 
            className="input" 
            value={form.source} 
            onChange={(e) => setForm({ ...form, source: e.target.value })}
          >
            <option value="LinkedIn">LinkedIn</option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>LinkedIn</label>
          <Input 
            placeholder="https://linkedin.com/in/jean-dupont" 
            value={form.linkedin_url || ''} 
            onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} 
          />
        </div>
        
        <div className="form-group">
          <label>Instagram</label>
          <Input 
            placeholder="https://instagram.com/jean.dupont" 
            value={form.instagram_url || ''} 
            onChange={(e) => setForm({ ...form, instagram_url: e.target.value })} 
          />
        </div>
        
        <div className="form-group">
          <label>Facebook</label>
          <Input 
            placeholder="https://facebook.com/jean.dupont" 
            value={form.facebook_url || ''} 
            onChange={(e) => setForm({ ...form, facebook_url: e.target.value })} 
          />
        </div>
        
        <div className="form-group">
          <label>Site web</label>
          <Input 
            placeholder="https://monsite.com" 
            value={form.website_url || ''} 
            onChange={(e) => setForm({ ...form, website_url: e.target.value })} 
          />
        </div>
        
        {/* Champs additionnels disponibles dans le backend */}
        <div className="form-group">
          <label>Date de contact</label>
          <Input 
            type="date"
            value={form.date || ''} 
            onChange={(e) => setForm({ ...form, date: e.target.value })} 
          />
        </div>
        
        <div className="form-group">
          <label>Suivi prévu</label>
          <Input 
            placeholder="Ex: Rappeler lundi pour proposition" 
            value={form.follow_up || ''} 
            onChange={(e) => setForm({ ...form, follow_up: e.target.value })} 
          />
        </div>
        
        <div className="form-group">
          <label>Notes</label>
          <textarea 
            className="input"
            placeholder="Ex: Intéressé par notre solution, rappeler lundi pour proposition détaillée"
            value={form.notes || ''} 
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows="3"
            style={{ resize: 'vertical', minHeight: '80px' }}
          />
        </div>
        
        {/* Champs non implémentés mais disponibles en backend:
            - account_url: URL du compte social principal
            - profile_picture_url: Photo de profil 
        */}
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <Button type="button" variant="subtle" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" variant="primary">
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
  )
}