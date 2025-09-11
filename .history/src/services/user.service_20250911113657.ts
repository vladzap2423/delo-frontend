import { useAuthStore } from "@/store/auth";

export async function getAllUsers() {
  const { token } = useAuthStore.getState();

  if (!token) {
    throw new Error("Не авторизован");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Ошибка при получении пользователей");
  }

  return res.json();
}
