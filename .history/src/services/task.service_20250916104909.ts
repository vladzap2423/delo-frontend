import { useAuthStore } from "@/store/auth";

export interface CreateTaskDto {
  title: string;
  creatorId: number; // лучше number, а не string
  commissionId: number;
  file?: File;
   signSchema?: {    // 👈 добавляем
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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Хелпер для запросов с токеном
 */
async function authorizedFetch(
  url: string,
  options: RequestInit = {}
): Promise<any> {
  const { token } = useAuthStore.getState();
  if (!token) throw new Error("Не авторизован");

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    ...(options.headers as Record<string, string>),
  };

  // Не ставим Content-Type, если передаём FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let message = `Ошибка: ${res.status}`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}

/**
 * Создать задачу
 */
export async function createTask(data: CreateTaskDto): Promise<Task> {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("creatorId", String(data.creatorId));
  formData.append("commissionId", String(data.commissionId));

  if (data.file) {
    formData.append("file", data.file);
  }
  console.log("Data: ", formData)
  return authorizedFetch("/tasks", {
    method: "POST",
    body: formData,
  });
}

export async function getAllTasks(): Promise<Task[]> {
  return authorizedFetch("/tasks", { method: "GET" });
}
