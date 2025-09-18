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
  init: () => void;
  login: (token: string) => void;
  logout: () => void;
};

// хелпер
function getUserFromCookie(): UserPayload | null {
  const token = Cookies.get("token");
  if (!token) return null;

  try {
    const user = jwtDecode<UserPayload>(token);

    // проверяем exp
    if (user.exp * 1000 < Date.now()) {
      return null;
    }

    return user;
  } catch (e) {
    console.error("Ошибка при декодировании JWT:", e);
    Cookies.remove("token");
    return null;
  }
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  hydrated: false,

  init: () => {
    const user = getUserFromCookie();
    set({ user, hydrated: true });
  },

  login: (token) => {
    try {
      const user = jwtDecode<UserPayload>(token);
      set({ user });

      Cookies.set("token", token, {
        secure: true,
        sameSite: "strict",
        expires: 1, // 1 день
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
}));
