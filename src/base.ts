import Airtable from "airtable";
import { SelectQueryBuilder, type FieldsSelection } from "./select";

export type BaseConfig = {
  apiKey: string;
  baseId: string;
};

export class Base {
  private airtable: Airtable;
  private baseId: string;
  private base: Airtable.Base;

  constructor(config: BaseConfig) {
    this.baseId = config.baseId;

    this.airtable = new Airtable({
      apiKey: config.apiKey,
    });
    this.base = this.airtable.base(this.baseId);
  }

  public select<TSelection extends FieldsSelection>(
    fields: TSelection
  ): SelectQueryBuilder<TSelection>;
  public select(): SelectQueryBuilder<undefined>;
  public select<TSelection extends FieldsSelection>(fields?: TSelection) {
    return new SelectQueryBuilder(this.base, fields);
  }
}

export const base = (config: BaseConfig) => {
  return new Base(config);
};
