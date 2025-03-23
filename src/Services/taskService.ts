import axios from "axios";
import { Task } from "../Models/Task";

const API_BASE_URL =
  `${import.meta.env.VITE_REACT_APP_API_PREFIX}/api/v1/tasks`;

const getAuthToken = () => localStorage.getItem("token");

export const getTasks = async (): Promise<Task[]> => {
  const token = getAuthToken();
  const response = await axios.get(API_BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addTask = async (task: Partial<Task>): Promise<Task> => {
  const token = getAuthToken();
  const response = await axios.post(API_BASE_URL, task, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateTask = async (
  taskId: string,
  updates: Partial<Task>,
): Promise<Task> => {
  const token = getAuthToken();
  const response = await axios.put(`${API_BASE_URL}/${taskId}`, updates, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteTask = async (taskId: string): Promise<void> => {
  const token = getAuthToken();
  await axios.delete(`${API_BASE_URL}/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
