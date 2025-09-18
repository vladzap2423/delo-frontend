"use client";

import { useState } from "react";
import { CircleCheckBig, CircleX } from "lucide-react";
import { Task } from "@/services/task.service";
import PdfViewerModal from "../PdfModal";

interface TaskCardProps {
  task: Task;
  currentUserId: number;
  onSign: (taskId: number, userId: number) => void;
}

export default function TaskCard({ task, currentUserId, onSign }: TaskCardProps) {
  const [showPdf, setShowPdf] = useState(false);

  const isUserSigner = task.signs.some(
    (s) => s.user.id === currentUserId && !s.isSigned
  );

  return (
    <div className="flex items-start gap-3 border rounded p-3 bg-white">
      {/* Иконка */}
      <img src="/icon_documents.png" alt="doc" className="w-32 h-32 mt-auto" />

      {/* Контент */}
      <div className="flex flex-col flex-1">
        <div className="text-center font-bold text-lg mb-2">{task.title}</div>

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

      {/* Правая колонка */}
      <div className="flex flex-col">
        <button
        onClick={() => setShowPdf(tк
          
        )}
        className="ml-2 px-3 py-1 mb-1 text-sm bg-green-200 text-black rounded-xl hover:bg-green-400">
          Открыть
        </button>

        {isUserSigner && (
          <button
            onClick={() => onSign(task.id, currentUserId)}
            className="ml-2 px-3 py-1 mb-1 text-sm bg-blue-300 text-black rounded-xl hover:bg-blue-500"
          >
            Подписать
          </button>
        )}

        <div className="text-sm text-gray-500 text-right mt-20">
          Создал: {task.creator.fio}
        </div>
      </div>

      {/* Модалка просмотра PDF */}
      {showPdf && task.filePath && (
        <PdfViewerModal
          fileUrl={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${task.filePath}`}
          title={task.title}
          onClose={() => setShowPdf(false)}
        />
      )}
      
    </div>
  );
}
