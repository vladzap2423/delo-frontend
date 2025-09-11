"use client"
import { useAuthStore } from "@/store/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const router = useRouter();
    const { token, user } = useAuthStore()
    
    useEffect(() => {
        if (!token) {
          router.push("/login");
        }
        else if (user && user.role !=='admin') {
            router.push('')
        }
    }, [token, router]);

    if (!user) return null

    return (
        <div>GHLF</div>
    )
}
