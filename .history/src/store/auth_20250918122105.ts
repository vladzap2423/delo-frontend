import { jwtDecode } from "jwt-decode";
import { create } from "zustand";
import Cookies from "js-cookie";

type UserPayload = {
  sub: number;
  username: string;
  fio: string;
  role: string;
  iat: number;
  exp: number;
};

type AuthState = {
  user: UserPayload | null;
   hydrated: boolean;
  login: (token: string) => void;
  logout: () => void;
  setHydrated: () => void;
};

// хелпер для восстановления из cookie
function getUserFromCookie(): UserPayload | null {
  const token = Cookies.get("token");
  if (!token) return null;

  try {
    const user = jwtDecode<UserPayload>(token);

    // проверим exp, чтобы не поднимать протухший токен
    if (user.exp * 1000 < Date.now()) {
      Cookies.remove("token");
      return null;
    }

    return user;
  } catch (e) {
    console.error("Ошибка при декодировании JWT из cookie:", e);
    Cookies.remove("token");
    return null;
  }
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: getUserFromCookie(),
  hydrated: false,

  login: (token) => {
    try {
      const user = jwtDecode<UserPayload>(token);
      set({ user });
      Cookies.set("token", token, {
        secure: true,
        sameSite: "strict",
        expires: 1, // срок жизни токена
      });
    } catch (e) {
      console.error("Ошибка при декодировании JWT", e);
      set({ user: null });
      Cookies.remove("token");
    }
  },

  logout: () => {
    set({ user: null });
    Cookies.remove("token");
  },
  setHydrated: () => set({ hydrated: true }),
}));
