import { createContext, useState, useEffect } from 'react'
import * as api from './api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userType, setUserType] = useState(null) // 'paziente' o 'medico'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Carica l'utente dal localStorage al mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedUserType = localStorage.getItem('userType')
    if (storedUser && storedUserType) {
      try {
        setUser(JSON.parse(storedUser))
        setUserType(storedUserType)
      } catch (err) {
        localStorage.removeItem('user')
        localStorage.removeItem('userType')
      }
    }
    setLoading(false)
  }, [])

  const register = async (userData) => {
    setError('')
    try {
      const response = await api.register(userData)
      return response
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const login = async (email, password, type = 'paziente') => {
    setError('')
    try {
      let response
      if (type === 'medico') {
        response = await api.loginMedico(email, password)
      } else {
        response = await api.login(email, password)
      }
      const userWithId = { ...response, id: response.id }
      setUser(userWithId)
      setUserType(type)
      localStorage.setItem('user', JSON.stringify(userWithId))
      localStorage.setItem('userType', type)
      return response
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const logout = () => {
    setUser(null)
    setUserType(null)
    localStorage.removeItem('user')
    localStorage.removeItem('userType')
    setError('')
  }

  const value = {
    user,
    userType,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

