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
    <div className="font-sans grid grid-rows-[60px_1fr] border">
      
      <h1 className="text-2xl font-bold">Главная страница</h1>
      
    </div>
  );
}
