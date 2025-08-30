"use client";

import Field from "../components/Field";
import type { FormField } from "../types/form";

type Props = {
  field: FormField;
  onSettings: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function BuilderItem({ field, onSettings, onDuplicate, onDelete }: Props) {
  return (
    <div className="item-wrap" style={{ gridColumn: `span ${field.columnWidth ?? 12}` }}>
      <Field field={field} />

      <div className="actions">
        <button className="icon" title="Settings" onClick={() => onSettings(field.id)}>⚙</button>
        <button className="icon" title="Duplicate" onClick={() => onDuplicate(field.id)}>⎘</button>
        <button className="icon danger" title="Delete" onClick={() => onDelete(field.id)}>✕</button>
      </div>
    </div>
  );
}
