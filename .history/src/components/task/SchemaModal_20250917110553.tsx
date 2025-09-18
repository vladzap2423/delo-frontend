"use client";

import { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Rnd } from "react-rnd";
import SignatureBlock from "../SignatureBlock";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface Slot {
  userId: number;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SchemaModalProps {
  fileUrl: string;
  users: { id: number; fio: string }[];
  onClose: () => void;
  onSave: (slots: Slot[]) => void;
}

export default function SchemaModal({ fileUrl, users, onClose, onSave }: SchemaModalProps) {
  const pageWidth = 800;
  const pageHeight = 1131;

  // общая позиция контейнера
  const [groupPos, setGroupPos] = useState({ x: 100, y: 100 });

  // фиксированные размеры каждой подписи
  const blockWidth = 510;
  const blockHeight = 60;

  const slotsRef = useRef<Slot[]>(
    users.map((u, idx) => ({
      userId: u.id,
      page: 1,
      x: groupPos.x,
      y: groupPos.y + idx * (blockHeight + 10), // 10px отступ
      width: blockWidth,
      height: blockHeight,
    }))
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-100 rounded-lg shadow-lg p-4 relative w-[60%] h-[95%] flex flex-col">
        {/* кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
        >
          ✕
        </button>

        <h2 className="text-lg font-bold mb-2">Схема подписей</h2>

        {/* PDF */}
        <div className="flex-1 bg-gray-100 overflow-y-auto">
          <div
            className="relative bg-white shadow-md mx-auto"
            style={{ width: pageWidth, height: pageHeight }}
          >
            <Document file={fileUrl}>
              <Page
                pageNumber={1}
                width={pageWidth}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>

            {/* общий контейнер для всех подписей */}
            <Rnd
              default={{
                x: groupPos.x,
                y: groupPos.y,
                width: blockWidth,
                height: users.length * (blockHeight + 10),
              }}
              enableResizing={false}
              bounds="parent"
              dragGrid={[10, 10]}
              onDragStop={(e, d) => {
                setGroupPos({ x: d.x, y: d.y });
                slotsRef.current = users.map((u, idx) => ({
                  userId: u.id,
                  page: 1,
                  x: d.x,
                  y: d.y + idx * (blockHeight + 10),
                  width: blockWidth,
                  height: blockHeight,
                }));
              }}
            >
              <div className="flex flex-col gap-2">
                {users.map((u) => (
                  <SignatureBlock
                    key={u.id}
                    fio={u.fio}
                    preview
                    style={{ width: blockWidth, height: blockHeight }}
                  />
                ))}
              </div>
            </Rnd>
          </div>
        </div>

        {/* кнопка сохранить */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => onSave(slotsRef.current)}
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Сохранить схему
          </button>
        </div>
      </div>
    </div>
  );
}
