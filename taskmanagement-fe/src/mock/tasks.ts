import type { Task } from "../types/task";

export const tasks: Task[] = [
  {
    id: 1,
    title: "Fix API login",
    assignee: "Nam",
    status: "IN_PROGRESS",
    priority: "HIGH",
    teamId: 1,
  },
  {
    id: 2,
    title: "Optimize DB",
    assignee: "An",
    status: "DONE",
    priority: "MEDIUM",
    teamId: 1,
  },
  {
    id: 3,
    title: "Build UI",
    assignee: "Minh",
    status: "TODO",
    priority: "LOW",
    teamId: 2,
  },
  {
    id: 4,
    title: "Test app",
    assignee: "Lan",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    teamId: 2,
  },
  {
    id: 5,
    title: "Release mobile",
    assignee: "Huy",
    status: "TODO",
    priority: "HIGH",
    teamId: 3,
  },
];
