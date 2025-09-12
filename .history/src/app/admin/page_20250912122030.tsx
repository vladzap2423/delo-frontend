"use client"
import { useAuthStore } from "@/store/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllUsers, updateUserPassword, updateUserRole, updateUserStatus } from "@/services/user.service";
import { KeyRound, UserRoundPlus, ShieldCheck, ShieldX } from "lucide-react";


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
        if (user && user.role !== 'admin') {
            router.push('/')
            return
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
            <div className="flex">
                <h1 className="text-2xl font-bold mb-6 mr">Список пользователей</h1>
                <UserRoundPlus />
            </div>
            
            <div className="overflow-x-auto shadow">
                <table className="min-w-full border border-gray-200 bg-white">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                    <th className="px-4 py-2 border">ID</th>
                    <th className="px-4 py-2 border">ФИО</th>
                    <th className="px-4 py-2 border">Должность</th>
                    <th className="px-4 py-2 border">Username</th>
                    <th className="px-4 py-2 border">Роль</th>
                    <th className="px-4 py-2 border">Статус</th>
                    <th className="px-4 py-2 border">Смена пароля</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border text-center">{u.id}</td>
                        <td className="px-4 py-2 border">{u.fio}</td>
                        <td className="px-4 py-2 border">{u.post}</td>
                        <td className="px-4 py-2 border">{u.username}</td>
                        <td className="px-4 py-2 border text-center">
                            <select
                                value={u.role}
                                onChange={async (e) => {
                                try {
                                    await updateUserRole(u.id, e.target.value);
                                    await loadUsers();
                                } catch (err) {
                                    console.error("Ошибка изменения роли", err);
                                }
                                }}
                                className="border rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="user">user</option>
                                <option value="admin">admin</option>
                            </select>
                        </td>
                        <td className="px-4 py-2 border text-center cursor-pointer" title="Переключить статус" 
                            onClick={() => handleToggleStatus(u.id, u.isActive)}>
                            {u.isActive ? (
                                <ShieldCheck className="w-5 h-5 text-emerald-600 inline" />
                            ) : (
                                <ShieldX className="w-5 h-5 text-red-600 inline" />
                            )}
                        </td>
                        <td className="px-4 py-2 border text-center">
                            <div className="flex justify-center gap-3">
                                <button
                                className="p-2 rounded-full hover:bg-gray-200"
                                title="Сменить пароль"
                                onClick={() => handleChangePassword(u.id)}
                                >
                                <KeyRound className="w-5 h-5 text-emerald-700" />
                                </button>
                            </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
    )
}
