import type Airtable from "airtable";
import type { WrappedFormula } from "./formulas";
import {
  type AirtableTable,
  type FieldDefinition,
  type FieldType,
  type InferSelectModel,
  tableNameSymbol,
} from "./schema";

export class SelectQuery<T extends AirtableTable>
  implements PromiseLike<InferSelectModel<T>[]>
{
  private _filterByFormula: string | null = null;

  constructor(private base: Airtable.Base, private table: T) {}

  public filter(filterFormula: WrappedFormula | string): this {
    this._filterByFormula =
      typeof filterFormula === "object"
        ? filterFormula._formula
        : filterFormula;
    return this;
  }

  private async execute(): Promise<InferSelectModel<T>[]> {
    // Use the symbol to get the table name
    const tableName = this.table[tableNameSymbol];

    const query = this.base(tableName).select({
      filterByFormula: this._filterByFormula ?? undefined,
    });

    const records = await query.all();
    const table = this.table;

    return records.map((record) => {
      const { [tableNameSymbol]: _, ...fields } = table;
      const result: { [key: string]: any } = { id: record.id };

      for (const key in fields) {
        const fieldDef = fields[
          key as keyof typeof fields
        ] as FieldDefinition<FieldType>;

        result[key] = record.get(fieldDef.airtableFieldName);
      }

      return result as InferSelectModel<T>;
    });
  }

  public then<TResult1 = InferSelectModel<T>[], TResult2 = never>(
    onfulfilled?:
      | ((value: InferSelectModel<T>[]) => TResult1 | PromiseLike<TResult1>)
      | undefined
      | null,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | undefined
      | null
  ): PromiseLike<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }
}

export class SelectQueryBuilder {
  constructor(private base: Airtable.Base) {}

  public from<T extends AirtableTable>(table: T): SelectQuery<T> {
    return new SelectQuery(this.base, table);
  }
}
