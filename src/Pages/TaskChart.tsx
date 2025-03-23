import React, { useEffect, useState } from "react";
import { getTasks } from "../Services/taskService";
import { Task } from "../Models/Task";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

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
    { name: "Pending", value: tasks.filter((task) => task.status === "pending").length },
    { name: "In Progress", value: tasks.filter((task) => task.status === "in-progress").length },
    { name: "Completed", value: tasks.filter((task) => task.status === "completed").length },
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
    </div>
  );
};

export default TaskChart;
