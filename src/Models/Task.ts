export enum TaskStatus {
  Pending = "pending",
  InProgress = "in-progress",
  Completed = "completed",
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  created_at: string;
  updated_at?: string;
  user_id: string;
}
