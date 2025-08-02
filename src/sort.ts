import type { FieldDefinition } from "./schema";

export type OrderByCondition = {
  _field: FieldDefinition;
  _direction: "asc" | "desc";
};

export const asc = (field: FieldDefinition): OrderByCondition => ({
  _field: field,
  _direction: "asc",
});

export const desc = (field: FieldDefinition): OrderByCondition => ({
  _field: field,
  _direction: "desc",
});
