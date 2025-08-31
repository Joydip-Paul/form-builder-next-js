import { FormField, FieldType, FieldTypes } from '../types/form';

type DorikField = {
  id?: string;
  type?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  columnWidth?: string | number;
  options?: string[];
  content?: string;
};

type DorikPayload = { fields?: DorikField[] };

const uid = () => Math.random().toString(36).slice(2, 10);

const stripHtml = (html: unknown) =>
  String(html ?? '').replace(/<[^>]*>/g, '').trim();

const percentToCols = (value: unknown) => {
  if (typeof value === 'number') return Math.min(12, Math.max(1, Math.round(value)));
  const m = String(value ?? '100%').match(/([0-9]+(?:\.[0-9]+)?)\s*%/);
  const pct = m ? parseFloat(m[1]) : 100;
  const cols = Math.round((pct / 100) * 12) || 12;
  return Math.min(12, Math.max(1, cols));
};

const normalizeName = (input: unknown) =>
  (String(input ?? '').trim().toLowerCase().replace(/[^a-z0-9_]+/g, '_') || 'field');

const parseLabelEqValue = (str: string) => {
  const eq = str.indexOf('=');
  const label = (eq >= 0 ? str.slice(0, eq) : str).trim();
  const rhs = (eq >= 0 ? str.slice(eq + 1) : label).trim();
  const key = rhs.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'option';
  return { key, label };
};

export function fromDorik(payload: unknown): FormField[] {
  const p = (payload as DorikPayload) ?? {};
  const list: DorikField[] = Array.isArray(p.fields) ? p.fields : [];

  return list.map((f) => {
    const type = (f.type || FieldTypes.TEXT) as FieldType;
    const id = String(f.id || uid());

    const field: FormField = {
      id,
      type,
      label:
        type === FieldTypes.ACCEPTANCE
          ? stripHtml(f.content) || f.label || 'I accept the terms'
          : f.label || f.name || (type as string),
      name: normalizeName(f.name || `${type}_${id.slice(-4)}`),
      placeholder: f.placeholder,
      required: !!f.required,
      columnWidth: percentToCols(f.columnWidth ?? '100%'),
    };

    if (type === FieldTypes.SELECT || type === FieldTypes.CHECKBOX || type === FieldTypes.RADIO) {
      const raw = Array.isArray(f.options) ? f.options : [];
      field.options = raw.map(parseLabelEqValue);
    }

    if (type === FieldTypes.ACCEPTANCE) delete field.placeholder;

    return field;
  });
}
