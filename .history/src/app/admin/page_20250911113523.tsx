"use client"
import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllUsers } from "@/services/user.service";

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
        } else {
            getAllUsers()
            .then((data) =>)
        }
    }, [hydrated, token, user, router]);

    if (!user) return null

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            
        </div>
    )
}
