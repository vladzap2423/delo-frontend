"use client";

import { useState, useRef } from "react";
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
  onSave: (slots: any) => void;
}

export default function SchemaModal({ fileUrl, users, onClose, onSave }: SchemaModalProps) {
  const pageWidth = 800;  // ширина A4
  const pageHeight = 1131; // высота A4

  // позиция и масштаб контейнера с подписями
  const [groupPos, setGroupPos] = useState({ x: 100, y: 100 });
  const [scale, setScale] = useState(1);
  const groupRef = useRef(null);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-100 rounded-lg shadow-lg p-4 relative w-[95%] h-[95%] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
        >
          ✕
        </button>
        <h2 className="text-lg font-bold mb-2">Схема подписей</h2>

        <div className="flex-1 flex items-center justify-center bg-gray-100 overflow-y-scroll scroll-hidden">
          <div className="relative bg-white shadow-md" style={{ width: pageWidth, height: pageHeight }}>
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
                x: 100,
                y: 100,
                width: 400,
                height: 250,
              }}
              minWidth={200}
              minHeight={120}
              bounds="parent"
              onResize={(e, dir, ref, delta, pos) => {
    const newWidth = parseFloat(ref.style.width);
    const newHeight = parseFloat(ref.style.height);
    setScale({
      x: newWidth / baseWidth,
      y: newHeight / baseHeight,
    });
  }}
  onDragStop={(e, d) => setGroupPos({ x: d.x, y: d.y })}
>
              <div className="flex flex-col gap-2 w-full h-full overflow-auto">
                {users.map((u) => (
                  <SignatureBlock key={u.id} fio={u.fio} preview />
                ))}
              </div>
            </Rnd>
          </div>
        </div>

        {/* кнопки масштабирования */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          <button
            onClick={() => setScale((s) => s * 1.1)}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            +
          </button>
          <button
            onClick={() => setScale((s) => s / 1.1)}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            –
          </button>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => onSave({ groupPos, scale })}
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
          >
            Сохранить схему
          </button>
        </div>
      </div>
    </div>
  );
}
