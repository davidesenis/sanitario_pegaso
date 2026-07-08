import { useState, useContext } from 'react'
import { AuthContext } from './AuthContext'

export default function LoginForm({ onSuccess, onSwitchToRegister }) {
  const { login } = useContext(AuthContext)
  const [userType, setUserType] = useState('paziente') // 'paziente' o 'medico'
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
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
    setLoading(true)

    try {
      // Validazione
      if (!formData.email || !formData.password) {
        setError('Email e password sono obbligatorie')
        setLoading(false)
        return
      }

      // Login
      const user = await login(formData.email, formData.password, userType)
      const displayName = user && (user.nome || user.cognome)
        ? `${user.nome || ''} ${user.cognome || ''}`.trim()
        : (user.email || 'utente')
      onSuccess(`Login completato! Benvenuto ${displayName}!`)
    } catch (err) {
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        setError('Email o password non valide')
      } else {
        setError(err.message || 'Errore durante il login')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Accedi</h2>
      <p className="form-subtitle">Accedi alla tua area personale</p>

      {/* Tabs Paziente/Medico */}
      <div className="auth-tabs">
        <button
          type="button"
          className={`tab-button ${userType === 'paziente' ? 'active' : ''}`}
          onClick={() => {
            setUserType('paziente')
            setError('')
          }}
        >
          👤 Accedi come Paziente
        </button>
        <button
          type="button"
          className={`tab-button ${userType === 'medico' ? 'active' : ''}`}
          onClick={() => {
            setUserType('medico')
            setError('')
          }}
        >
          👨‍⚕️ Accedi come Medico
        </button>
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
        <label htmlFor="password">Password *</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="La tua password"
          required
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button
        type="submit"
        className="button button-full"
        disabled={loading}
      >
        {loading ? 'Accesso in corso...' : 'Accedi'}
      </button>

      {userType === 'paziente' && (
        <div className="form-footer">
          <p>Non hai un account? <button
            type="button"
            className="link-button"
            onClick={onSwitchToRegister}
          >
            Registrati qui
          </button></p>
        </div>
      )}
    </form>
  )
}

