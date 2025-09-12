"use client";

import { useAuthStore } from "@/store/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {getActiveUsers,} from "@/services/user.service";
import {getAllCommissions, createCommission, addUsersToCommission,
  removeUserFromCommission,
} from "@/services/commission.service";
import { Plus, X } from "lucide-react";

type User = {
  id: number;
  fio: string;
  username: string;
};

type Commission = {
  id: number;
  name: string;
  users: User[];
};

export default function CommissionsPage() {
  const router = useRouter();
  const { token, user, hydrated } = useAuthStore();

  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCommissionName, setNewCommissionName] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  // загрузка данных
  async function loadData() {
    try {
      const users = await getActiveUsers();
      setActiveUsers(users);
      const comms = await getAllCommissions();
      setCommissions(comms);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.push("/login");
      return;
    }
    loadData();
  }, [hydrated]);

  if (!user) return null;

  // переключение чекбоксов
  const toggleUserSelection = (id: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  // сохранение комиссии
  const handleCreateCommission = async () => {
    if (!newCommissionName.trim()) return;
    try {
      await createCommission(newCommissionName, selectedUserIds);
      setNewCommissionName("");
      setSelectedUserIds([]);
      setIsAdding(false);
      await loadData();
    } catch (err) {
      console.error("Ошибка создания комиссии", err);
    }
  };

  // добавление юзеров в комиссию
  const handleAddUsers = async (commissionId: number, userIds: number[]) => {
    try {
      await addUsersToCommission(commissionId, userIds);
      await loadData();
    } catch (err) {
      console.error("Ошибка добавления пользователей", err);
    }
  };

  // удаление юзера из комиссии
  const handleRemoveUser = async (commissionId: number, userId: number) => {
    try {
      await removeUserFromCommission(commissionId, userId);
      await loadData();
    } catch (err) {
      console.error("Ошибка удаления пользователя", err);
    }
  };

  return (
    <div className="p-8">
      {/* Заголовок */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Список комиссий</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
        >
          <Plus className="w-5 h-5" />
          Добавить комиссию
        </button>
      </div>

      {/* Форма создания комиссии */}
      {isAdding && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              value={newCommissionName}
              onChange={(e) => setNewCommissionName(e.target.value)}
              placeholder="Название комиссии"
              className="w-full border px-3 py-2 rounded-md mr-4"
            />
            <button
              onClick={() => setIsAdding(false)}
              className="p-2 rounded-full hover:bg-red-200"
              title="Отмена"
            >
              <X className="w-5 h-5 text-red-600" />
            </button>
          </div>

          <h2 className="font-semibold mb-2">Выберите пользователей:</h2>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {activeUsers.map((u) => (
              <label key={u.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedUserIds.includes(u.id)}
                  onChange={() => toggleUserSelection(u.id)}
                />
                {u.fio} ({u.username})
              </label>
            ))}
          </div>

          <button
            onClick={handleCreateCommission}
            className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
          >
            Сохранить комиссию
          </button>
        </div>
      )}

      {/* Таблица комиссий */}
      <div className="overflow-x-auto shadow bg-white rounded-lg">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Название</th>
              <th className="px-4 py-2 border">Участники</th>
            </tr>
          </thead>
          <tbody>
            {commissions.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border text-center">{c.id}</td>
                <td className="px-4 py-2 border">{c.name}</td>
                <td className="px-4 py-2 border">
                  <div className="flex flex-wrap gap-2">
                    {c.users.map((u) => (
                      <span
                        key={u.id}
                        className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md text-sm flex items-center gap-2"
                      >
                        {u.fio}
                        <button
                          onClick={() => handleRemoveUser(c.id, u.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Добавление новых пользователей */}
                  <div className="mt-2">
                    <select
                      onChange={(e) =>
                        handleAddUsers(c.id, [Number(e.target.value)])
                      }
                      defaultValue=""
                      className="border rounded px-2 py-1"
                    >
                      <option value="" disabled>
                        + Добавить пользователя
                      </option>
                      {activeUsers
                        .filter(
                          (u) => !c.users.find((cu) => cu.id === u.id)
                        )
                        .map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.fio} ({u.username})
                          </option>
                        ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
