"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { createTask, getAllTasks, Task } from "@/services/task.service";
import { getAllCommissions, Commission } from "@/services/commission.service";
import { useAuthStore } from "@/store/auth";
import TaskCard from "@/components/task/TaskCard";
import CreateTaskModal from "@/components/task/CreateTaskModal";

export default function TaskPage() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [commissionId, setCommissionId] = useState<number>(0);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuthStore();

  // Загружаем комиссии при открытии модалки
  useEffect(() => {
    if (showModal) {
      getAllCommissions().then(setCommissions).catch(console.error);
    }
  }, [showModal]);

  // Загружаем задачи при монтировании
  useEffect(() => {
    getAllTasks().then(setTasks).catch(console.error);
  }, []);

  const handleSubmit = async () => {
    if (!title || !file || !commissionId || !user?.sub) return;

    try {
      setLoading(true);
      const task = await createTask({
        title,
        creatorId: user.sub,
        commissionId,
        file,
      });
      setTasks((prev) => [task, ...prev]);
      setShowModal(false);
      setTitle("");
      setFile(null);
      setCommissionId(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSign = (taskId: number, userId: number) => {
    console.log(`Пользователь ${userId} подписал задачу ${taskId}`);
  };

  const filteredTasks = tasks.filter(
    (t) => t.creator.id === user?.sub || t.signs.some((s) => s.user.id === user?.sub)
  );
  const inProgress = filteredTasks.filter((t) => t.status === "in_progress");
  const completed = filteredTasks.filter((t) => t.status === "completed");

  if (!user) return null;

  return (
    <div className="h-[calc(100vh-99px)] grid grid-cols-3 gap-6 p-4 overflow-hidden">

      {/* В работе */}
      <div className="col-span-2 bg-white rounded-lg shadow p-4 flex flex-col h-[calc(100vh-150px)]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">В работе:</h1>
          <button
            onClick={() => {
              setTitle("")
              setFile()
              setShowModal(true)}}
            className="flex items-center gap-2 px-3 py-1 bg-emerald-500 text-white rounded-3xl hover:bg-emerald-700"
          >
            <Plus className="w-5 h-5" />
            Создать
          </button>
        </div>
        {/* именно тут скролл */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {inProgress.map((t) => (
            <TaskCard key={t.id} task={t} currentUserId={user.sub} onSign={handleSign} />
          ))}
        </div>
      </div>

      {/* Отработано */}
      <div className="col-span-1 bg-white rounded-lg shadow p-4 flex flex-col h-[calc(100vh-150px)]">
        <h1 className="text-xl font-bold mb-4">Отработано:</h1>
        {/* тут тоже скролл */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {completed.map((t) => (
            <TaskCard key={t.id} task={t} currentUserId={user.sub} onSign={handleSign} />
          ))}
        </div>
      </div>

      {/* Модалка создания задачи */}
      <CreateTaskModal
        open={showModal}
        title={title}
        file={file}
        commissionId={commissionId}
        commissions={commissions}
        loading={loading}
        onClose={() => setShowModal(false)}
        onTitleChange={setTitle}
        onFileChange={setFile}
        onCommissionChange={setCommissionId}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
