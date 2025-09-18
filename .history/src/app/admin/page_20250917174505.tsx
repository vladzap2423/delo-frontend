"use client";
import { useAuthStore } from "@/store/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAllUsers,
  updateUserPassword,
  updateUserRole,
  updateUserStatus,
  createUser,
} from "@/services/user.service";
import { KeyRound, UserRoundPlus, ShieldCheck, ShieldX, Check, X } from "lucide-react";

type User = {
  id: number;
  username: string;
  fio: string;
  post: string;
  role: string;
  isActive: boolean;
};

export default function AdminPage() {
  const router = useRouter();
  const { token, user, hydrated } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState({
    fio: "",
    post: "",
    username: "",
    password: "",
    role: "user",
  });

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
    if (user && user.role !== "admin") {
      router.push("/");
      return;
    }
    loadUsers();
  }, [hydrated]);

  if (!user) return null;

  // действия
  const handleToggleStatus = async (id: number, current: boolean) => {
    try {
      await updateUserStatus(id, !current);
      await loadUsers();
    } catch (err) {
      console.error("Ошибка изменения статуса", err);
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

  const handleSaveNewUser = async () => {
    try {
      await createUser(newUser);
      setIsAdding(false);
      setNewUser({ fio: "", post: "", username: "", password: "", role: "user" });
      await loadUsers();
    } catch (err) {
      console.error("Ошибка создания пользователя", err);
    }
  };

  return (
    <div className="p-8">
      {/* Заголовок и кнопка */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Список пользователей</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="p-2 rounded-full hover:bg-gray-200"
          title="Добавить пользователя"
        >
          <UserRoundPlus className="w-6 h-6 text-emerald-700" />
        </button>
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
                <td
                  className="px-4 py-2 border text-center cursor-pointer"
                  title="Переключить статус"
                  onClick={() => handleToggleStatus(u.id, u.isActive)}
                >
                  {u.isActive ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-600 inline" />
                  ) : (
                    <ShieldX className="w-5 h-5 text-red-600 inline" />
                  )}
                </td>
                <td className="px-4 py-2 border text-center">
                  <button
                    className="p-2 rounded-full hover:bg-gray-200"
                    title="Сменить пароль"
                    onClick={() => handleChangePassword(u.id)}
                  >
                    <KeyRound className="w-5 h-5 text-emerald-700" />
                  </button>
                </td>
              </tr>
            ))}

            {/* Строка для добавления нового пользователя */}
            {isAdding && (
              <tr className="bg-gray-50">
                <td className="px-4 py-2 border text-center">—</td>
                <td className="px-4 py-2 border">
                  <input
                    value={newUser.fio}
                    onChange={(e) => setNewUser({ ...newUser, fio: e.target.value })}
                    placeholder="ФИО"
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2 border">
                  <input
                    value={newUser.post}
                    onChange={(e) => setNewUser({ ...newUser, post: e.target.value })}
                    placeholder="Должность"
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2 border">
                  <input
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    placeholder="Username"
                    className="w-full border rounded px-2 py-1"
                  />
                </td>
                <td className="px-4 py-2 border text-center">
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="border rounded px-2 py-1"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="px-4 py-2 border text-center">—</td>
                <td className="px-4 py-2 border text-center">
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Пароль"
                    className="w-full border rounded px-2 py-1 mb-2"
                  />
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={handleSaveNewUser}
                      className="p-2 rounded-full hover:bg-emerald-200"
                      title="Сохранить"
                    >
                      <Check className="w-5 h-5 text-emerald-700" />
                    </button>
                    <button
                      onClick={() => setIsAdding(false)}
                      className="p-2 rounded-full hover:bg-red-200"
                      title="Отмена"
                    >
                      <X className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
