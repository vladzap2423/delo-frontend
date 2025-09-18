"use client";

import { useState, useRef } from "react";
import { Rnd } from "react-rnd";
import PdfMod
import SignatureBlock from "./SignatureBlock";

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
  const [groupPos, setGroupPos] = useState({ x: 100, y: 100 });
  const blockWidth = 510;
  const blockHeight = 60;

  const slotsRef = useRef<Slot[]>(
    users.map((u, idx) => ({
      userId: u.id,
      page: 1,
      x: groupPos.x,
      y: groupPos.y + idx * (blockHeight + 10),
      width: blockWidth,
      height: blockHeight,
    }))
  );

  const overlay = (
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
      <div className="flex flex-col gap-2 pointer-events-auto">
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
  );

  return (
    <PdfModal
      fileUrl={fileUrl}
      onClose={onClose}
      title="Схема подписей"
      overlay={
        <>
          {overlay}
          <div className="absolute bottom-4 right-4">
            <button
              onClick={() => onSave(slotsRef.current)}
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 pointer-events-auto"
            >
              Сохранить схему
            </button>
          </div>
        </>
      }
    />
  );
}
