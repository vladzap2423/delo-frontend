"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { createTask } from "@/services/task.service";
import { getAllCommissions, Commission } from "@/services/commission.service";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/router";

export default function TaskPage() {
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [commissionId, setCommissionId] = useState<number>(0);
    const [commissions, setCommissions] = useState<Commission[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuthStore()
    const router = useRouter();

    const creatorId = user?.id

    if (!creatorId) {
        router.push("/login");
    }

    // Загружаем комиссии при открытии модалки
    useEffect(() => {
        if (showModal) {
            getAllCommissions()
                .then(setCommissions)
                .catch((err) => console.error("Ошибка загрузки комиссий:", err));
        }
    }, [showModal]);

    const handleSubmit = async () => {
        if (!title || !file || !commissionId) {
            alert("Заполните все поля");
            return;
        }

        try {
            setLoading(true);
            const task = await createTask({
                title,
                creatorId: creatorId!,
                commissionId,
                file,
            });
            console.log("Создана задача:", task);
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

    return (
        <div className="grid grid-cols-3 gap-6">
            {/* Левая колонка (В работе) */}
            <div className="col-span-2 bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-bold">В работе:</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-3 py-1 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800"
                    >
                        <Plus className="w-5 h-5" />
                        Создать
                    </button>
                </div>
            </div>

            {/* Правая колонка (Отработано) */}
            <div className="col-span-1 bg-white rounded-lg shadow p-4">
                <h1 className="text-xl font-bold mb-4">Отработано:</h1>
            </div>

            {/* Модальное окно */}
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
        </div>
    );
}
