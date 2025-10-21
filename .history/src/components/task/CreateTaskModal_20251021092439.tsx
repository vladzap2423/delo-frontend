"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Loader2 } from "lucide-react";
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
  const [isDragOver, setIsDragOver] = useState(false);

  // Очистка всех полей при открытии модалки
  useEffect(() => {
    if (open) {
      onTitleChange("");
      onFileChange(null);
      onCommissionChange(0);
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Кнопка закрытия */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Создать задачу
            </h2>

            <div className="space-y-4">
              {/* Название */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Название
                </label>
                <input
                  type="text"
                  placeholder="Введите название задачи"
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
                  value={title}
                  onChange={(e) => onTitleChange(e.target.value)}
                />
              </div>

              {/* Файл с drag-and-drop */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Файл
                </label>

                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    const droppedFile = e.dataTransfer.files?.[0];
                    if (droppedFile) onFileChange(droppedFile);
                  }}
                  className={`border-2 border-dashed rounded-lg px-4 py-6 text-center cursor-pointer transition transform ${
                    isDragOver
                      ? "border-emerald-500 bg-emerald-50 scale-[1.02]"
                      : file
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-gray-300 hover:border-emerald-400 hover:bg-gray-50"
                  }`}
                  onClick={() => document.getElementById("fileInput")?.click()}
                >
                  {file ? (
                    <div className="flex flex-col items-center text-emerald-700">
                      <FileText className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-gray-500 mt-1">
                        Нажмите, чтобы заменить
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      <FileText className="w-6 h-6 mb-2" />
                      <span className="text-sm font-medium">
                        Перетащите файл сюда или нажмите, чтобы выбрать
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        PDF, Excel и другие форматы
                      </span>
                    </div>
                  )}
                </div>

                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    onFileChange(e.target.files?.[0] || null)
                  }
                />
              </div>

              {/* Комиссия */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Комиссия
                </label>
                <select
                  className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-400"
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
            </div>

            {/* Кнопки */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
              >
                Отмена
              </button>
              <button
                onClick={onSubmit}
                disabled={loading || !title || !file || !commissionId}
                className="px-5 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-50 transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Создание...
                  </>
                ) : (
                  "Создать"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
