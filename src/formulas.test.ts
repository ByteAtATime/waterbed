import { describe, test, expect } from "bun:test";
import * as f from "./formulas";
import type { FieldDefinition } from "./schema";

describe("Airtable Formula Builder", () => {
  const nameField: FieldDefinition = {
    _type: "text",
    airtableFieldName: "Full Name",
  };
  const ageField: FieldDefinition = {
    _type: "number",
    airtableFieldName: "Years Old",
  };
  const scoreField: FieldDefinition = {
    _type: "number",
    airtableFieldName: "Score",
  };

  describe("Comparison Operators", () => {
    test("eq() should create an equality formula with a string", () => {
      expect(f.eq(nameField, "Alice")).toEqual({
        _formula: "({Full Name} = 'Alice')",
      });
    });

    test("eq() should create an equality formula with a number", () => {
      expect(f.eq(ageField, 30)).toEqual({ _formula: "({Years Old} = 30)" });
    });

    test("neq() should create an inequality formula", () => {
      expect(f.neq(ageField, 30)).toEqual({ _formula: "({Years Old} != 30)" });
    });

    test("gt() should create a greater-than formula", () => {
      expect(f.gt(ageField, 18)).toEqual({ _formula: "({Years Old} > 18)" });
    });

    test("gte() should create a greater-than-or-equal-to formula", () => {
      expect(f.gte(ageField, 18)).toEqual({ _formula: "({Years Old} >= 18)" });
    });

    test("lt() should create a less-than formula", () => {
      expect(f.lt(ageField, 65)).toEqual({ _formula: "({Years Old} < 65)" });
    });

    test("lte() should create a less-than-or-equal-to formula", () => {
      expect(f.lte(ageField, 65)).toEqual({ _formula: "({Years Old} <= 65)" });
    });
  });

  describe("Logical Operators", () => {
    test("and() should combine multiple conditions", () => {
      const formula = f.and(f.gt(ageField, 21), f.eq(nameField, "Bob"));
      expect(formula).toEqual({
        _formula: "AND(({Years Old} > 21), ({Full Name} = 'Bob'))",
      });
    });

    test("or() should combine multiple conditions", () => {
      const formula = f.or(f.lt(ageField, 18), f.eq(nameField, "Admin"));
      expect(formula).toEqual({
        _formula: "OR(({Years Old} < 18), ({Full Name} = 'Admin'))",
      });
    });

    test("not() should negate a condition", () => {
      const formula = f.not(f.eq(nameField, "Charlie"));
      expect(formula).toEqual({ _formula: "NOT(({Full Name} = 'Charlie'))" });
    });
  });

  describe("String Functions", () => {
    test("lower() should create a LOWER() formula", () => {
      expect(f.lower(nameField)).toEqual({ _formula: "LOWER({Full Name})" });
    });

    test("upper() should create a UPPER() formula", () => {
      expect(f.upper("text")).toEqual({ _formula: "UPPER('text')" });
    });

    test("concatenate() should create a CONCATENATE() formula", () => {
      const formula = f.concatenate("Name: ", nameField, " Age: ", ageField);
      expect(formula).toEqual({
        _formula: "CONCATENATE('Name: ', {Full Name}, ' Age: ', {Years Old})",
      });
    });
  });

  describe("Math Functions", () => {
    test("sum() should create a SUM() formula", () => {
      const formula = f.sum(ageField, scoreField, 100);
      expect(formula).toEqual({ _formula: "SUM({Years Old}, {Score}, 100)" });
    });
  });

  describe("Conditional and Special Functions", () => {
    test("ifs() should create an IF() formula", () => {
      const formula = f.ifs(f.gt(ageField, 18), "Adult", "Minor");
      expect(formula).toEqual({
        _formula: "IF(({Years Old} > 18), 'Adult', 'Minor')",
      });
    });

    test("blank() should create a BLANK() formula", () => {
      expect(f.blank()).toEqual({ _formula: "BLANK()" });
    });
  });

  describe("Nested Formulas", () => {
    test("should correctly handle deeply nested formula functions", () => {
      const formula = f.and(
        f.gt(ageField, 18),
        f.eq(f.lower(nameField), "dave")
      );
      expect(formula).toEqual({
        _formula: "AND(({Years Old} > 18), (LOWER({Full Name}) = 'dave'))",
      });
    });
  });
});
