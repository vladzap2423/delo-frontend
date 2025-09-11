import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserPayload = {
  id: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
};

type AuthState = {
  token: string | null;
  user: UserPayload | null
  login: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token) => {
        try { 
          const decoded = jwtDecode<UserPayload>(token)
          set({token, user: decoded})
        } catch (e) {
          console.error("Ошибка при декодировании JWT", e)
          set({ token: null,user:})
        }
      }
      logout: () => set({ token: null }),
    }),
    { name: 'auth-storage-SIGned' }
  )
);
