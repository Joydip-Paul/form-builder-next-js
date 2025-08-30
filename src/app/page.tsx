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
import type { FormField } from "../types/form";

const uid = () => Math.random().toString(36).slice(2, 10);

export default function Home() {
  const initial = useMemo(() => fromDorik(raw), []);
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

  const handleSettings = (id: string) => {
    setSelectedId(id);
    console.log("ID", id);
  };

  return (
    <main className="main">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>{preview ? "Preview" : "Builder (read-only + actions)"}</h2>
        <div style={{display:'flex', gap:8}}>
          <button
            onClick={() => setPreview(p => !p)}
            style={{padding:'8px 12px', borderRadius:8, border:'1px solid #2a3158', background:'#151a2e', color:'#e7e9f3'}}
          >
            {preview ? "Back to Edit" : "Preview"}
          </button>
          <button
            onClick={() => setFields(initial)}
            title="Reset to original JSON"
            style={{padding:'8px 12px', borderRadius:8, border:'1px solid #2a3158', background:'#151a2e', color:'#e7e9f3'}}
          >
            Reset
          </button>
        </div>
      </div>

      {!preview ? (
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
      ) : (
        <FormPreview fields={fields} successMessage={(raw as any).successMessage} />
      )}
    </main>
  );
}
