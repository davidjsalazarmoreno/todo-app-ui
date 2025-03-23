import React from 'react'
import { Routes, Route } from 'react-router'
import TaskList from './Pages/TaskList'
import TaskChart from './Pages/TaskChart'
import Login from './Pages/Login'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/tasks" element={<TaskList />} />
      <Route path="/chart" element={<TaskChart />} />
    </Routes>
  )
}

export default App
