"use client";

import Image from "next/image";
import Field from "../components/Field";
import type { FormField } from "../types/form";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  field: FormField;
  //   onSettings: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function BuilderItem({ field, onDuplicate, onDelete }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  return (
    <div
      ref={setNodeRef}
      className={`item-wrap ${isDragging ? "dragging" : ""} col-${
        field.columnWidth ?? 12
      }`}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <button
        className="drag-handle"
        title="Drag"
        {...attributes}
        {...listeners}
      >
        ⋮⋮
      </button>

      <Field field={field} />

      <div className="actions">
          <button
            className="icon"
            title="Duplicate"
            onClick={() => onDuplicate(field.id)}
          >
            <Image src="/img/copy.svg" alt="Duplicate" width={20} height={20} />
          </button>
        <button
          className="icon danger"
          title="Delete"
          onClick={() => onDelete(field.id)}
        >
          <Image src="/img/close.svg" alt="Duplicate" width={20} height={20} />
        </button>
      </div>
    </div>
  );
}
