import { FieldTypes, FormField } from "@/types/form";

export default function Field({ field }: { field: FormField }) {
  return (
    <div className="field-card" style={{ gridColumn: `span ${field.columnWidth ?? 12}` }}>
      {field.type !== FieldTypes.ACCEPTANCE && (
        <label className="label builder-label">
          {field.label} {field.required ? <span className="req">*</span> : null}
        </label>
      )}

      {field.type === FieldTypes.TEXT && (
        <input className="input" placeholder={field.placeholder || ""} disabled />
      )}

      {field.type === FieldTypes.EMAIL && (
        <input className="input" type="email" placeholder={field.placeholder || ""} disabled />
      )}

      {field.type === FieldTypes.DATE && (
        <input className="input" type="date" disabled />
      )}

      {field.type === FieldTypes.TIME && (
        <input className="input" type="time" disabled />
      )}

      {field.type === FieldTypes.SELECT && (
        <select className="input" disabled defaultValue="">
          <option value="" disabled>
            {field.placeholder || "— Select —"}
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

      {!(
        field.type === FieldTypes.TEXT ||
        field.type === FieldTypes.EMAIL ||
        field.type === FieldTypes.DATE ||
        field.type === FieldTypes.TIME ||
        field.type === FieldTypes.SELECT ||
        field.type === FieldTypes.CHECKBOX ||
        field.type === FieldTypes.RADIO ||
        field.type === FieldTypes.FILE ||
        field.type === FieldTypes.ACCEPTANCE
      ) && (
        <input className="input" placeholder={field.placeholder || ""} disabled />
      )}

      {field.type === FieldTypes.ACCEPTANCE && (
        <label className="check">
          <input type="checkbox" disabled /> {field.label}
        </label>
      )}
    </div>
  );
}
