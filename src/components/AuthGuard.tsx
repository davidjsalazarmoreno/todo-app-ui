import React from 'react'
import { Navigate } from 'react-router'

interface AuthGuardProps {
  children: React.ReactNode
}

const isAuthenticated = () => {
  return !!localStorage.getItem('token') // Example check for authentication
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/" />
}

export default AuthGuard
