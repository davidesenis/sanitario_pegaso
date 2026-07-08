import { useState, useContext } from 'react'
import { AuthContext } from './AuthContext'

export default function RegisterForm({ onSuccess, onBackToLogin }) {
  const { register } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    numeroTelefono: '',
    password: ''
  })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [emailDuplicata, setEmailDuplicata] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setEmailDuplicata(false)
    setLoading(true)

    try {
      // Validazione
      if (!formData.nome || !formData.cognome || !formData.email ||
          !formData.numeroTelefono || !formData.password) {
        setError('Tutti i campi sono obbligatori')
        setLoading(false)
        return
      }

      if (formData.password !== confirmPassword) {
        setError('Le password non coincidono')
        setLoading(false)
        return
      }

      if (formData.password.length < 6) {
        setError('La password deve contenere almeno 6 caratteri')
        setLoading(false)
        return
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        setError('Email non valida')
        setLoading(false)
        return
      }

      // Registrazione
      await register(formData)
      onSuccess('Registrazione completata! Account creato con successo. Ora effettua il login per accedere all\'area riservata.')
    } catch (err) {
      if (err.message.includes('Email già registrata')) {
        setEmailDuplicata(true)
      } else {
        setError(err.message || 'Errore durante la registrazione')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Registrazione</h2>
      <p className="form-subtitle">Crea il tuo account</p>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="nome">Nome *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Nome"
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
            placeholder="Cognome"
            required
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="tua.email@example.com"
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
          placeholder="3331234567"
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Almeno 6 caratteri"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Conferma Password *</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ripeti la password"
            required
          />
        </div>
      </div>

      {emailDuplicata && (
        <div className="error-message">
          Questa email è già registrata.{' '}
          <button type="button" className="link-button" onClick={onBackToLogin}>
            Accedi al tuo account
          </button>
        </div>
      )}
      {error && <div className="error-message">{error}</div>}

      <button
        type="submit"
        className="button button-full"
        disabled={loading}
      >
        {loading ? 'Registrazione in corso...' : 'Registrati'}
      </button>

      <div className="form-footer">
        <p>Hai gia un account? <button
          type="button"
          className="link-button"
          onClick={onBackToLogin}
        >
          Torna al login
        </button></p>
      </div>
    </form>
  )
}

