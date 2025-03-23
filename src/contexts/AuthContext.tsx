import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { login, logout } from '../Services/authService'

interface AuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  const handleLogin = async (username: string, password: string) => {
    const data = await login(username, password)
    localStorage.setItem('token', data.token)
    setIsAuthenticated(true)
    navigate('/tasks')
  }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        await logout(token)
        localStorage.removeItem('token')
        setIsAuthenticated(false)
        navigate('/')
      }
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login: handleLogin, logout: handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
