"use client";

import { useMemo, useState } from "react";
import raw from "./data/form.json";
import { fromDorik } from "../lib/dorik";
import BuilderItem from "../components/BuilderItem";
import FormPreview from "../components/FormPreview";
import type { FormField } from "../types/form";

import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";

type JsonMeta = { successMessage?: string };

const uid = () => Math.random().toString(36).slice(2, 10);

export default function Home() {
  const initial = useMemo(() => fromDorik(raw), []);
  const meta: JsonMeta = raw as JsonMeta;

  const [fields, setFields] = useState<FormField[]>(initial);
  const [preview, setPreview] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleDuplicate = (id: string) => {
    setFields(prev => {
      const idx = prev.findIndex(f => f.id === id);
      if (idx === -1) return prev;
      const copy: FormField = { ...prev[idx], id: uid(), name: `${prev[idx].name}_${Math.floor(Math.random()*100)}` };
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
  };

  // const handleSettings = (id: string) => setSelectedId(id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setFields(prev => {
      const oldIndex = prev.findIndex(f => f.id === active.id);
      const newIndex = prev.findIndex(f => f.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <main className="main">
      <div className="builder-header">
        <h2 className="heading-title">{preview ? "Preview" : "Dorik Form Builder"}</h2>
        <div style={{display:'flex', gap:8}}>
          <button onClick={() => setPreview(p => !p)} className="main-btn">
            {preview ? "Back to Edit" : "Preview"}
          </button>
          <button onClick={() => { setFields(initial); setSelectedId(null); }} className="main-btn">
            Reset
          </button>
        </div>
      </div>

      {!preview ? (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
            <div className="grid">
              {fields.map(f => (
                <BuilderItem
                  key={f.id}
                  field={f}
                  // onSettings={handleSettings}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <FormPreview fields={fields} successMessage={meta.successMessage} />
      )}
    </main>
  );
}
