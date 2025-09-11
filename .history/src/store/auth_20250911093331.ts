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
  гыук
  login: (token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      login: (token) => set({ token }),
      logout: () => set({ token: null }),
    }),
    { name: 'auth-storage-SIGned' }
  )
);
