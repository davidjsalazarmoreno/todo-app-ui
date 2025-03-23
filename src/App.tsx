import React from 'react'
import { Routes, Route } from 'react-router'
import TaskList from './Pages/TaskList'
import TaskChart from './Pages/TaskChart'
import Login from './Pages/Login'
import AuthGuard from './components/AuthGuard'
import NotFound from './Pages/NotFound' 

const App: React.FC = () => {
  return (
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
  )
}

export default App
