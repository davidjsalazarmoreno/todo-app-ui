'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} from '../Services/taskService'
import { type Task, TaskStatus } from '../Models/Task'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  CheckCircle2,
  Clock,
  Loader2,
  Plus,
  RefreshCw,
  Trash2,
  ClipboardList,
  ArrowRight,
  LogOut,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../contexts/AuthContext'

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: TaskStatus.Pending,
  })
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const navigate = useNavigate() // Initialize useNavigate
  const { logout } = useAuth()

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

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.Pending:
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        )
      case TaskStatus.InProgress:
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            <RefreshCw className="mr-1 h-3 w-3 animate-spin-slow" /> In Progress
          </Badge>
        )
      case TaskStatus.Completed:
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
          </Badge>
        )
      default:
        return null
    }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <ClipboardList className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Task Manager</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTasks}
            disabled={loading}
            className="transition-all duration-300"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Tasks
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            onClick={handleLogout}
            data-testid="log-out"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <Card className="mb-8 border-2 border-primary/10 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Create New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Input
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                className="mb-2"
              />
              <Textarea
                placeholder="Task description"
                value={newTask.description || ''}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                className="min-h-[100px]"
              />
            </div>
            <div className="flex flex-col justify-between">
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
                  <SelectItem value={TaskStatus.InProgress}>
                    In Progress
                  </SelectItem>
                  <SelectItem value={TaskStatus.Completed}>
                    Completed
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddTask}
                disabled={actionLoading === 'add' || !newTask.title}
                className="mt-4 md:self-end transition-all duration-300"
                size="lg"
              >
                {actionLoading === 'add' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">Your Tasks</h2>
      <Separator className="mb-6" />

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading tasks...</span>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-xl font-medium text-muted-foreground">
            No tasks yet
          </h3>
          <p className="text-muted-foreground">
            Create your first task to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className="overflow-hidden transition-all duration-300 hover:shadow-md task"
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl line-clamp-1">
                    {task.title}
                  </CardTitle>
                  {getStatusBadge(task.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-3 min-h-[4.5rem]">
                  {task.description || 'No description provided'}
                </p>
              </CardContent>
              <CardFooter className="flex flex-wrap gap-2 bg-muted/10 pt-4">
                {task.status !== TaskStatus.InProgress && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleUpdateTask(task.id, TaskStatus.InProgress)
                    }
                    disabled={actionLoading === task.id}
                    className="flex-1"
                  >
                    {actionLoading === task.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>Start</>
                    )}
                  </Button>
                )}

                {task.status !== TaskStatus.Completed && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() =>
                      handleUpdateTask(task.id, TaskStatus.Completed)
                    }
                    disabled={actionLoading === task.id}
                    className="flex-1"
                  >
                    {actionLoading === task.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>Complete</>
                    )}
                  </Button>
                )}

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteTask(task.id)}
                  disabled={actionLoading === task.id}
                  className="flex-1"
                  data-testid="trash-2"
                >
                  {actionLoading === task.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          to="/chart"
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
        >
          View Task Analytics
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

export default TaskList
