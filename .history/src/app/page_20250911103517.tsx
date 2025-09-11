"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { LogOut } from "lucide-react"; 


export default function Home() {
  const router = useRouter();
  const { user, token, logout } = useAuthStore();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  if (!user) return null;

  return (
    <div className="font-sans grid grid-rows-[60px_1fr] min-h-screen">
      {/* Шапка */}
      <header className="flex items-center justify-between w-full px-6 py-3 bg-emerald-800 text-white shadow-md">
        <span className="font-semibold">Добро пожаловать, {user.username}</span>
        <button
          onClick={logout}
          className="p-2 rounded-full hover:bg-emerald-700 transition"
          title="Выйти"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Контент */}
      <main className="flex items-center justify-center p-8">
        <h1 className="text-2xl font-bold">Главная страница</h1>
      </main>
    </div>
  );
}
