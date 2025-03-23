import { Task, TaskStatus } from "../Models/Task";

let tasks: Task[] = [
  {
    id: "1",
    title: "Sample Task 1",
    description: "This is a sample task",
    status: TaskStatus.Pending,
    created_at: new Date().toISOString(),
    user_id: "user1",
  },
  // ...more mock tasks...
];

export const getTasks = async (): Promise<Task[]> => {
  return tasks;
};

export const addTask = async (task: Omit<Task, "id" | "created_at">): Promise<Task> => {
  const newTask: Task = {
    ...task,
    id: String(tasks.length + 1),
    created_at: new Date().toISOString(),
  };
  tasks.push(newTask);
  return newTask;
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task | null> => {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) return null;
  tasks[taskIndex] = { ...tasks[taskIndex], ...updates, updated_at: new Date().toISOString() };
  return tasks[taskIndex];
};

export const deleteTask = async (id: string): Promise<boolean> => {
  const initialLength = tasks.length;
  tasks = tasks.filter((task) => task.id !== id);
  return tasks.length < initialLength;
};
