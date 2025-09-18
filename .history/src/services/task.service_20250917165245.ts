import { authorizedFetch } from "./api";

export interface CreateTaskDto {
  title: string;
  creatorId: number;
  commissionId: number;
  file?: File;
  signSchema?: {
    userId: number;
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
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
  signs: {
    id: number;
    isSigned: boolean;
    user: {
      id: number;
      fio: string;
      post: string;
    };
  }[];
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
  if (data.signSchema) {
    formData.append("signSchema", JSON.stringify(data.signSchema));
  }

  return authorizedFetch<Task>("/tasks", {
    method: "POST",
    body: formData,
  });
}

export async function getAllTasks(): Promise<Task[]> {
  return authorizedFetch<Task[]>("/tasks", { method: "GET" });
}
