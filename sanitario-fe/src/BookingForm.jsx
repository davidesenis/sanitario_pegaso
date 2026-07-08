import { useState, useEffect } from 'react'
import { getMedici, createPaziente, createPrenotazione } from './api'

export default function BookingForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    numeroTelefono: '',
    reparto: '',
    dataOra: ''
  })

  const [medici, setMedici] = useState([])
  const [reparti, setReparti] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Carica i medici per ottenere i reparti unici
  useEffect(() => {
    const loadMedici = async () => {
      try {
        const response = await getMedici()
        setMedici(response)

        // Estrai i reparti unici
        const repartiUnici = [...new Set(response.map(m => m.reparto))].sort()
        setReparti(repartiUnici)
      } catch (err) {
        setError('Errore nel caricamento dei reparti')
        console.error(err)
      }
    }
    loadMedici()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  // Filtra gli orari disponibili (lunedì-venerdì, 9:00-18:00)
  const isValidDateTime = (dateTime) => {
    const date = new Date(dateTime)
    const dayOfWeek = date.getDay()
    const hour = date.getHours()

    // 0 = domenica, 1-5 = lunedì-venerdì, 6 = sabato
    return dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= 9 && hour < 18
  }

  const getMinDateTime = () => {
    const now = new Date()

    // Se è già venerdì sera o weekend, sposta a lunedì mattina
    const dayOfWeek = now.getDay()

    if (dayOfWeek === 0) { // domenica
      now.setDate(now.getDate() + 1) // lunedì
    } else if (dayOfWeek === 6) { // sabato
      now.setDate(now.getDate() + 2) // lunedì
    }

    // Imposta l'ora a 09:00 se è prima delle 9
    if (now.getHours() < 9) {
      now.setHours(9, 0, 0, 0)
    } else if (now.getHours() >= 18) {
      // Se è dopo le 18, sposta al giorno dopo alle 9
      now.setDate(now.getDate() + 1)
      now.setHours(9, 0, 0, 0)
    }

    return now.toISOString().slice(0, 16)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validazione
      if (!formData.nome || !formData.cognome || !formData.email ||
          !formData.numeroTelefono || !formData.reparto || !formData.dataOra) {
        setError('Tutti i campi sono obbligatori')
        setLoading(false)
        return
      }

      if (!isValidDateTime(formData.dataOra)) {
        setError('La prenotazione è disponibile solo da lunedì a venerdì, dalle 9:00 alle 18:00')
        setLoading(false)
        return
      }

      // 1. Crea il paziente
      const paziente = await createPaziente({
        nome: formData.nome,
        cognome: formData.cognome,
        email: formData.email,
        numeroTelefono: formData.numeroTelefono
      })

      // 2. Trova il medico con il reparto selezionato
      const medicoSelezionato = medici.find(m => m.reparto === formData.reparto)
      if (!medicoSelezionato) {
        setError('Medico non trovato per il reparto selezionato')
        setLoading(false)
        return
      }

      // 3. Crea la prenotazione
      const prenotazione = await createPrenotazione({
        pazienteId: paziente.id,
        medicoId: medicoSelezionato.id,
        dataOra: formData.dataOra
      })

      // Reset del form
      setFormData({
        nome: '',
        cognome: '',
        email: '',
        numeroTelefono: '',
        reparto: '',
        dataOra: ''
      })

      // Mostra il messaggio di successo
      onSuccess(`Prenotazione confermata per ${formData.nome} ${formData.cognome}`)
    } catch (err) {
      if (err.message.includes('409') || err.message.includes('duplicate')) {
        setError('Email già registrata nel sistema')
      } else {
        setError(err.message || 'Errore durante la prenotazione')
      }
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="nome">Nome *</label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Inserisci il nome"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="cognome">Cognome *</label>
        <input
          type="text"
          id="cognome"
          name="cognome"
          value={formData.cognome}
          onChange={handleChange}
          placeholder="Inserisci il cognome"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Inserisci l'email"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="numeroTelefono">Numero di Telefono *</label>
        <input
          type="tel"
          id="numeroTelefono"
          name="numeroTelefono"
          value={formData.numeroTelefono}
          onChange={handleChange}
          placeholder="Inserisci il numero di telefono"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="reparto">Tipo di Visita (Reparto) *</label>
        <select
          id="reparto"
          name="reparto"
          value={formData.reparto}
          onChange={handleChange}
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
        <label htmlFor="dataOra">Data e Ora della Visita *</label>
        <p className="form-hint">(Disponibile: lunedì - venerdì, 9:00 - 18:00)</p>
        <input
          type="datetime-local"
          id="dataOra"
          name="dataOra"
          value={formData.dataOra}
          onChange={handleChange}
          min={getMinDateTime()}
          required
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button
        type="submit"
        className="button button-submit"
        disabled={loading}
      >
        {loading ? 'Processamento in corso...' : 'Conferma Prenotazione'}
      </button>
    </form>
  )
}

