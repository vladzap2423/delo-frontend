"use client"

import { useActionState } from "react"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const router = useRouter();
    const { token, user } = useActionState()
    
    useEffect(() => {

        if (!token) {
          router.push("/login");
        }
    }, [token, router]);

    if (!user) return null

    return (
        <div>GHLF</div>
    )
}
