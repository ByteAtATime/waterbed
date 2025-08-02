import type { FieldDefinition } from "./schema";

export type WrappedFormula = { _formula: string };

type FormulaChunk = FieldDefinition | WrappedFormula | string | number;

export function formula(
  strings: TemplateStringsArray,
  ...params: FormulaChunk[]
): WrappedFormula {
  const queryChunks: (string | number)[] = [];

  const processChunk = (chunk: FormulaChunk) => {
    if (typeof chunk === "object" && "_type" in chunk) {
      queryChunks.push(`{${chunk.airtableFieldName}}`);
    } else if (typeof chunk === "object" && "_formula" in chunk) {
      queryChunks.push(chunk._formula);
    } else if (typeof chunk === "string") {
      queryChunks.push(`'${chunk}'`);
    } else {
      queryChunks.push(chunk);
    }
  };

  strings.forEach((str, i) => {
    queryChunks.push(str);
    if (i < params.length) {
      processChunk(params[i]!);
    }
  });

  return { _formula: queryChunks.join("") };
}

export const eq = (left: FormulaChunk, right: FormulaChunk): WrappedFormula =>
  formula`(${left} = ${right})`;

export const and = (left: FormulaChunk, right: FormulaChunk): WrappedFormula =>
  formula`AND(${left}, ${right})`;
