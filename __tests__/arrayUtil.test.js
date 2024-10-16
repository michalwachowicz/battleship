import Ship from "../src/js/game/ship";
import copyShipsArray from "../src/js/utils/arrayUtil";

describe("copyShipsArray", () => {
  it("returns empty array with empty parameter", () =>
    expect(copyShipsArray([])).toEqual([]));

  it("returns array with copies of ships", () => {
    const ships = [new Ship("carrier", 5), new Ship("submarine", 3)];
    const shipsCopy = copyShipsArray(ships);

    expect(shipsCopy).not.toBe(ships);
    for (let i = 0; i < ships.length; i += 1) {
      expect(shipsCopy[i]).not.toBe(ships[i]);
    }
  });

  it("returns ship array from array of ship objects", () => {
    const ships = [
      { name: "carrier", length: 5, horizontal: true, hits: 0 },
      { name: "submarine", length: 3, horizontal: true, hits: 0 },
    ];
    const shipsCopy = copyShipsArray(ships);

    expect(shipsCopy).not.toBe(ships);
    for (let i = 0; i < ships.length; i += 1) {
      expect(shipsCopy[i]).not.toBe(ships[i]);
      expect(Object.getPrototypeOf(shipsCopy[i]) === Ship.prototype).toBe(true);
    }
  });
});
