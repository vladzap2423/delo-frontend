import { useAuthStore } from "@/store/auth";

export interface CreateTaskDto {
    title: string;
    creatorId: string;
    commissionId: number;
    file?: File;
}

export interface Task {
    id: number;
    title: string;
    filePath: string | null;
    status: 'in_progress' | 'completed';
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

async function authorizedFetch(url: string, options: RequestInit = {}) {
  const { token } = useAuthStore.getState();
  if (!token) throw new Error("Не авторизован");

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  };

if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createTask(data: CreateTaskDto): Promise<Task> {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('creatorId', String(data.creatorId));
    formData.append('commissionId', String(data.commissionId));


    if (data.file) {
        formData.append('file', data.file);
    }
    const { token } = useAuthStore.getState();
    const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    });

    if (!res.ok) {
        throw new Error(`Failed to create task: ${res.statusText}`);
    }

    return res.json();
}
