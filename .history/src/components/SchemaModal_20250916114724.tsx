"use client";

import { useState, useRef } from "react";
import { Document, Page } from "react-pdf";
import Draggable from "react-draggable";
import { pdfjs } from "react-pdf";


pdfjs.GlobalWorkerOptions.workerSrc = /;

type UserSlot = {
  userId: number;
  fio: string;
  page: number;
  x: number;
  y: number;
};

interface SchemaModalProps {
  fileUrl: string; // ссылка на загруженный pdf
  users: { id: number; fio: string }[];
  onClose: () => void;
  onSave: (slots: UserSlot[]) => void;
}

export default function SchemaModal({ fileUrl, users, onClose, onSave }: SchemaModalProps) {
  const [slots, setSlots] = useState<UserSlot[]>(
    users.map((u, idx) => ({
      userId: u.id,
      fio: u.fio,
      page: 1,
      x: 50,
      y: 50 + idx * 60,
    }))
  );

  const updateSlot = (userId: number, x: number, y: number) => {
    setSlots((prev) =>
      prev.map((s) => (s.userId === userId ? { ...s, x, y } : s))
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 relative w-4/5 h-5/6 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
        >
          ✕
        </button>
        <h2 className="text-lg font-bold mb-2">Схема подписей</h2>

        <div className="flex gap-4 h-[90%]">
          {/* PDF */}
          <div className="flex-1 border relative overflow-auto">
            <Document file={fileUrl}>
              <Page pageNumber={1} width={600} />
            </Document>

            {/* Слоты */}
            {slots.map((slot) => {
              const nodeRef = useRef(null);
              return (
                <Draggable
                  key={slot.userId}
                  nodeRef={nodeRef}
                  position={{ x: slot.x, y: slot.y }}
                  onStop={(e, data) => updateSlot(slot.userId, data.x, data.y)}
                >
                  <div
                    ref={nodeRef}
                    className="absolute px-2 py-1 bg-blue-500 text-white text-xs rounded cursor-move select-none"
                  >
                    {slot.fio}
                  </div>
                </Draggable>
              );
            })}
          </div>

          {/* Список пользователей */}
          <div className="w-64 border-l pl-2 overflow-y-auto">
            <h3 className="font-semibold mb-2">Участники</h3>
            {users.map((u) => (
              <div key={u.id} className="text-sm mb-1">
                {u.fio}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => onSave(slots)}
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Сохранить схему
          </button>
        </div>
      </div>
    </div>
  );
}
