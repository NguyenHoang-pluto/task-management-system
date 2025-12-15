export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Task {
  id: number;
  title: string;
  assignee: string;
  status: TaskStatus;
  priority: "LOW" | "MEDIUM" | "HIGH";
  teamId: number; 
}
