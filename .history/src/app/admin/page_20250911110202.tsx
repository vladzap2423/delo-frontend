"use client"
import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const router = useRouter();
    const { token, user, hydrated } = useAuthStore()
    
    useEffect(() => {
        if (!hydrated) return;

        if (!token) {
          router.push("/login");
        }
        else if (user && user.role !== 'admin') {
            router.push('/')
        }
    }, [hydrated, token, user, router]);

    if (!user) return null

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Админка</h1>
            {user.role === "admin" && (
                <button className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800">
                Кнопка только для админа
                </button>
            )}
        </div>
    )
}
