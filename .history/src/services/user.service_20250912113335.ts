import { useAuthStore } from "@/store/auth";

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
    throw new Error(`Ошибка: ${res.status}`);
  }

  return res.json();
}

// Получить список всех пользователей
export async function getAllUsers() {
  return authorizedFetch("/users", { method: "GET" });
}

// Изменить статус пользователя (isActive)
export async function updateUserStatus(id: number, isActive: boolean) {
  return authorizedFetch(`/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
}

// Изменить роль пользователя
export async function updateUserRole(id: number, role: string) {
  return authorizedFetch(`/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}

// Изменить пароль пользователя
export async function updateUserPassword(id: number, newPassword: string) {
  return authorizedFetch(`/users/${id}/password`, {
    method: "PATCH",
    body: JSON.stringify({ newPassword }),
  });
}

export async function
