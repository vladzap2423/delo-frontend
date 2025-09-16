import { useAuthStore } from "@/store/auth";

export interface Commission {
  id: number;
  name: string;
  users?: {
    id: number;
    fio: string;
    post: string;
    username: string;
  }[];
}

async function authorizedFetch(url: string, options: RequestInit = {}) {
  const { token } = useAuthStore.getState();
  if (!token) throw new Error("Не авторизован");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
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

// Получить все комиссии
export async function getAllCommissions() {
  return authorizedFetch("/commissions", { method: "GET" });
}

// Создать комиссию
export async function createCommission(name: string, userIds: number[]) {
  return authorizedFetch("/commissions", {
    method: "POST",
    body: JSON.stringify({ name, userIds }),
  });
}

// Добавить пользователей в комиссию
export async function addUsersToCommission(commissionId: number, userIds: number[]) {
  return authorizedFetch(`/commissions/${commissionId}/add-users`, {
    method: "POST",
    body: JSON.stringify({ userIds }),
  });
}

// Удалить пользователя из комиссии
export async function removeUserFromCommission(commissionId: number, userId: number) {
  return authorizedFetch(`/commissions/${commissionId}/remove-user`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}
