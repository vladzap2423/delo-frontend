import { authorizedFetch } from "./api";

export interface User {
  id: number;
  username: string;
  fio: string;
  post: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Добавление нового пользователя
export async function createUser(data: {
  username: string;
  password: string;
  fio: string;
  post: string;
}) {
  return authorizedFetch<User>("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Получить список всех пользователей
export async function getAllUsers() {
  return authorizedFetch<User[]>("/users", { method: "GET" });
}

// Изменить статус пользователя (isActive)
export async function updateUserStatus(id: number, isActive: boolean) {
  return authorizedFetch<User>(`/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
}

// Изменить роль пользователя
export async function updateUserRole(id: number, role: string) {
  return authorizedFetch<User>(`/users/${id}/role`, {
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

// Получить список всех АКТИВНЫХ пользователей
export async function getActiveUsers() {
  return authorizedFetch<User[]>("/users/active", { method: "GET" });
}
