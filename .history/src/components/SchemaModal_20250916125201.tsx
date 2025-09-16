"use client";

import { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Draggable from "react-draggable";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import SignatureBlock from "./SignatureBlock";

// worker из public/
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

type UserSlot = {
  userId: number;
  fio: string;
  page: number;
  x: number; // % по горизонтали
  y: number; // % по вертикали
  width: number; // % ширины страницы
  height: number; // % высоты страницы
};

interface SchemaModalProps {
  fileUrl: string;
  users: { id: number; fio: string }[];
  onClose: () => void;
  onSave: (slots: UserSlot[]) => void;
}

export default function SchemaModal({ fileUrl, users, onClose, onSave }: SchemaModalProps) {
  const pageWidth = 600; // ширина рендера PDF на фронте
  const pageHeight = 850; // примерно A4 (будет достаточно для процентов)

  const [slots, setSlots] = useState<UserSlot[]>(
    users.map((u, idx) => ({
      userId: u.id,
      fio: u.fio,
      page: 1,
      x: 0.1, // 10% от ширины
      y: 0.1 + idx * 0.1, // разные по вертикали
      width: 0.3, // 30% ширины
      height: 0.05, // 5% высоты
    }))
  );

  const updateSlot = (userId: number, x: number, y: number) => {
    setSlots((prev) =>
      prev.map((s) =>
        s.userId === userId
          ? {
              ...s,
              x: x / pageWidth,
              y: y / pageHeight,
            }
          : s
      )
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-4 relative w-[60%] h-[95%] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
        >
          ✕
        </button>
        <h2 className="text-lg font-bold mb-2">Схема подписей</h2>

        <div className="flex-1 flex items-center jus">
          <div className="relative bg-white shadow-md">
            <Document file={fileUrl}>
              <Page pageNumber={1} width={800} renderTextLayer={false} renderAnnotationLayer={false} />
            </Document>

            {/* Слоты */}
            {slots.map((slot) => {
              const nodeRef = useRef(null);
              return (
                <Draggable
                  key={slot.userId}
                  nodeRef={nodeRef}
                  position={{
                    x: slot.x * pageWidth,
                    y: slot.y * pageHeight,
                  }}
                  onStop={(e, data) =>
                    updateSlot(slot.userId, data.x, data.y)
                  }
                >
                  <div ref={nodeRef} className="absolute">
                    <SignatureBlock fio={slot.fio} preview />
                  </div>
                </Draggable>
              );
            })}
          </div>

          {/* список пользователей */}
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
