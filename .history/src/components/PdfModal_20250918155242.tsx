"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useState } from "react";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface PdfModalProps {
  fileUrl: string;
  onClose: () => void;
  title?: string;
  overlay?: React.ReactNode; // ⬅️ сюда можно передать подписи или что угодно
}

export default function PdfModal({ fileUrl, onClose, title = "Просмотр документа", overlay }: PdfModalProps) {
  const [numPages, setNumPages] = useState<number | null>(null);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-100 rounded-lg shadow-lg p-4 relative w-[70%] h-[95%] flex flex-col">
        {/* кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
        >
          ✕
        </button>

        <h2 className="text-lg font-bold mb-2">{title}</h2>

        {/* PDF */}
        <div className="flex-1 overflow-y-auto relative">
          <Document file={fileUrl} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
            {Array.from(new Array(numPages), (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                width={800}
              />
            ))}
          </Document>

          {/* ⬅️ сюда можно рисовать кастомный оверлей */}
          {overlay && <div className="absolute inset-0 pointer-events-none">{overlay}</div>}
        </div>
      </div>
    </div>
  );
}
