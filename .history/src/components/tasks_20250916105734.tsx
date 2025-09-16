"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { createTask, getAllTasks, Task } from "@/services/task.service";
import { getAllCommissions, Commission } from "@/services/commission.service";
import { useAuthStore } from "@/store/auth";
import { CircleCheckBig, CircleX } from "lucide-react";

export default function TaskPage() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [commissionId, setCommissionId] = useState<number>(0);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuthStore();

  const [showSchemaModal, setShowSchemaModal] = useState(false);
  const [signSchema, setSignSchema] = useState<any[]>([]); 
  
  

  // Загружаем комиссии при открытии модалки
  useEffect(() => {
    if (showModal) {
      getAllCommissions()
        .then(setCommissions)
        .catch((err) => console.error("Ошибка загрузки комиссий:", err));
    }
  }, [showModal]);

  // Загружаем задачи при монтировании
  useEffect(() => {
    getAllTasks()
      .then(setTasks)
      .catch((err) => console.error("Ошибка загрузки задач:", err));
  }, []);

  const handleSubmit = async () => {
    if (!title || !file || !commissionId) {
      alert("Заполните все поля");
      return;
    }
    if (!user?.sub) {
      alert("Ошибка: пользователь не определён");
      return;
    }

    try {
      setLoading(true);
      const task = await createTask({
        title,
        creatorId: user.sub,
        commissionId,
        file,
        signSchema,
      });
      setTasks((prev) => [task, ...prev]); // добавляем сразу в список
      setShowModal(false);
      setTitle("");
      setFile(null);
      setCommissionId(0);
    } catch (err) {
      console.error(err);
      alert("Ошибка при создании задачи");
    } finally {
      setLoading(false);
    }
  };

   const filteredTasks = tasks.filter(
        (t) =>
        t.creator.id === user?.sub ||
        t.signs.some((s) => s.user.id === user?.sub)
    );
  const inProgress = filteredTasks.filter((t) => t.status === "in_progress");
  const completed = filteredTasks.filter((t) => t.status === "completed");

  const renderTaskCard = (task: Task) => {
  const isUserSigner = task.signs.some(
    (s) => s.user.id === user?.sub && !s.isSigned
  );

  return (
    <div
      key={task.id}
      className="flex items-start gap-3 border rounded p-3 bg-white"
    >
      {/* Иконка */}
      <img src="/icon_documents.png" alt="doc" className="w-32 h-32 mt-auto" />

      {/* Контент */}
      <div className="flex flex-col flex-1">
        {/* Заголовок */}
        <div className="text-center font-bold text-lg mb-2">{task.title}</div>

        {/* Подписанты */}
        <div className="flex flex-col gap-1 mb-2">
          {task.signs.map((s) => (
            <div key={s.id} className="flex items-center gap-2 text-sm">
              {s.isSigned ? (
                <CircleCheckBig color="#00ff1e" className="w-5 h-5" />
              ) : (
                <CircleX color="#e60a0a" className="w-5 h-5" />
              )}
              <span>{s.user.fio}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Правая колонка с кнопками */}
      <div className="flex flex-col">
        {/* Кнопка открыть */}
        <button className="ml-2 px-3 py-1 mb-1 text-sm bg-green-200 text-black rounded-xl hover:bg-green-400">
          Открыть
        </button>

        {/* Кнопка подписать видна только если пользователь подписант и ещё не подписал */}
        {isUserSigner && (
          <button
            onClick={() => handleSign(task.id, user?.sub!)}
            className="ml-2 px-3 py-1 mb-1 text-sm bg-blue-300 text-black rounded-xl hover:bg-blue-500"
          >
            Подписать
          </button>
        )}

        {/* Создатель */}
        <div className="text-sm text-gray-500 text-right mt-20">
          Создал: {task.creator.fio}
        </div>
      </div>
    </div>
  );
};


  // Тестовая функция подписания
const handleSign = (taskId: number, userId: number) => {
  console.log(`Пользователь ${userId} подписал задачу ${taskId}`);
};

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Левая колонка (В работе) */}
      <div className="col-span-2 bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">В работе:</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-3 py-1 bg-emerald-500 text-white rounded-3xl hover:bg-emerald-700"
          >
            <Plus className="w-5 h-5" />
            Создать
          </button>
        </div>
        <div className="space-y-3">
          {inProgress.map(renderTaskCard)}
        </div>
      </div>

      {/* Правая колонка (Отработано) */}
      <div className="col-span-1 bg-white rounded-lg shadow p-4">
        <h1 className="text-xl font-bold mb-4">Отработано:</h1>
        <div className="space-y-3">
          {completed.map(renderTaskCard)}
        </div>
      </div>

      {/* Модалка */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Создать задачу</h2>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Название задачи"
                className="w-full border rounded px-3 py-2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              <select
                className="w-full border rounded px-3 py-2"
                value={commissionId || ""}
                onChange={(e) => setCommissionId(Number(e.target.value))}
              >
                <option value="">Выберите комиссию</option>
                {commissions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {commissionId > 0 && (
              <button
                onClick={() => setShowSchemaModal(true)}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Разместить подписи
              </button>
            )}

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Отмена
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 rounded bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-50"
              >
                {loading ? "Создание..." : "Создать"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSchemaModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl relative">
            <h2 className="text-lg font-bold mb-4">Схема подписей</h2>

            {/* Заглушка для документа */}
            <div className="border h-96 flex items-center justify-center text-gray-500">
              Тут будет отображаться PDF/изображение
            </div>

            {/* Список пользователей комиссии */}
            <div className="mt-4 space-y-2">
              {commissions
                .find((c) => c.id === commissionId)
                ?.users?.map((u) => (
                  <div
                    key={u.id}
                    className="flex justify-between items-center border rounded px-3 py-2"
                  >
                    <span>{u.fio}</span>
                    {/* Пока просто кнопка "Добавить слот" */}
                    <button
                      onClick={() => {
                        setSignSchema((prev) => [
                          ...prev,
                          { userId: u.id, page: 1, x: 100, y: 100, width: 200, height: 50 },
                        ]);
                      }}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Добавить слот
                    </button>
                  </div>
                ))}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowSchemaModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Отмена
              </button>
              <button
                onClick={() => setShowSchemaModal(false)}
                className="px-4 py-2 rounded bg-emerald-700 text-white hover:bg-emerald-800"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}

