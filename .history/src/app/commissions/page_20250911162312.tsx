"use client"
import { useAuthStore } from "@/store/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllUsers, updateUserPassword, updateUserRole, updateUserStatus } from "@/services/user.service";
import { KeyRound, ShieldEllipsis, ShieldCheck, ShieldX } from "lucide-react";


type User = {
  id: number;
  username: string;
  fio: string;
  post: string;
  role: string;
  isActive: boolean;
}
  
export default function AdminPage() {
    const router = useRouter();
    const { token, user, hydrated } = useAuthStore()
    const [users, setUsers] = useState<User[]> ([])


    // загрузка списка
    async function loadUsers() {
        try {
        const data = await getAllUsers();
        setUsers(data);
        } catch (err) {
        console.error(err);
        }
    }
    
    useEffect(() => {
        if (!hydrated) return;
        if (!token) {
          router.push("/login");
        }
        loadUsers()
    }, [hydrated]);

    if (!user) return null

    // обработчики действий
    const handleToggleStatus = async (id: number, current: boolean) => {
        try {
        await updateUserStatus(id, !current);
        await loadUsers();
        } catch (err) {
        console.error("Ошибка изменения статуса", err);
        }
    };

    const handleChangeRole = async (id: number) => {
        try {
        // для примера — просто переключаем роль
        const newRole = "admin"; // тут можно будет выбрать из модалки
        await updateUserRole(id, newRole);
        await loadUsers();
        } catch (err) {
        console.error("Ошибка изменения роли", err);
        }
    };

    const handleChangePassword = async (id: number) => {
        try {
        const newPassword = prompt("Введите новый пароль:") || "";
        if (!newPassword) return;
        await updateUserPassword(id, newPassword);
        alert("Пароль успешно изменён");
        } catch (err) {
        console.error("Ошибка изменения пароля", err);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Список пользователей</h1>
            <div className="overflow-x-auto shadow">
        
            </div>
        </div>
    )
}
