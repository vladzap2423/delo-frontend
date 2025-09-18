import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function authorizedFetch<T = any>(
  url: string,
  options: RequestInit = {}
  caches
): Promise<T> {
  const token = Cookies.get("token");
  if (!token) throw new Error("Не авторизован");

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    ...(options.headers as Record<string, string>),
  };

  // если не FormData → ставим JSON
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
    cache: 'no-store',
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
