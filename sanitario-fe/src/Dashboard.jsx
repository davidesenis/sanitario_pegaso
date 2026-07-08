import { useState, useEffect, useContext } from 'react'
import { AuthContext } from './AuthContext'
import * as api from './api'

export default function Dashboard({ onShowSuccess }) {
  const { user, logout } = useContext(AuthContext)
  const [prenotazioniConfermate, setPrenotazioniConfermate] = useState([])
  const [prenotazioniInAttesa, setPrenotazioniInAttesa] = useState([])
  const [prenotazioniRifiutate, setPrenotazioniRifiutate] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [activeTab, setActiveTab] = useState('attesa')
  const [medici, setMedici] = useState([])
  const [reparti, setReparti] = useState([])
  const [occupiedSlots, setOccupiedSlots] = useState([])
  const [formData, setFormData] = useState({
    reparto: '',
    data: '',
    orario: ''
  })

  // Carica le prenotazioni e i medici al mount
  useEffect(() => {
    loadPrenotazioni()
    loadMedici()
  }, [])

  const loadPrenotazioni = async () => {
    try {
      setLoading(true)
      const data = await api.getPrenotazioniByUser(user.id)
      const inAttesa = data.filter(p => p.stato === 'IN_ATTESA')
      const confermate = data.filter(p => p.stato === 'CONFERMATA')
      const rifiutate = data.filter(p => p.stato === 'RIFIUTATA')
      setPrenotazioniInAttesa(inAttesa)
      setPrenotazioniConfermate(confermate)
      setPrenotazioniRifiutate(rifiutate)
    } catch (err) {
      setError('Errore nel caricamento delle prenotazioni')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadMedici = async () => {
    try {
      const data = await api.getMedici()
      setMedici(data)
      const repartiUnici = [...new Set(data.map(m => m.reparto))].sort()
      setReparti(repartiUnici)
    } catch (err) {
      console.error('Errore nel caricamento dei medici', err)
    }
  }

  // Funzione di cancellazione rimossa: eliminazione non disponibile via UI

  const handleBookingChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'reparto' || name === 'data' ? { orario: '' } : {})
    }))
    setError('')
  }

  const getMedicoSelezionato = () => medici.find(m => m.reparto === formData.reparto)

  const isValidDateTime = (dateTime) => {
    const date = new Date(dateTime)
    const dayOfWeek = date.getDay()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const isHalfHourSlot = minute === 0 || minute === 30
    return dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= 9 && hour < 18 && isHalfHourSlot
  }

  const getMinDateTime = () => {
    const now = new Date()
    const dayOfWeek = now.getDay()

    if (dayOfWeek === 0) {
      now.setDate(now.getDate() + 1)
    } else if (dayOfWeek === 6) {
      now.setDate(now.getDate() + 2)
    }

    if (now.getHours() < 9) {
      now.setHours(9, 0, 0, 0)
    } else if (now.getHours() >= 18) {
      now.setDate(now.getDate() + 1)
      now.setHours(9, 0, 0, 0)
    }

    return now.toISOString().slice(0, 16)
  }

  const getMinDate = () => getMinDateTime().slice(0, 10)

  const timeSlots = []
  for (let hour = 9; hour < 18; hour += 1) {
    timeSlots.push(`${String(hour).padStart(2, '0')}:00`)
    timeSlots.push(`${String(hour).padStart(2, '0')}:30`)
  }

  useEffect(() => {
    const loadOccupiedSlots = async () => {
      const medicoSelezionato = getMedicoSelezionato()
      if (!medicoSelezionato || !formData.data) {
        setOccupiedSlots([])
        return
      }

      try {
        const slots = await api.getOccupiedSlots(medicoSelezionato.id, formData.data)
        const occupiedTimes = slots
          .map(slot => (slot.includes('T') ? slot.slice(11, 16) : slot))
        setOccupiedSlots(occupiedTimes)
      } catch (err) {
        setOccupiedSlots([])
        console.error('Errore nel caricamento degli slot occupati', err)
      }
    }

    loadOccupiedSlots()
  }, [formData.reparto, formData.data, medici])

  const handleSubmitBooking = async (e) => {
    e.preventDefault()
    setError('')

    try {
      if (!formData.reparto || !formData.data || !formData.orario) {
        setError('Seleziona il tipo di visita e la data/orario')
        return
      }

      const dataOraSelezionata = `${formData.data}T${formData.orario}`

      if (!isValidDateTime(dataOraSelezionata)) {
        setError('La prenotazione è disponibile solo da lunedì a venerdì, dalle 9:00 alle 18:00')
        return
      }

      if (occupiedSlots.includes(formData.orario)) {
        setError('Lo slot selezionato e gia occupato. Scegli un altro orario.')
        return
      }

       const medicoSelezionato = getMedicoSelezionato()
       if (!medicoSelezionato) {
         setError('Medico non trovato per il reparto selezionato')
         return
       }

       await api.createPrenotazione({
         pazienteId: user.id,
         medicoId: medicoSelezionato.id,
         dataOra: dataOraSelezionata
       })

       setFormData({ reparto: '', data: '', orario: '' })
       setOccupiedSlots([])
       setShowBookingForm(false)
       onShowSuccess(`Prenotazione creata! È in attesa di conferma da parte del Dr. ${medicoSelezionato.nome} ${medicoSelezionato.cognome}`)
       loadPrenotazioni()
    } catch (err) {
      setError(err.message || 'Errore nella creazione della prenotazione')
      console.error(err)
    }
  }

  const formatDataOra = (dataOra) => {
    const date = new Date(dataOra)
    return date.toLocaleString('it-IT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatoBadgeClass = (stato) => {
    switch(stato) {
      case 'IN_ATTESA':
        return 'status-pending'
      case 'CONFERMATA':
        return 'status-confirmed'
      case 'RIFIUTATA':
        return 'status-rejected'
      default:
        return ''
    }
  }

  const getStatoLabel = (stato) => {
    switch(stato) {
      case 'IN_ATTESA':
        return 'In Attesa di Conferma'
      case 'CONFERMATA':
        return 'Confermata'
      case 'RIFIUTATA':
        return 'Rifiutata'
      default:
        return stato
    }
  }

  const handleLogout = () => {
    if (window.confirm('Sei sicuro di voler effettuare il logout?')) {
      logout()
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Benvenuto, {user.nome}!</h1>
          <p className="subtitle">Gestisci le tue prenotazioni</p>
        </div>
        <button className="button button-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {error && <div className="error-message dashboard-error">{error}</div>}

      <div className="dashboard-content">
        {/* Sezione Prenotazioni */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Le tue prenotazioni</h2>
            <button
              className="button button-primary"
              onClick={() => setShowBookingForm(!showBookingForm)}
            >
              {showBookingForm ? 'Nascondi' : '+ Nuova Prenotazione'}
            </button>
          </div>

          <div className="tabs-container">
            <button
              className={`tab-button ${activeTab === 'confermate' ? 'active' : ''}`}
              onClick={() => setActiveTab('confermate')}
            >
              Confermate ({prenotazioniConfermate.length})
            </button>
            <button
              className={`tab-button ${activeTab === 'attesa' ? 'active' : ''}`}
              onClick={() => setActiveTab('attesa')}
            >
              In Attesa ({prenotazioniInAttesa.length})
            </button>
            <button
              className={`tab-button ${activeTab === 'rifiutate' ? 'active' : ''}`}
              onClick={() => setActiveTab('rifiutate')}
            >
              Rifiutate ({prenotazioniRifiutate.length})
            </button>
          </div>

          {/* Form Nuova Prenotazione */}
          {showBookingForm && (
            <form className="booking-form-dashboard" onSubmit={handleSubmitBooking}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="reparto">Tipo di Visita (Reparto) *</label>
                  <select
                    id="reparto"
                    name="reparto"
                    value={formData.reparto}
                    onChange={handleBookingChange}
                    required
                  >
                    <option value="">-- Seleziona un reparto --</option>
                    {reparti.map(reparto => (
                      <option key={reparto} value={reparto}>
                        {reparto}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="data">Data *</label>
                  <input
                    type="date"
                    id="data"
                    name="data"
                    value={formData.data}
                    onChange={handleBookingChange}
                    min={getMinDate()}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="orario">Orario *</label>
                  <p className="form-hint">(Slot da 30 minuti, lunedi-venerdi 9:00-18:00)</p>
                  <select
                    id="orario"
                    name="orario"
                    value={formData.orario}
                    onChange={handleBookingChange}
                    required
                    disabled={!formData.data || !formData.reparto}
                  >
                    <option value="">-- Seleziona uno slot --</option>
                    {timeSlots.map(slot => {
                      const isOccupied = occupiedSlots.includes(slot)
                      return (
                        <option key={slot} value={slot} disabled={isOccupied}>
                          {isOccupied ? `${slot} (occupato)` : slot}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="form-actions">
                <button type="submit" className="button button-primary">
                  Prenota Visita
                </button>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => {
                    setShowBookingForm(false)
                      setFormData({ reparto: '', data: '', orario: '' })
                      setOccupiedSlots([])
                    setError('')
                  }}
                >
                  Annulla
                </button>
              </div>
            </form>
          )}

          {/* Lista Prenotazioni */}
          {loading ? (
            <p className="loading">Caricamento prenotazioni...</p>
          ) : activeTab === 'attesa' && prenotazioniInAttesa.length === 0 ? (
            <p className="empty-state">Non hai prenotazioni in attesa</p>
          ) : activeTab === 'confermate' && prenotazioniConfermate.length === 0 ? (
            <p className="empty-state">Non hai prenotazioni confermate</p>
          ) : activeTab === 'rifiutate' && prenotazioniRifiutate.length === 0 ? (
            <p className="empty-state">Non hai prenotazioni rifiutate</p>
          ) : (
            <div className="prenotazioni-list">
              {(activeTab === 'attesa' ? prenotazioniInAttesa : activeTab === 'confermate' ? prenotazioniConfermate : prenotazioniRifiutate).map(prenotazione => (
                <div key={prenotazione.id} className="prenotazione-card">
                  <div className="prenotazione-info">
                    <div className="prenotazione-header">
                      <h3>{prenotazione.medico.reparto}</h3>
                      <span className={`status-badge ${getStatoBadgeClass(prenotazione.stato)}`}>
                        {getStatoLabel(prenotazione.stato)}
                      </span>
                    </div>
                    <div className="prenotazione-details">
                      <p><strong>Medico:</strong> Dr. {prenotazione.medico.nome} {prenotazione.medico.cognome}</p>
                      <p><strong>Data e Ora:</strong> {formatDataOra(prenotazione.dataOra)}</p>
                      <p><strong>Telefono medico:</strong> {prenotazione.medico.numeroTelefono}</p>
                    </div>
                  </div>
                  {/* Pulsante cancella rimosso per evitare cancellazioni */}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sezione Profilo */}
        <div className="dashboard-section profile-section">
          <h2>Dati Personali</h2>
          <div className="profile-info">
            <p><strong>Nome:</strong> {user.nome} {user.cognome}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Telefono:</strong> {user.numeroTelefono}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

