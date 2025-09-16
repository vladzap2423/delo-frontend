"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Rnd } from "react-rnd";
import SignatureBlock from "./SignatureBlock";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface SchemaModalProps {
  fileUrl: string;
  users: { id: number; fio: string }[];
  onClose: () => void;
  onSave: (slots: {
    userId: number;
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void;
}

export default function SchemaModal({ fileUrl, users, onClose, onSave }: SchemaModalProps) {
  const pageWidth = 800;   // ширина A4
  const pageHeight = 1131; // высота A4

  // позиция и размеры контейнера
  const [groupPos, setGroupPos] = useState({ x: 100, y: 100 });
  const [groupSize, setGroupSize] = useState({ width: 400, height: 300 });

  // размеры блока подписи
  const [blockSize, setBlockSize] = useState({ width: 200, height: 80 });

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
                border: "2px dashed #9333ea", // видно границы
                borderRadius: "8px",
                background: "rgba(255,255,255,0.4)",
              }}
              onResize={(e, dir, ref, delta, pos) => {
                const newWidth = parseFloat(ref.style.width);
                const newHeight = parseFloat(ref.style.height);

                setGroupSize({ width: newWidth, height: newHeight });

                // пересчёт размеров подписи
                setBlockSize({
                  width: Math.max(newWidth - 40, 180),
                  height: Math.max(newHeight / users.length - 10, 60),
                });
              }}
              onDragStop={(e, d) => setGroupPos({ x: d.x, y: d.y })}
            >
              <div className="flex flex-col gap-2 w-full h-full items-center justify-center">
                {users.map((u) => (
                  <SignatureBlock
                    key={u.id}
                    fio={u.fio}
                    preview
                    style={{
                      width: blockSize.width,
                      height: blockSize.height,
                    }}
                  />
                ))}
              </div>
            </Rnd>
          </div>
        </div>

        {/* кнопка сохранить */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => onSave({ groupPos, groupSize, blockSize })}
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Сохранить схему
          </button>
        </div>
      </div>
    </div>
  );
}
