"use client";

import Field from "../components/Field";
import type { FormField } from "../types/form";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Props = {
  field: FormField;
  onSettings: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function BuilderItem({ field, onSettings, onDuplicate, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: field.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    gridColumn: `span ${field.columnWidth ?? 12}`,
  };

  return (
    <div ref={setNodeRef} className="item-wrap" style={style}>
      <button className="drag-handle" title="Drag" {...attributes} {...listeners}>⋮⋮</button>

      <Field field={field} />

      <div className="actions">
        <button className="icon" title="Settings" onClick={() => onSettings(field.id)}>⚙</button>
        <button className="icon" title="Duplicate" onClick={() => onDuplicate(field.id)}>⎘</button>
        <button className="icon danger" title="Delete" onClick={() => onDelete(field.id)}>✕</button>
      </div>
    </div>
  );
}
