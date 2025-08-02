export type FieldType = "text" | "number" | "boolean";

export type FieldDefinition<T extends FieldType = FieldType> = {
  _type: T;
  airtableFieldName: string;
};

type FieldTypeMap = {
  text: string;
  number: number;
  boolean: boolean;
};

type InferFieldType<T extends FieldType> = T extends keyof FieldTypeMap
  ? FieldTypeMap[T]
  : never;

export const tableNameSymbol = Symbol("tableName");

export type AirtableTableDef = Record<string, FieldDefinition<FieldType>>;
export type AirtableTable = AirtableTableDef & { [tableNameSymbol]: string };

export type InferSelectModel<T extends AirtableTableDef> = {
  id: string;
} & {
  [K in Extract<keyof T, string>]+?: InferFieldType<T[K]["_type"]>;
};

export type InferPartialSelectModel<
  TSelection extends Record<string, FieldDefinition>
> = {
  id: string;
} & {
  [K in keyof TSelection]+?: InferFieldType<TSelection[K]["_type"]>;
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

export const createAirtableSchema = <
  T extends Record<string, AirtableTableDef>
>(
  schema: T
): { [K in keyof T]: T[K] & { [tableNameSymbol]: K & string } } => {
  const result: any = {};
  for (const tableName in schema) {
    if (Object.prototype.hasOwnProperty.call(schema, tableName)) {
      result[tableName] = {
        ...schema[tableName],
        [tableNameSymbol]: tableName,
      };
    }
  }
  return result;
};
