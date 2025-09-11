"use client"
import { useAuthStore } from "@/store/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllUsers } from "@/services/user.service";
import { KeyRound, shield-ellipsis } from "lucide-react";


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
    
    useEffect(() => {
        if (!hydrated) return;
        if (!token) {
          router.push("/login");
        }
        if (user && user.role !== 'admin') {
            router.push('/')
            return
        }

        (async () => {
            try {
                const data = await getAllUsers()
                console.log("Пользователи", data)
                setUsers(data)
            } catch (err) {
                console.error(err)
            }
        })()
    }, [hydrated]);

    if (!user) return null

    return (
        <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Список пользователей</h1>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full border border-gray-200 bg-white">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">ФИО</th>
              <th className="px-4 py-2 border">Должность</th>
              <th className="px-4 py-2 border">Username</th>
              <th className="px-4 py-2 border">Роль</th>
              <th className="px-4 py-2 border">Статус</th>
              <th className="px-4 py-2 border">Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">{u.id}</td>
                <td className="px-4 py-2 border">{u.fio}</td>
                <td className="px-4 py-2 border">{u.post}</td>
                <td className="px-4 py-2 border">{u.username}</td>
                <td className="px-4 py-2 border">{u.role}</td>
                <td className="px-4 py-2 border">{u.isActive}</td>
                <td className="px-4 py-2 border text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      className="p-2 rounded-full hover:bg-gray-200"
                      title="Сменить пароль"
                      onClick={() => console.log("Сменить пароль", u.id)}
                    >
                      <KeyRound className="w-5 h-5 text-emerald-700" />
                    </button>
                    <button
                      className="p-2 rounded-full hover:bg-gray-200"
                      title="Сменить роль"
                      onClick={() => console.log("Сменить роль", u.id)}
                    >
                      <Shield className="w-5 h-5 text-emerald-700" />
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
