import { useState, useContext, useEffect } from 'react'
import './styles.css'
import { AuthProvider, AuthContext } from './AuthContext'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import Dashboard from './Dashboard'
import DoctorDashboard from './DoctorDashboard'
import SuccessModal from './SuccessModal'

function AppContent() {
  const { user, userType, loading, isAuthenticated } = useContext(AuthContext)
  const [currentPage, setCurrentPage] = useState('login') // 'login', 'register', 'dashboard'
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [nextPageAfterModal, setNextPageAfterModal] = useState(null)

  const handleShowSuccess = (message, nextPage = null) => {
    setSuccessMessage(message)
    setNextPageAfterModal(nextPage)
    setShowSuccess(true)
  }

  const handleRegisterSuccess = (message) => {
    handleShowSuccess(message, 'login')
  }

  const handleCloseModal = () => {
    setShowSuccess(false)
    if (nextPageAfterModal) {
      setCurrentPage(nextPageAfterModal)
      setNextPageAfterModal(null)
      return
    }

    if (isAuthenticated) {
      setCurrentPage('dashboard')
    }
  }

  // Reindirizza automaticamente alla dashboard se l'utente è loggato
  useEffect(() => {
    if (isAuthenticated) {
      setCurrentPage('dashboard')
    } else {
      setCurrentPage('login')
    }
  }, [isAuthenticated])

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <p className="loading">Caricamento...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated && currentPage === 'dashboard') {
    return (
      <div className="dashboard-container">
        {userType === 'medico' ? (
          <DoctorDashboard onShowSuccess={handleShowSuccess} />
        ) : (
          <Dashboard onShowSuccess={handleShowSuccess} />
        )}
        {showSuccess && (
          <SuccessModal message={successMessage} onClose={handleCloseModal} />
        )}
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card card-auth">
        <div className="auth-header">
          <h1>PPS</h1>
          <p className="auth-subtitle">Portale Prenotazioni Sanitarie</p>
        </div>

        {currentPage === 'login' && (
          <LoginForm
            onSuccess={handleShowSuccess}
            onSwitchToRegister={() => setCurrentPage('register')}
          />
        )}

        {currentPage === 'register' && (
          <RegisterForm
            onSuccess={handleRegisterSuccess}
            onBackToLogin={() => setCurrentPage('login')}
          />
        )}

        {showSuccess && (
          <SuccessModal 
            message={successMessage} 
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

