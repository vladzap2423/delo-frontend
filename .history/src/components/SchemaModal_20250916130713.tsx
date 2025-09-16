"use client";

import { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Draggable from "react-draggable";
import SignatureBlock from "./SignatureBlock";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";


pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

type UserSlot = {
  userId: number;
  fio: string;
  page: number;
  x: number; 
  y: number; 
  width: number;
  height: number;
};

interface SchemaModalProps {
  fileUrl: string;
  users: { id: number; fio: string }[];
  onClose: () => void;
  onSave: (slots: UserSlot[]) => void;
}

export default function SchemaModal({ fileUrl, users, onClose, onSave }: SchemaModalProps) {
  const pageWidth = 800;
  const pageHeight = 1131; // примерно A4 (будет достаточно для процентов)

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
      <div className="bg-gray-100 rounded-lg shadow-lg p-4 relative w-[60%] h-[95%] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
        >
          ✕
        </button>
        <h2 className="text-lg font-bold mb-2">Схема подписей</h2>

        <div className="flex-1 flex items-center justify-center bg-gray-100">
          <div className="relative bg-white shadow-md overflow-y-scroll scrolll-hidden">
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
