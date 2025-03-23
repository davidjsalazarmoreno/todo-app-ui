"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { getTasks } from "../Services/taskService"
import { type Task, TaskStatus } from "../Models/Task"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import { Link, useNavigate } from "react-router"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Clock,
  Loader2,
  PieChartIcon,
  RefreshCw,
  TrendingUp,
  Calendar,
  LogOut,
} from "lucide-react"
import { Legend } from "recharts"

const TaskChart: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate() // Initialize useNavigate

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

  // Data for status distribution
  const statusData = [
    { name: "Pending", value: tasks.filter((task) => task.status === TaskStatus.Pending).length, color: "#FFBB28" },
    {
      name: "In Progress",
      value: tasks.filter((task) => task.status === TaskStatus.InProgress).length,
      color: "#0088FE",
    },
    { name: "Completed", value: tasks.filter((task) => task.status === TaskStatus.Completed).length, color: "#00C49F" },
  ]

  // Generate weekly data based on actual task data
  const getWeeklyData = () => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.

    // Initialize data structure for the week
    const weekData = days.map((day) => ({
      name: day,
      Completed: 0,
      "In Progress": 0,
      Pending: 0,
      total: 0,
    }))

    // Get the date for the start of the current week (Sunday)
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - dayOfWeek)
    startOfWeek.setHours(0, 0, 0, 0)

    // Process each task
    tasks.forEach((task) => {
      // Use updated_at if available, otherwise fall back to created_at
      const taskDate = task.updated_at ? new Date(task.updated_at) : new Date(task.created_at)

      // Only include tasks from the current week
      if (taskDate >= startOfWeek) {
        const taskDay = taskDate.getDay() // 0-6

        // Increment the appropriate status counter
        if (task.status === TaskStatus.Completed) {
          weekData[taskDay].Completed += 1
        } else if (task.status === TaskStatus.InProgress) {
          weekData[taskDay]["In Progress"] += 1
        } else if (task.status === TaskStatus.Pending) {
          weekData[taskDay].Pending += 1
        }

        weekData[taskDay].total += 1
      }
    })

    return weekData
  }

  const weeklyData = getWeeklyData()

  // Calculate total tasks and completion rate
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === TaskStatus.Completed).length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-md">
          {label && <p className="font-medium">{`${label}`}</p>}
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color || entry.fill }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <BarChart3 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Task Analytics</h1>
        </div>
        <div className="flex gap-2">
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
                Refresh Data
              </>
            )}
          </Button>
          <Link to="/tasks">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tasks
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            onClick={() => {
              console.log("Logging out...")
              localStorage.removeItem('token')
              navigate('/') 
            }}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-80">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <span className="ml-3 text-xl">Loading analytics...</span>
        </div>
      ) : tasks.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="pt-12">
            <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-2xl font-medium text-muted-foreground mb-2">No task data available</h3>
            <p className="text-muted-foreground mb-6">Create some tasks to see analytics</p>
            <Link to="/tasks">
              <Button>Go to Task Manager</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Tasks</CardDescription>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-3xl">{totalTasks}</CardTitle>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Completion Rate</CardDescription>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-3xl">{completionRate}%</CardTitle>
                  <div className="p-2 bg-green-100 rounded-full">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Pending Tasks</CardDescription>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-3xl">{statusData[0].value}</CardTitle>
                  <div className="p-2 bg-yellow-100 rounded-full">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Completed Tasks</CardDescription>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-3xl">{statusData[2].value}</CardTitle>
                  <div className="p-2 bg-green-100 rounded-full">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="weekly" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Weekly Trends
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                {statusData.map((status, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="flex items-center gap-1"
                    style={{
                      backgroundColor: `${status.color}20`,
                      borderColor: status.color,
                      color: status.color,
                    }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: status.color }}></span>
                    {status.name}: {status.value}
                  </Badge>
                ))}
              </div>
            </div>

            <TabsContent value="overview" className="mt-0">
              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="h-5 w-5" />
                      Task Status Distribution
                    </CardTitle>
                    <CardDescription>Overview of your tasks by status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px] w-full flex justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            innerRadius={60}
                            paddingAngle={5}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Task Status Comparison
                    </CardTitle>
                    <CardDescription>Compare the number of tasks in each status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={statusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="value" name="Tasks">
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="weekly" className="mt-0">
              <div className="grid gap-6 grid-cols-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Weekly Task Trends
                    </CardTitle>
                    <CardDescription>Task status distribution throughout the week</CardDescription>
                    <div className="text-sm text-muted-foreground mt-1">
                      Based on task creation and update timestamps
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="Completed"
                            stackId="1"
                            stroke="#00C49F"
                            fill="#00C49F"
                            name="Completed Tasks"
                          />
                          <Area
                            type="monotone"
                            dataKey="In Progress"
                            stackId="1"
                            stroke="#0088FE"
                            fill="#0088FE"
                            name="In Progress Tasks"
                          />
                          <Area
                            type="monotone"
                            dataKey="Pending"
                            stackId="1"
                            stroke="#FFBB28"
                            fill="#FFBB28"
                            name="Pending Tasks"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Daily Task Activity
                    </CardTitle>
                    <CardDescription>Number of tasks created or updated each day</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend />
                          <Bar dataKey="total" name="Total Activity" fill="#9333ea" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

export default TaskChart

