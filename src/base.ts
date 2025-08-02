import Airtable from "airtable";
import { SelectQueryBuilder } from "./select";

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

  public select() {
    return new SelectQueryBuilder(this.base);
  }
}

export const base = (config: BaseConfig) => {
  return new Base(config);
};
