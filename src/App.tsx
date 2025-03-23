import React from 'react'
import { Routes, Route } from 'react-router'
import TaskList from './Pages/TaskList'
import TaskChart from './Pages/TaskChart'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<TaskList />} />
      <Route path="/chart" element={<TaskChart />} />
    </Routes>
  )
}

export default App
