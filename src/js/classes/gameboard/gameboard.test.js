import Gameboard from "./gameboard";
import Ship from "../ship/ship";

describe("Gameboard", () => {
  const shipX = 1;
  const shipY = 1;

  let gameboard;
  let ship;

  beforeEach(() => {
    gameboard = new Gameboard();
    ship = new Ship("carrier", 5);
  });

  it("creates a gameboard with 10x10 grid", () => {
    expect(gameboard.grid).toHaveLength(10);
    expect(gameboard.grid[0]).toHaveLength(10);
  });

  it("fills array with proper object", () =>
    gameboard.grid.forEach((row) =>
      row.forEach((column) =>
        expect(column).toEqual({ ship: null, attacked: false })
      )
    ));

  it("places a ship horizontally", () => {
    expect(gameboard.placeShip(ship, shipX, shipY)).toBe(true);
    expect(gameboard.ships).toContain(ship);

    for (let i = shipY; i < shipY + ship.length; i += 1) {
      expect(gameboard.grid[shipX][i]).toEqual({ ship, attacked: false });
    }
  });

  it("places a ship vertically", () => {
    ship.horizontal = false;

    expect(gameboard.placeShip(ship, shipX, shipY)).toBe(true);
    expect(gameboard.ships).toContain(ship);

    for (let i = shipX; i < shipX + ship.length; i += 1) {
      expect(gameboard.grid[i][shipY]).toEqual({ ship, attacked: false });
    }
  });

  it("does not place a ship in invalid space", () => {
    expect(gameboard.placeShip(ship, shipX, shipY + 5)).toBe(false);
    expect(
      gameboard.placeShip(new Ship("carrier", 5, false), shipX + 5, shipY)
    ).toBe(false);
  });

  it("does not place a ship on top or near other ship", () => {
    expect(gameboard.placeShip(ship, shipX, shipY)).toBe(true);

    expect(gameboard.placeShip(new Ship("carrier", 5, false), 0, 0)).toBe(
      false
    );
    expect(gameboard.placeShip(new Ship("carrier", 5), shipX + 1, shipY)).toBe(
      false
    );

    expect(gameboard.placeShip(new Ship("carrier", 5), shipX + 2, shipY)).toBe(
      true
    );
  });

  it("receives attack on empty spot", () => {
    expect(gameboard.grid[0][0]).toEqual({ ship: null, attacked: false });

    expect(gameboard.receiveAttack(0, 0)).toBe(true);

    expect(gameboard.grid[0][0]).toEqual({ ship: null, attacked: true });
  });

  it("receives attack on ship", () => {
    expect(gameboard.placeShip(ship, shipX, shipY)).toBe(true);
    expect(gameboard.grid[shipX][shipY]).toEqual({ ship, attacked: false });
    expect(ship.hits).toBe(0);

    expect(gameboard.receiveAttack(shipX, shipY)).toBe(true);
    expect(gameboard.grid[shipX][shipY]).toEqual({ ship, attacked: true });
    expect(ship.hits).toBe(1);
  });

  it("does not receive an attack on attacked spot", () => {
    expect(gameboard.receiveAttack(shipX, shipY)).toBe(true);
    expect(gameboard.receiveAttack(shipX, shipY)).toBe(false);
  });

  it("does not receive an attack out of grid bounds", () => {
    expect(gameboard.receiveAttack(-1, 0)).toBe(false);
    expect(gameboard.receiveAttack(0, 10)).toBe(false);
  });

  it("checks if all ships are sunk", () => {
    expect(gameboard.allShipsSunk()).toBe(false);

    expect(gameboard.placeShip(ship, shipX, shipY)).toBe(true);
    expect(
      gameboard.placeShip(new Ship("submarine", 3), shipX + 2, shipY)
    ).toBe(true);

    for (let y = shipY; y < shipY + ship.length; y += 1) {
      expect(gameboard.receiveAttack(shipX, y)).toBe(true);
    }

    expect(gameboard.allShipsSunk()).toBe(false);

    for (let y = shipY; y < shipY + ship.length; y += 1) {
      expect(gameboard.receiveAttack(shipX + 2, y)).toBe(true);
    }

    expect(gameboard.allShipsSunk()).toBe(true);
  });
});
