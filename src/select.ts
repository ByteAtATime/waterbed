import type Airtable from "airtable";
import type { WrappedFormula } from "./formulas";
import {
  type AirtableTable,
  type FieldDefinition,
  type FieldType,
  type InferPartialSelectModel,
  type InferSelectModel,
  tableNameSymbol,
} from "./schema";
import type { Prettify } from "./utils";
import type { OrderByCondition } from "./sort";

export type FieldsSelection = Record<string, FieldDefinition>;

type SelectResult<
  TTable extends AirtableTable,
  TSelection extends FieldsSelection | undefined
> = TSelection extends FieldsSelection
  ? InferPartialSelectModel<TSelection>
  : InferSelectModel<TTable>;

export class SelectQuery<
  TTable extends AirtableTable,
  TSelection extends FieldsSelection | undefined
> implements PromiseLike<Prettify<SelectResult<TTable, TSelection>>[]>
{
  private _filterByFormula: string | null = null;
  private _sorts: OrderByCondition[] = [];
  private _view: string | null = null;

  constructor(
    private base: Airtable.Base,
    private table: TTable,
    private fields?: TSelection
  ) {}

  public filter(filterFormula: WrappedFormula | string): this {
    this._filterByFormula =
      typeof filterFormula === "object"
        ? filterFormula._formula
        : filterFormula;
    return this;
  }

  public orderBy(...sorts: OrderByCondition[]): this {
    this._sorts.push(...sorts);
    return this;
  }

  public view(viewName: string): this {
    this._view = viewName;
    return this;
  }

  private async execute(): Promise<
    Prettify<SelectResult<TTable, TSelection>>[]
  > {
    const tableName = this.table[tableNameSymbol];

    const { [tableNameSymbol]: _, ...schemaFields } = this.table;
    const selection = this.fields ?? schemaFields;

    const airtableSorts = this._sorts.map((s) => ({
      field: s._field.airtableFieldName,
      direction: s._direction,
    }));

    const fieldsToSelectInAirtable = Object.values(selection).map(
      (fieldDef: any) => fieldDef.airtableFieldName
    );

    const query = this.base(tableName).select({
      ...(this._filterByFormula
        ? { filterByFormula: this._filterByFormula }
        : undefined),
      ...(airtableSorts.length > 0 ? { sort: airtableSorts } : undefined),
      fields:
        fieldsToSelectInAirtable.length > 0
          ? fieldsToSelectInAirtable
          : undefined,
      ...(this._view ? { view: this._view } : undefined),
    });

    const records = await query.all();

    return records.map((record) => {
      const result: { [key: string]: any } = { id: record.id };
      const fieldsToMap = this.fields ?? schemaFields;

      for (const key in fieldsToMap) {
        const fieldDef = (fieldsToMap as any)[
          key
        ] as FieldDefinition<FieldType>;
        result[key] = record.get(fieldDef.airtableFieldName);
      }

      return result as Prettify<SelectResult<TTable, TSelection>>;
    });
  }

  public then<
    TResult1 = Prettify<SelectResult<TTable, TSelection>>[],
    TResult2 = never
  >(
    onfulfilled?:
      | ((
          value: Prettify<SelectResult<TTable, TSelection>>[]
        ) => TResult1 | PromiseLike<TResult1>)
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

export class SelectQueryBuilder<
  TSelection extends FieldsSelection | undefined
> {
  constructor(private base: Airtable.Base, private fields?: TSelection) {}

  public from<TTable extends AirtableTable>(
    table: TTable
  ): SelectQuery<TTable, TSelection> {
    return new SelectQuery(this.base, table, this.fields);
  }
}
