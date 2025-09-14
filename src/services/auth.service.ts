export async function loginApi(username: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    let message = "Ошибка авторизации";

    try {
      const data = await res.json();
      if (data?.message) {
        message = data.message;
      }
    } catch (e) {
      console.error("Ошибка парсинга ответа", e);
    }

    throw new Error(message);
  }

  return res.json();
}
