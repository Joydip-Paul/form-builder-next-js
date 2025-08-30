export const FieldTypes = {
  TEXT: 'text',
  EMAIL: 'email',
  DATE: 'date',
  TIME: 'time',
  FILE: 'file',
  SELECT: 'select',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  ACCEPTANCE: 'acceptance',
} as const;

export type FieldType = typeof FieldTypes[keyof typeof FieldTypes];

export type FieldOption = { key: string; label: string };

export type FormField = {
  id: string;
  type: FieldType;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  columnWidth?: number;
  options?: FieldOption[];
};
