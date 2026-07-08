import { useState, useEffect, useContext } from 'react'
import { AuthContext } from './AuthContext'
import * as api from './api'

export default function DoctorDashboard({ onShowSuccess }) {
  const { user, logout } = useContext(AuthContext)
  const [prenotazioniInAttesa, setPrenotazioniInAttesa] = useState([])
  const [prenotazioniConfermate, setPrenotazioniConfermate] = useState([])
  const [prenotazioniRifiutate, setPrenotazioniRifiutate] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('attesa') // 'attesa' o 'tutte'

  // Carica le prenotazioni del medico al mount
  useEffect(() => {
    loadPrenotazioni()
  }, [])

  const loadPrenotazioni = async () => {
    try {
      setLoading(true)
      const tutte = await api.getPrenotazioniByMedico(user.id)
      const inAttesa = tutte.filter(p => p.stato === 'IN_ATTESA')
      const confermate = tutte.filter(p => p.stato === 'CONFERMATA')
      const rifiutate = tutte.filter(p => p.stato === 'RIFIUTATA')
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
        return 'In Attesa'
      case 'CONFERMATA':
        return 'Confermata'
      case 'RIFIUTATA':
        return 'Rifiutata'
      default:
        return stato
    }
  }

  const handleAccetta = async (id) => {
    try {
      await api.accettaPrenotazione(id)
      onShowSuccess('Prenotazione accettata con successo!')
      await loadPrenotazioni()
    } catch (err) {
      setError('Errore nell\'accettazione della prenotazione')
      console.error(err)
    }
  }

  const handleRifiuta = async (id) => {
    if (!window.confirm('Sei sicuro di voler rifiutare questa prenotazione?')) {
      return
    }
    try {
      await api.rifiutaPrenotazione(id)
      onShowSuccess('Prenotazione rifiutata')
      await loadPrenotazioni()
    } catch (err) {
      setError('Errore nel rifiuto della prenotazione')
      console.error(err)
    }
  }

  // Il pulsante di eliminazione è stato rimosso per evitare cancellazioni accidentali

  const handleLogout = () => {
    if (window.confirm('Sei sicuro di voler effettuare il logout?')) {
      logout()
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Benvenuto, Dr. {user.nome}!</h1>
          <p className="subtitle">Area personale medico - {user.reparto}</p>
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
            <h2>Prenotazioni Pazienti</h2>
          </div>

          {/* Tabs per In Attesa / Tutte */}
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

          {loading ? (
            <p className="loading">Caricamento prenotazioni...</p>
          ) : activeTab === 'attesa' && prenotazioniInAttesa.length === 0 ? (
            <p className="empty-state">Non hai prenotazioni in attesa di conferma</p>
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
                      <h3>Prenotazione #{prenotazione.id}</h3>
                      <span className={`status-badge ${getStatoBadgeClass(prenotazione.stato)}`}>
                        {getStatoLabel(prenotazione.stato)}
                      </span>
                    </div>
                    <div className="prenotazione-details">
                      <p><strong>Paziente:</strong> {prenotazione.paziente.nome} {prenotazione.paziente.cognome}</p>
                      <p><strong>Email paziente:</strong> {prenotazione.paziente.email}</p>
                      <p><strong>Telefono paziente:</strong> {prenotazione.paziente.numeroTelefono || 'N/A'}</p>
                      <p><strong>Data e Ora:</strong> {formatDataOra(prenotazione.dataOra)}</p>
                    </div>
                    {prenotazione.stato === 'IN_ATTESA' && (
                      <div className="prenotazione-actions">
                        <button
                          className="button button-success"
                          onClick={() => handleAccetta(prenotazione.id)}
                        >
                          ✓ Accetta
                        </button>
                        <button
                          className="button button-danger"
                          onClick={() => handleRifiuta(prenotazione.id)}
                        >
                          ✗ Rifiuta
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Pulsante elimina rimosso per evitare cancellazioni */}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sezione Profilo */}
        <div className="dashboard-section profile-section">
          <h2>Dati Personali</h2>
          <div className="profile-info">
            <p><strong>Nome:</strong> Dr. {user.nome} {user.cognome}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Reparto:</strong> {user.reparto}</p>
            <p><strong>Telefono:</strong> {user.numeroTelefono}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

