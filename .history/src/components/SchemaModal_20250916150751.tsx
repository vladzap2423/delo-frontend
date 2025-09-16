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

  // начальные позиции подписей (слоты)
  const slotsRef = useRef<Slot[]>(
    users.map((u, idx) => ({
      userId: u.id,
      page: 1,
      x: 100,
      y: 100 + idx * 120, // с отступом, чтобы не налезали
      width: 220,
      height: 90,
    }))
  );

  // начальные "слоты" внутри контейнера (относительные координаты)
  const [, forceUpdate] = useState({});

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
            {slotsRef.current.map((slot, idx) => (
              <Rnd
                key={slot.userId}
                default={{
                  x: slot.x,
                  y: slot.y,
                  width: slot.width,
                  height: slot.height,
                }}
                minWidth={180}
                minHeight={70}
                bounds="parent"
                dragGrid={[10, 10]}   // шаг перемещения
                resizeGrid={[10, 10]} // шаг изменения размера
                style={{
                  border: "1px dashed #9333ea",
                  borderRadius: "6px",
                  background: "rgba(255,255,255,0.9)",
                }}
                onDragStop={(e, d) => {
                  slotsRef.current[idx] = {
                    ...slotsRef.current[idx],
                    x: d.x,
                    y: d.y,
                  };
                  forceUpdate({});
                }}
                onResizeStop={(e, dir, ref, delta, pos) => {
                  const newWidth = parseFloat(ref.style.width);
                  const newHeight = parseFloat(ref.style.height);
                  slotsRef.current[idx] = {
                    ...slotsRef.current[idx],
                    x: pos.x,
                    y: pos.y,
                    width: newWidth,
                    height: newHeight,
                  };
                  forceUpdate({});
                }}
              >
                <SignatureBlock fio={users[idx].fio} preview />
              </Rnd>
            ))}

          </div>
        </div>

        {/* кнопка сохранить */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {onSave(slots);
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
