"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormField, FieldTypes } from "../types/form";

type FormValues = Record<string, unknown>;

type Props = {
  fields: FormField[];
  successMessage?: string;
};

export default function FormPreview({ fields, successMessage }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [lastData, setLastData] = useState<Record<string, unknown> | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
  } = useForm<FormValues>({ mode: "onChange" });

//   JSON
  function prepareForExport(data: FormValues): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data)) {
      if (typeof File !== "undefined" && v instanceof FileList) {
        const f = v[0];
        out[k] = f ? { name: f.name, size: f.size, type: f.type } : null;
      } else if (typeof File !== "undefined" && v instanceof File) {
        out[k] = { name: v.name, size: v.size, type: v.type };
      } else {
        out[k] = v;
      }
    }
    return out;
  }

  const onSubmit = (data: FormValues) => {
    const cleaned = prepareForExport(data);
    setLastData(cleaned);
    setSubmitted(true);

    setTimeout(() => setSubmitted(false), 3000);
  };

  const hasError = (n: string) => Object.prototype.hasOwnProperty.call(errors, n);
  const messageFor = (n: string): string | undefined => {
    const e = (errors as Record<string, unknown>)[n];
    if (!e || typeof e !== "object") return;
    const msg = (e as { message?: unknown }).message;
    return typeof msg === "string" ? msg : undefined;
  };

  const handleExport = () => {
    if (!lastData) return;
    const blob = new Blob([JSON.stringify(lastData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dorik-form-builder.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid-form">
        {fields.map((field) => {
          const req = !!field.required;
          const name = field.name;

          return (
            <div key={field.id} className="field-card">
              {field.type !== FieldTypes.ACCEPTANCE && (
                <label className="label">
                  {field.label} {req ? <span className="req">*</span> : null}
                </label>
              )}

              {field.type === FieldTypes.TEXT && (
                <input className="input" placeholder={field.placeholder || ""} {...register(name, { required: req })} />
              )}

              {field.type === FieldTypes.EMAIL && (
                <input className="input" type="email" placeholder={field.placeholder || ""} {...register(name, { required: req })} />
              )}

              {field.type === FieldTypes.DATE && (
                <input className="input" type="date" {...register(name, { required: req })} />
              )}

              {field.type === FieldTypes.TIME && (
                <input className="input" type="time" {...register(name, { required: req })} />
              )}

              {field.type === FieldTypes.SELECT && (
                <select className="input" defaultValue="" {...register(name, { required: req })}>
                  <option value="" disabled>{field.placeholder || "— Select —"}</option>
                  {(field.options ?? []).map((o) => (
                    <option key={o.key} value={o.key}>{o.label}</option>
                  ))}
                </select>
              )}

              {field.type === FieldTypes.RADIO && (
                <div className="group">
                  {(field.options ?? []).map((o) => (
                    <label key={o.key} className="check">
                      <input type="radio" value={o.key} {...register(name, { required: req })} /> {o.label}
                    </label>
                  ))}
                </div>
              )}

              {field.type === FieldTypes.CHECKBOX && (
                <div className="group">
                  {(field.options ?? []).map((o, i) => (
                    <label key={o.key} className="check">
                      <input
                        type="checkbox"
                        value={o.key}
                        {...register(
                          name,
                          i === 0
                            ? {
                                validate: (v) => {
                                  if (!req) return true;
                                  return (Array.isArray(v) && v.length > 0) || "Pick at least one option.";
                                },
                              }
                            : undefined
                        )}
                      />{" "}
                      {o.label}
                    </label>
                  ))}
                </div>
              )}

              {field.type === FieldTypes.FILE && (
                <input className="input" type="file" {...register(name, { required: req })} />
              )}

              {field.type === FieldTypes.ACCEPTANCE && (
                <label className="check">
                  <input type="checkbox" {...register(name, { required: true })} /> {field.label}
                </label>
              )}

              {hasError(name) && (
                <div className="error">{messageFor(name) || "This field is required."}</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="submit-action">
        <button type="button" className="main-btn" onClick={handleExport} disabled={!lastData}>
          Export JSON
        </button>

        <button
          type="button"
          onClick={() => {
            reset();
            setSubmitted(false);
            setLastData(null);
          }}
          className="main-btn"
        >
          Reset
        </button>

        <button type="submit" className="main-btn fill" disabled={!isValid || isSubmitting}>
          Submit
        </button>
      </div>

      {submitted && (
        <div
          style={{
            gridColumn: "1 / -1",
            marginTop: 8,
            padding: 10,
            borderRadius: 10,
            border: "1px solid #1f7a4a",
            background: "#0f2d1f",
            color: "#d9ffea",
          }}
        >
          {successMessage || "Form submitted successfully!"}
        </div>
      )}
    </form>
  );
}
