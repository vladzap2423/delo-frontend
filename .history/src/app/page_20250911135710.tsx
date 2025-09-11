"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { LogOut } from "lucide-react"; 


export default function Home() {
  const router = useRouter();
  const { hydrated, user, token, logout } = useAuthStore();

  useEffect(() => {
    if (!hydrated) return;
    
    if (!token) {
      router.push("/login");
    }
  }, [hydrated, token, router]);

  // пока zustand не загрузился → показываем "Загрузка..."
  if (!hydrated) {
    return <div className="flex items-center justify-center h-screen">Загрузка...</div>;
  }

  if (!token || !user) return null;

  return (
    <div className="font-sans min-h-screen border p-6">
      <div className="grid grid-cols-3 gap-6">
        {/* Левая колонка (2/3 ширины) */}
        <div className="col-span-2 bg-white rounded-lg shadow p-4">
          <h1 className="text-xl font-bold mb-4">В работе:</h1>
          {/* сюда добавишь контент */}
        </div>

        {/* Правая колонка (1/3 ширины) */}
        <div className="col-span-1 bg-white rounded-lg shadow p-4">
          <h1 className="text-xl font-bold mb-4">Отработано:</h1>
          {/* сюда добавишь контент */}
        </div>
      </div>
    </div>
  );
}
