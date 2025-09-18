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

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
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
