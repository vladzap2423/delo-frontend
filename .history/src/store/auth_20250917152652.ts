import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

type UserPayload = {
  sub: number;
  username: string;
  fio: string;
  role: string;
  iat: number;
  exp: number;
};

type AuthState = {
  token: string | null;
  user: UserPayload | null;
  hydrated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      hydrated: false,
      login: (token) => {
        try {
          const user = jwtDecode<UserPayload>(token);

          // сохраняем в Zustand
          set({ token, user });

          // дублируем токен в cookie (middleware будет читать его)
          Cookies.set("token", token, {
            secure: true,
            sameSite: "strict",
            expires: 1, // 1 день (можно настроить под срок жизни JWT)
          });
        } catch (e) {
          console.error("Ошибка при декодировании JWT", e);
          set({ token: null, user: null });
          Cookies.remove("token");
        }
      },
      logout: () => {
        set({ token: null, user: null });
        Cookies.remove("token");
      },
    }),
    {
      name: 'auth-storage-SIGned',
      onRehydrateStorage: () => (state) => {
        setTimeout(() => state && (state.hydrated = true));
      },
    }
  )
);
