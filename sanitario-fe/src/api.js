const API_BASE = '/api'

// Auth endpoints
export const register = async (userData) => {
  const response = await fetch(`${API_BASE}/pazienti`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error('Email già registrata nel sistema')
    }
    throw new Error(`Errore nella registrazione: ${response.status}`)
  }
  return await response.json()
}

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE}/pazienti/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Email o password non valide')
    }
    throw new Error(`Errore nel login: ${response.status}`)
  }
  return await response.json()
}

export const loginMedico = async (email, password) => {
  const response = await fetch(`${API_BASE}/medici/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Email o password non valide')
    }
    throw new Error(`Errore nel login: ${response.status}`)
  }
  return await response.json()
}

// Medici endpoints
export const getMedici = async () => {
  const response = await fetch(`${API_BASE}/medici`)
  if (!response.ok) {
    throw new Error(`Errore nel caricamento dei medici: ${response.status}`)
  }
  return await response.json()
}

// Pazienti endpoints
export const getPazienteById = async (id) => {
  const response = await fetch(`${API_BASE}/pazienti/${id}`)
  if (!response.ok) {
    throw new Error(`Errore nel caricamento del paziente: ${response.status}`)
  }
  return await response.json()
}

// Prenotazioni endpoints
export const createPrenotazione = async (prenotazioneData) => {
  const prenotazione = {
    paziente: { id: prenotazioneData.pazienteId },
    medico: { id: prenotazioneData.medicoId },
    dataOra: prenotazioneData.dataOra
  }

  const response = await fetch(`${API_BASE}/prenotazioni`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(prenotazione)
  })

  if (!response.ok) {
    if (response.status === 409) {
      const message = await response.text()
      throw new Error(message || 'Slot non disponibile per il medico selezionato')
    }
    throw new Error(`Errore nella creazione della prenotazione: ${response.status}`)
  }
  return await response.json()
}

export const getOccupiedSlots = async (medicoId, data) => {
  const response = await fetch(`${API_BASE}/prenotazioni/medico/${medicoId}/occupati?data=${data}`)
  if (!response.ok) {
    throw new Error(`Errore nel caricamento degli slot occupati: ${response.status}`)
  }
  return await response.json()
}

export const getPrenotazioniByUser = async (userId) => {
  const response = await fetch(`${API_BASE}/prenotazioni/paziente/${userId}`)
  if (!response.ok) {
    throw new Error(`Errore nel caricamento delle prenotazioni: ${response.status}`)
  }
  return await response.json()
}

export const getPrenotazioniByMedico = async (medicoId) => {
  const response = await fetch(`${API_BASE}/prenotazioni/medico/${medicoId}`)
  if (!response.ok) {
    throw new Error(`Errore nel caricamento delle prenotazioni: ${response.status}`)
  }
  return await response.json()
}

export const accettaPrenotazione = async (prenotazioneId) => {
  const response = await fetch(`${API_BASE}/prenotazioni/${prenotazioneId}/accetta`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Errore nell'accettazione della prenotazione: ${response.status}`)
  }
  return await response.json()
}

export const rifiutaPrenotazione = async (prenotazioneId) => {
  const response = await fetch(`${API_BASE}/prenotazioni/${prenotazioneId}/rifiuta`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error(`Errore nel rifiuto della prenotazione: ${response.status}`)
  }
  return await response.json()
}


