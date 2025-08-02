import type { FieldDefinition } from "./schema";

export type WrappedFormula = { _formula: string };

export type FormulaChunk = FieldDefinition | WrappedFormula | string | number;

function stringifyChunk(chunk: FormulaChunk): string {
  if (typeof chunk === "object") {
    if ("_type" in chunk) {
      return `{${chunk.airtableFieldName}}`;
    }
    if ("_formula" in chunk) {
      return chunk._formula;
    }
  }
  if (typeof chunk === "string") {
    return `'${chunk}'`;
  }
  return String(chunk);
}

function formula(
  strings: TemplateStringsArray,
  ...params: FormulaChunk[]
): WrappedFormula {
  let result = strings[0]!;
  for (let i = 0; i < params.length; i++) {
    result += stringifyChunk(params[i]!);
    result += strings[i + 1]!;
  }
  return { _formula: result };
}

const createVariadicFn =
  (name: string) =>
  (...chunks: FormulaChunk[]): WrappedFormula => {
    const inner = chunks.map(stringifyChunk).join(", ");
    return { _formula: `${name}(${inner})` };
  };

export const and = createVariadicFn("AND");
export const or = createVariadicFn("OR");
export const concatenate = createVariadicFn("CONCATENATE");
export const sum = createVariadicFn("SUM");
export const average = createVariadicFn("AVERAGE");
export const min = createVariadicFn("MIN");
export const max = createVariadicFn("MAX");

export const eq = (left: FormulaChunk, right: FormulaChunk): WrappedFormula =>
  formula`(${left} = ${right})`;
export const neq = (left: FormulaChunk, right: FormulaChunk): WrappedFormula =>
  formula`(${left} != ${right})`;
export const gt = (left: FormulaChunk, right: FormulaChunk): WrappedFormula =>
  formula`(${left} > ${right})`;
export const gte = (left: FormulaChunk, right: FormulaChunk): WrappedFormula =>
  formula`(${left} >= ${right})`;
export const lt = (left: FormulaChunk, right: FormulaChunk): WrappedFormula =>
  formula`(${left} < ${right})`;
export const lte = (left: FormulaChunk, right: FormulaChunk): WrappedFormula =>
  formula`(${left} <= ${right})`;

export const not = (expression: FormulaChunk): WrappedFormula =>
  formula`NOT(${expression})`;

export const ifs = (
  condition: FormulaChunk,
  ifTrue: FormulaChunk,
  ifFalse: FormulaChunk
): WrappedFormula => formula`IF(${condition}, ${ifTrue}, ${ifFalse})`;

export const blank = (): WrappedFormula => ({ _formula: "BLANK()" });
export const error = (): WrappedFormula => ({ _formula: "ERROR()" });

export const lower = (text: FormulaChunk): WrappedFormula =>
  formula`LOWER(${text})`;
export const upper = (text: FormulaChunk): WrappedFormula =>
  formula`UPPER(${text})`;
export const trim = (text: FormulaChunk): WrappedFormula =>
  formula`TRIM(${text})`;
export const len = (text: FormulaChunk): WrappedFormula =>
  formula`LEN(${text})`;
