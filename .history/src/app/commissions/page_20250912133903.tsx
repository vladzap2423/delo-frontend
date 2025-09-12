"use client"
import { useAuthStore } from "@/store/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getActiveUsers } from "@/services/user.service";
import { getAllCommissions, createCommission, addUsersToCommission,  } from "@/services/commission.service";


  
export default function AdminPage() {
    const router = useRouter();
    const { token, user, hydrated } = useAuthStore()
    
    
    useEffect(() => {
        if (!hydrated) return;
        if (!token) {
          router.push("/login");
        }
        
    }, [hydrated]);

    if (!user) return null

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Список комиссий</h1>
            <div className="overflow-x-auto shadow">
        
            </div>
        </div>
    )
}
