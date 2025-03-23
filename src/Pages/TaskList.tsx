import React, { useEffect, useState } from 'react'

import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} from '../Services/taskService'
import { Task, TaskStatus } from '../Models/Task'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Link } from 'react-router'

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: TaskStatus.Pending,
  })
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const data = await getTasks()
      setTasks(data)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async () => {
    if (!newTask.title) return
    setActionLoading('add')
    try {
      await addTask({ ...newTask, user_id: 'user1' })
      setNewTask({ title: '', description: '', status: TaskStatus.Pending })
      fetchTasks()
    } finally {
      setActionLoading(null)
    }
  }

  const handleUpdateTask = async (id: string, status: TaskStatus) => {
    setActionLoading(id)
    try {
      await updateTask(id, { status })
      fetchTasks()
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteTask = async (id: string) => {
    setActionLoading(id)
    try {
      await deleteTask(id)
      fetchTasks()
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Task List</h1>
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <>
          <div className="flex gap-4 my-4">
            <Input
              placeholder="Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <Input
              placeholder="Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
            />
            <Select
              value={newTask.status}
              onValueChange={(value) =>
                setNewTask({ ...newTask, status: value as TaskStatus })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TaskStatus.Pending}>Pending</SelectItem>
                <SelectItem value={TaskStatus.InProgress}>In Progress</SelectItem>
                <SelectItem value={TaskStatus.Completed}>Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddTask} disabled={actionLoading === 'add'}>
              {actionLoading === 'add' ? 'Adding...' : 'Add Task'}
            </Button>
          </div>
          <div className="grid gap-4">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <h2 className="text-xl font-semibold">{task.title}</h2>
                </CardHeader>
                <CardContent>
                  <p>{task.description}</p>
                  <p>Status: {task.status}</p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      onClick={() =>
                        handleUpdateTask(task.id, TaskStatus.InProgress)
                      }
                      disabled={actionLoading === task.id}
                    >
                      {actionLoading === task.id && task.status === TaskStatus.InProgress
                        ? 'Updating...'
                        : 'In Progress'}
                    </Button>
                    <Button
                      onClick={() =>
                        handleUpdateTask(task.id, TaskStatus.Completed)
                      }
                      disabled={actionLoading === task.id}
                    >
                      {actionLoading === task.id && task.status === TaskStatus.Completed
                        ? 'Updating...'
                        : 'Complete'}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteTask(task.id)}
                      disabled={actionLoading === task.id}
                    >
                      {actionLoading === task.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
      <Link to="/chart" className="text-blue-500 underline">
        Go to Charts
      </Link>
    </div>
  )
}

export default TaskList
