"use client";

import { Commission } from "@/services/commission.service";

interface CreateTaskModalProps {
  open: boolean;
  title: string;
  file: File | null;
  commissionId: number;
  commissions: Commission[];
  loading: boolean;
  onClose: () => void;
  onTitleChange: (v: string) => void;
  onFileChange: (f: File | null) => void;
  onCommissionChange: (id: number) => void;
  onSubmit: () => void;
}

export default function CreateTaskModal({
  open,
  title,
  file,
  commissionId,
  commissions,
  loading,
  onClose,
  onTitleChange,
  onFileChange,
  onCommissionChange,
  onSubmit,
}: CreateTaskModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Создать задачу</h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Название задачи"
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />

          <input type="file" onChange={(e) => onFileChange(e.target.files?.[0] || null)} />

          <select
            className="w-full border rounded px-3 py-2"
            value={commissionId || ""}
            onChange={(e) => onCommissionChange(Number(e.target.value))}
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
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Отмена
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="px-4 py-2 rounded bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-50"
          >
            {loading ? "Создание..." : "Создать"}
          </button>
        </div>
      </div>
    </div>
  );
}
