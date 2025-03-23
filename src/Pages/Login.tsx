import React, { useState } from 'react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { login } from '../Services/authService'
import { useNavigate } from 'react-router'

const Login: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate() // Initialize useNavigate

  const handleLogin = async () => {
    setError(null)
    try {
      const data = await login(username, password)
      console.log('Login successful:', data)
      console.log('Token:', data.token)
      localStorage.setItem('token', data.token)
      navigate('/tasks') // Redirect to tasks page
    } catch (e) {
      console.log(e)
      setError('Invalid username or password')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <div className="flex flex-col gap-4 w-1/3">
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <Button onClick={handleLogin}>Login</Button>
      </div>
    </div>
  )
}

export default Login
