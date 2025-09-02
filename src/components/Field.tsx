import { FieldTypes, FormField } from '@/types/form';

export default function Field({ field }: { field: FormField }) {
  return (
    <div className="field-card" style={{ gridColumn: `span ${field.columnWidth ?? 12}` }}>
      {field.type !== 'acceptance' && (
        <label className="label builder-label">
          {field.label} {field.required ? <span className="req">*</span> : null}
        </label>
      )}

      {field.type === 'text' && (
        <input className="input" placeholder={field.placeholder || ''} disabled />
      )}
      {field.type === 'email' && (
        <input className="input" type="email" placeholder={field.placeholder || ''} disabled />
      )}
      {field.type === 'acceptance' && (
        <label className="check">
          <input type="checkbox" disabled /> {field.label}
        </label>
      )}

{field.type === FieldTypes.SELECT && (
  <select className="input mb-3" disabled defaultValue="">
    <option value="" disabled>
      {field.placeholder || '— Select —'}
    </option>
    {(field.options ?? []).map((o) => (
      <option key={o.key} value={o.key}>
        {o.label}
      </option>
    ))}
  </select>
)}

{field.type === FieldTypes.CHECKBOX && (
  <div className="group">
    {(field.options ?? []).map((o) => (
      <label key={o.key} className="check">
        <input type="checkbox" disabled /> {o.label}
      </label>
    ))}
  </div>
)}

{field.type === FieldTypes.RADIO && (
  <div className="group">
    {(field.options ?? []).map((o) => (
      <label key={o.key} className="check">
        <input type="radio" name={field.id} disabled /> {o.label}
      </label>
    ))}
  </div>
)}


{field.type === FieldTypes.FILE && (
  <input className="input" type="file" disabled />
)}



{/* FALBACK */}
      {!(field.type === 'text' || field.type === 'email' || field.type === 'acceptance') && (
        <input className="input" placeholder={field.placeholder || ''} disabled />
      )}
    </div>
  );
}
