"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormField, FieldTypes } from "../types/form";

type Props = {
  fields: FormField[];
  successMessage?: string;
};

export default function FormPreview({ fields, successMessage }: Props) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = (data: any) => {
    console.log("Form data:", data);
    setSubmitted(true);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid"
      style={{ rowGap: 12 }}
    >
      {fields.map((field) => {
        const req = !!field.required;
        const name = field.name;

        return (
          <div
            key={field.id}
            className="field-card"
            style={{ gridColumn: `span ${field.columnWidth ?? 12}` }}
          >
            {field.type !== FieldTypes.ACCEPTANCE && (
              <label className="label">
                {field.label} {req ? <span className="req">*</span> : null}
              </label>
            )}

            {field.type === FieldTypes.TEXT && (
              <input
                className="input"
                placeholder={field.placeholder || ""}
                {...register(name, { required: req })}
              />
            )}

            {field.type === FieldTypes.EMAIL && (
              <input
                className="input"
                type="email"
                placeholder={field.placeholder || ""}
                {...register(name, { required: req })}
              />
            )}

            {field.type === FieldTypes.DATE && (
              <input
                className="input"
                type="date"
                {...register(name, { required: req })}
              />
            )}

            {field.type === FieldTypes.TIME && (
              <input
                className="input"
                type="time"
                {...register(name, { required: req })}
              />
            )}

            {field.type === FieldTypes.SELECT && (
              <select
                className="input"
                defaultValue=""
                {...register(name, { required: req })}
              >
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

            {field.type === FieldTypes.RADIO && (
              <div className="group">
                {(field.options ?? []).map((o) => (
                  <label key={o.key} className="check">
                    <input
                      type="radio"
                      value={o.key}
                      {...register(name, { required: req })}
                    />{" "}
                    {o.label}
                  </label>
                ))}
              </div>
            )}

            {field.type === FieldTypes.ACCEPTANCE && (
              <label className="check">
                <input
                  type="checkbox"
                  {...register(name, { required: true })}
                />{" "}
                {field.label}
              </label>
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
                                return (
                                  (Array.isArray(v) && v.length > 0) ||
                                  "Pick at least one option."
                                );
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
              <input
                className="input"
                type="file"
                {...register(name, { required: req })}
              />
            )}

            {(errors as any)[name] && (
              <div className="error">This field is required.</div>
            )}
          </div>
        );
      })}

      <div
        style={{
          gridColumn: "1 / -1",
          display: "flex",
          gap: 8,
          justifyContent: "flex-end",
        }}
      >
        <button
          type="button"
          onClick={() => {
            reset();
            setSubmitted(false);
          }}
          className="btn"
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            background: "#151a2e",
            color: "var(--text)",
          }}
        >
          Reset
        </button>
        <button
          type="submit"
          className="btn"
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #3b4ea3",
            background: "#2a3d85",
            color: "var(--text)",
          }}
        >
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
