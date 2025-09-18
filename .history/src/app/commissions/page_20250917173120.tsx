"use client";

import { useAuthStore } from "@/store/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getActiveUsers } from "@/services/user.service";
import {
  getAllCommissions,
  createCommission,
  addUsersToCommission,
  removeUserFromCommission,
} from "@/services/commission.service";
import { Plus, X, UserRoundPlus } from "lucide-react";

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

  // модалка для новой комиссии
  const [isCreating, setIsCreating] = useState(false);
  const [newCommissionName, setNewCommissionName] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  // модалка для добавления в комиссию
  const [modalCommissionId, setModalCommissionId] = useState<number | null>(
    null
  );
  const [modalSelectedIds, setModalSelectedIds] = useState<number[]>([]);

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

  // сохранение комиссии
  const handleCreateCommission = async () => {
    if (!newCommissionName.trim()) return;
    try {
      await createCommission(newCommissionName, selectedUserIds);
      setNewCommissionName("");
      setSelectedUserIds([]);
      setIsCreating(false);
      await loadData();
    } catch (err) {
      console.error("Ошибка создания комиссии", err);
    }
  };

  // удаление юзера из комиссии
  const handleRemoveUser = async (commissionId: number, userId: number) => {
    try {
      const result = await removeUserFromCommission(commissionId, userId);
      if (result?.message) {
        console.log(result.message);
      }
      await loadData();
    } catch (err) {
      console.error("Ошибка удаления пользователя", err);
    }
  };

  // сохранение пользователей из модалки
  const handleSaveModal = async () => {
    if (modalCommissionId) {
      try {
        await addUsersToCommission(modalCommissionId, modalSelectedIds);
        setModalCommissionId(null);
        setModalSelectedIds([]);
        await loadData();
      } catch (err) {
        console.error("Ошибка добавления пользователей", err);
      }
    }
  };

  return (
    <div className="p-8">
      {/* Заголовок */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Список комиссий</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
        >
          <Plus className="w-5 h-5" />
          Добавить комиссию
        </button>
      </div>

      {/* Таблица комиссий */}
      <div className="overflow-x-auto shadow bg-white">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Название</th>
              <th className="px-4 py-2 border">Участники</th>
            </tr>
          </thead>
          <tbody>
            {commissions.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{c.name}</td>
                <td className="px-4 py-2 border">
                  <div className="flex items-center gap-4">
                    {/* Список участников */}
                    <div className="flex flex-wrap gap-2 flex-1">
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

                    {/* Кнопка добавления */}
                    <button
                      onClick={() => {
                        setModalCommissionId(c.id);
                        setModalSelectedIds([]);
                      }}
                      className="p-2 rounded-full hover:bg-gray-200"
                      title="Добавить пользователей"
                    >
                      <UserRoundPlus className="w-5 h-5 text-emerald-700" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Модалка для создания комиссии */}
      {isCreating && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Создать комиссию</h2>
              <button
                onClick={() => setIsCreating(false)}
                className="p-2 hover:bg-gray-200 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="text"
              value={newCommissionName}
              onChange={(e) => setNewCommissionName(e.target.value)}
              placeholder="Название комиссии"
              className="w-full border px-3 py-2 rounded-md mb-4"
            />

            <h3 className="font-semibold mb-2">Выберите пользователей:</h3>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {activeUsers.map((u) => (
                <label key={u.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedUserIds.includes(u.id)}
                    onChange={() =>
                      setSelectedUserIds((prev) =>
                        prev.includes(u.id)
                          ? prev.filter((id) => id !== u.id)
                          : [...prev, u.id]
                      )
                    }
                  />
                  {u.fio} ({u.username})
                </label>
              ))}
            </div>

            <button
              onClick={handleCreateCommission}
              className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
            >
              Сохранить
            </button>
          </div>
        </div>
      )}

      {/* Модалка для добавления пользователей */}
      {modalCommissionId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Добавить пользователей</h2>
              <button
                onClick={() => setModalCommissionId(null)}
                className="p-2 hover:bg-gray-200 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {activeUsers
                .filter(
                  (u) =>
                    !commissions
                      .find((c) => c.id === modalCommissionId)
                      ?.users.find((cu) => cu.id === u.id)
                )
                .map((u) => (
                  <label key={u.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={modalSelectedIds.includes(u.id)}
                      onChange={() =>
                        setModalSelectedIds((prev) =>
                          prev.includes(u.id)
                            ? prev.filter((id) => id !== u.id)
                            : [...prev, u.id]
                        )
                      }
                    />
                    {u.fio} ({u.username})
                  </label>
                ))}
            </div>

            <button
              onClick={handleSaveModal}
              className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
            >
              Добавить выбранных
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
