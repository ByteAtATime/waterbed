import type { Prettify } from "./utils";

export type FieldType =
  | "text"
  | "number"
  | "boolean"
  | "attachment"
  | "multipleAttachments";

export type FieldDefinition<T extends FieldType = FieldType> = {
  _type: T;
  airtableFieldName: string;
};

type Thumbnail = {
  url: string;
  width: number;
  height: number;
};

type Thumbnails = {
  small?: Thumbnail;
  large?: Thumbnail;
  full?: Thumbnail;
};

type Attachment = {
  id: string;
  url: string;
  filename: string;
  size: number;
  type: string;
  width?: number;
  height?: number;
  thumbnails?: Thumbnails;
};

type FieldTypeMap = {
  text: string;
  number: number;
  boolean: boolean;
  attachment: Prettify<Attachment>;
  multipleAttachments: Prettify<Attachment>[];
};

type InferFieldType<T extends FieldType> = T extends keyof FieldTypeMap
  ? FieldTypeMap[T]
  : never;

export const tableNameSymbol = Symbol("tableName");

export type AirtableTableDef = Record<
  string,
  FieldDefinition<FieldType> | Record<string, string>
>;
export type AirtableTable = AirtableTableDef & { [tableNameSymbol]: string };

type FieldsOf<T extends AirtableTableDef> = {
  [K in keyof T as T[K] extends FieldDefinition ? K : never]: T[K];
};

type GetFieldDefType<F> = F extends FieldDefinition<infer U> ? U : never;

export type InferSelectModel<T extends AirtableTableDef> = {
  id: string;
} & {
  [K in keyof FieldsOf<T>]+?: InferFieldType<GetFieldDefType<FieldsOf<T>[K]>>;
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

export const attachment = (
  airtableFieldName: string
): FieldDefinition<"attachment"> => ({
  _type: "attachment",
  airtableFieldName,
});

export const multipleAttachments = (
  airtableFieldName: string
): FieldDefinition<"multipleAttachments"> => ({
  _type: "multipleAttachments",
  airtableFieldName,
});

export const table = <T extends AirtableTableDef>(
  airtableTableName: string,
  columns: T
): T & { [tableNameSymbol]: string } => {
  return {
    ...columns,
    [tableNameSymbol]: airtableTableName,
  };
};
