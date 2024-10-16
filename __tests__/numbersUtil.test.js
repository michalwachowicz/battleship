import isDefinedNumber from "../src/js/utils/numbersUtil";

describe("isDefinedNumber", () => {
  it("returns false if not a number", () =>
    expect(isDefinedNumber(NaN)).toBe(false));

  it("returns false if number is undefined", () =>
    expect(isDefinedNumber()).toBe(false));

  it("returns true if number is defined number", () =>
    expect(isDefinedNumber(4)).toBe(true));
});
