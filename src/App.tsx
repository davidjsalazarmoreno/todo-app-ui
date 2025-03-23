import React from 'react'
import { Routes, Route } from 'react-router'
import TaskList from './Pages/TaskList'
import TaskChart from './Pages/TaskChart'
import Login from './Pages/Login'
import AuthGuard from './components/AuthGuard'
import NotFound from './Pages/NotFound'
import { AuthProvider } from './contexts/AuthContext'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/tasks"
          element={
            <AuthGuard>
              <TaskList />
            </AuthGuard>
          }
        />
        <Route
          path="/chart"
          element={
            <AuthGuard>
              <TaskChart />
            </AuthGuard>
          }
        />
        <Route path="*" element={<NotFound />} /> {/* Add 404 route */}
      </Routes>
    </AuthProvider>
  )
}

export default App
