import Ship from "./ship";

const LENGTH = 5;

describe("Ship", () => {
  let ship;

  beforeEach(() => {
    ship = new Ship("carrier", LENGTH);
  });

  it("creates a ship with proper length", () =>
    expect(ship.length).toBe(LENGTH));

  it("increases the number of hits", () => {
    for (let i = 0; i <= 2; i += 1) {
      expect(ship.hits).toBe(i);
      ship.hit();
    }
  });

  it("checks if the ship is sunk", () => {
    expect(ship.isSunk()).toBe(false);

    for (let i = 0; i < LENGTH; i += 1) ship.hit();
    expect(ship.isSunk()).toBe(true);
  });

  it("resets the ship properly", () => {
    ship.horizontal = false;
    ship.hit();
    ship.reset();

    expect(ship.hits).toBe(0);
    expect(ship.horizontal).toBe(true);
  });
});
