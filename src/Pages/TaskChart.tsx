import React, { useEffect, useState } from "react";
import { getTasks } from "../Services/taskService";
import { Task, TaskStatus } from "../Models/Task";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Link } from "react-router";

const TaskChart: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  const data = [
    { name: "Pending", value: tasks.filter((task) => task.status === TaskStatus.Pending).length },
    { name: "In Progress", value: tasks.filter((task) => task.status === TaskStatus.InProgress).length },
    { name: "Completed", value: tasks.filter((task) => task.status === TaskStatus.Completed).length },
  ];

  const COLORS = ["#FFBB28", "#FF8042", "#0088FE"];

  return (
    <div>
      <h1>Task Chart</h1>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      <Link to="/tasks" className="text-blue-500 underline">
        Go to Tasks
      </Link>
    </div>
  );
};

export default TaskChart;
