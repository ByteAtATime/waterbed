export type FieldType = "text" | "number" | "boolean";

export type FieldDefinition<T extends FieldType> = {
  _type: T;
  airtableFieldName: string;
};

export const text = (airtableFieldName: string): FieldDefinition<"text"> => ({
  _type: "text",
  airtableFieldName,
});

export const number = (
  airtableFieldName: string
): FieldDefinition<"number"> => ({
  _type: "number",
  airtableFieldName,
});

export const boolean = (
  airtableFieldName: string
): FieldDefinition<"boolean"> => ({
  _type: "boolean",
  airtableFieldName,
});

export const createAirtableSchema = <T extends Record<string, any>>(
  schema: T
): T => {
  return schema;
};
