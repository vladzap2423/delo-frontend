import { authorizedFetch } from "./api";

export interface CreateTaskDto {
  title: string;
  creatorId: number;
  commissionId: number;
  file?: File;
  signs: s
}

export interface Task {
  id: number;
  title: string;
  filePath: string | null;
  status: "in_progress" | "completed";
  creator: {
    id: number;
    username: string;
    fio: string;
  };
  commission: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export async function createTask(data: CreateTaskDto): Promise<Task> {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("creatorId", String(data.creatorId));
  formData.append("commissionId", String(data.commissionId));

  if (data.file) {
    formData.append("file", data.file);
  }

  return authorizedFetch<Task>("/tasks", {
    method: "POST",
    body: formData,
  });
}

export async function getAllTasks(): Promise<Task[]> {
  return authorizedFetch<Task[]>("/tasks", { method: "GET" });
}
