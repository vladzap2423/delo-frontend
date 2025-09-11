"use client"

import { useActionState } from "react"
import { useEffect } from "react";

export default function AdminPage() {
    const {tocken, user} = useActionState()
    
    useEffect(() => {
        if (!token) {
          router.push("/login");
        }
      }, [token, router]);


    return (
        <div>GHLF</div>
    )
}
