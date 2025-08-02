import type Airtable from "airtable";
import type {
  AirtableTable,
  FieldDefinition,
  FieldType,
  InferSelectModel,
} from "./schema";

export class SelectQueryBuilder {
  constructor(private base: Airtable.Base) {}

  public async from<T extends AirtableTable>(table: T) {
    const tableName = table._tableName;

    const records = await this.base(tableName).select().all();

    return records.map((record) => {
      const { _tableName, ...fields } = table;
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
}
