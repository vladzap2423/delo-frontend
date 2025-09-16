"use client";

import { useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Rnd } from "react-rnd";
import SignatureBlock from "./SignatureBlock";

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

  // базовый размер контейнера
  const baseWidth = 400;
  const baseHeight = 300;

  // позиция и размер контейнера
  const [groupPos, setGroupPos] = useState({ x: 100, y: 100 });
  const [groupSize, setGroupSize] = useState({ width: baseWidth, height: baseHeight });

  // масштаб
  const scale = {
    x: groupSize.width / baseWidth,
    y: groupSize.height / baseHeight,
  };

  // начальные "слоты" внутри контейнера (относительные координаты)
  const relativeSlots = useRef(
    users.map((u, idx) => ({
      userId: u.id,
      fio: u.fio,
      page: 1,
      x: 20, // px от левого края контейнера
      y: 20 + idx * 90, // px от верха контейнера
      width: 200,
      height: 70,
    }))
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-100 rounded-lg shadow-lg p-4 relative w-[95%] h-[95%] overflow-hidden">
        {/* кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
        >
          ✕
        </button>

        <h2 className="text-lg font-bold mb-2">Схема подписей</h2>

        {/* PDF */}
        <div className="flex-1 flex items-center justify-center bg-gray-100 overflow-y-scroll scroll-hidden">
          <div
            className="relative bg-white shadow-md"
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

            {/* контейнер с подписями */}
            <Rnd
              default={{
                x: groupPos.x,
                y: groupPos.y,
                width: groupSize.width,
                height: groupSize.height,
              }}
              minWidth={200}
              minHeight={120}
              bounds="parent"
              style={{
                border: "2px dashed #9333ea",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.4)",
              }}
              onResize={(e, dir, ref, delta, pos) => {
                setGroupSize({
                  width: parseFloat(ref.style.width),
                  height: parseFloat(ref.style.height),
                });
              }}
              onDragStop={(e, d) => setGroupPos({ x: d.x, y: d.y })}
            >
              <div
                style={{
                  width: baseWidth,
                  height: baseHeight,
                  transform: `scale(${scale.x}, ${scale.y})`,
                  transformOrigin: "top left",
                }}
                className="relative"
              >
                {relativeSlots.current.map((slot) => (
                  <div
                    key={slot.userId}
                    style={{
                      position: "absolute",
                      left: slot.x,
                      top: slot.y,
                      width: slot.width,
                      height: slot.height,
                    }}
                  >
                    <SignatureBlock fio={slot.fio} preview />
                  </div>
                ))}
              </div>
            </Rnd>
          </div>
        </div>

        {/* кнопка сохранить */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              // пересчёт реальных координат для сохранения
              const slots: Slot[] = relativeSlots.current.map((s) => ({
                userId: s.userId,
                page: s.page,
                x: groupPos.x + s.x * scale.x,
                y: groupPos.y + s.y * scale.y,
                width: s.width * scale.x,
                height: s.height * scale.y,
              }));
              onSave(slots);
            }}
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Сохранить схему
          </button>
        </div>
      </div>
    </div>
  );
}
