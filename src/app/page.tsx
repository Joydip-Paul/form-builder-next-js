// "use client";
// import raw from './data/form.json'
// import { fromDorik } from '@/lib/dorik'; 
// import Field from '@/components/Field';
// import { useState } from 'react';
// import FormPreview from '@/components/FormPreview';
// export default function Home() {

//     const [preview, setPreview] = useState(false);
//   const fields = fromDorik(raw);

//   return (
//   <>
//      <main className="main">
//       <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
//         <h2>{preview ? "Preview" : "Builder (read-only)"} </h2>
//         <button
//           onClick={() => setPreview(p => !p)}
//           style={{padding:'8px 12px', borderRadius:8, border:'1px solid #2a3158', background:'#151a2e', color:'#e7e9f3'}}
//         >
//           {preview ? "Back to Edit" : "Preview"}
//         </button>
//       </div>

//       {!preview && (
//         <div className="grid">
//           {fields.map(f => <Field key={f.id} field={f} />)}
//         </div>
//       )}

//            {!preview ? (
//         <div className="grid">
//           {fields.map(f => <Field key={f.id} field={f} />)}
//         </div>
//       ) : (
//         <FormPreview fields={fields} successMessage={(raw as any).successMessage} />
//       )}
//     </main>
//   </>
//   );
// }

"use client";

import { useMemo, useState } from "react";
import raw from "./data/form.json";
import { fromDorik } from "../lib/dorik";
import BuilderItem from "../components/BuilderItem";
import FormPreview from "../components/FormPreview";
// import SettingsSidebar from "../components/SettingsSidebar";
import type { FormField } from "../types/form";

// NEW imports:
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";

const uid = () => Math.random().toString(36).slice(2, 10);

export default function Home() {
  const initial = useMemo(() => fromDorik(raw), []);
  console.log("GIVEN JSON",initial);
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

  const handleSettings = (id: string) => setSelectedId(id);

  const handlePatch = (id: string, patch: Partial<FormField>) => {
    setFields(prev => prev.map(f => (f.id === id ? { ...f, ...patch } : f)));
  };


  // Drag and Drop code
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

  // const selectedField = fields.find(f => f.id === selectedId) || null;

  return (
    <main className="main">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>{preview ? "Preview" : "Builder (with actions & settings)"}</h2>
        <div style={{display:'flex', gap:8}}>
          <button onClick={() => setPreview(p => !p)} style={{padding:'8px 12px', borderRadius:8, border:'1px solid #2a3158', background:'#151a2e', color:'#e7e9f3'}}>
            {preview ? "Back to Edit" : "Preview"}
          </button>
          <button onClick={() => { setFields(initial); setSelectedId(null); }} style={{padding:'8px 12px', borderRadius:8, border:'1px solid #2a3158', background:'#151a2e', color:'#e7e9f3'}}>
            Reset
          </button>
        </div>
      </div>

      {!preview ? (
        // NEW: DnD wrappers
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
            <div className="grid">
              {fields.map(f => (
                <BuilderItem
                  key={f.id}
                  field={f}
                  onSettings={handleSettings}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <FormPreview fields={fields} successMessage={(raw as any).successMessage} />
      )}

      {/* <SettingsSidebar field={selectedField} onClose={() => setSelectedId(null)} onPatch={handlePatch} /> */}
    </main>
  );
}
