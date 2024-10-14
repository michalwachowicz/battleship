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

  it("rotates ship on empty space", () => {
    expect(gameboard.placeShip(ship, shipX, shipY)).toBe(true);
    expect(gameboard.grid[shipX][shipY + 1]).toEqual({ ship, attacked: false });
    expect(gameboard.grid[shipX + 1][shipY]).toEqual({
      ship: null,
      attacked: false,
    });
    expect(ship.horizontal).toBe(true);

    expect(gameboard.rotateShip(shipX, shipY)).toBe(true);
    expect(gameboard.grid[shipX + 1][shipY]).toEqual({ ship, attacked: false });
    expect(gameboard.grid[shipX][shipY + 1]).toEqual({
      ship: null,
      attacked: false,
    });
    expect(ship.horizontal).toBe(false);
  });

  it("does not rotate ship on empty spot", () => {
    expect(gameboard.rotateShip(0, 0)).toBe(false);
  });

  it("does not rotate ship if invalid", () => {
    expect(gameboard.placeShip(ship, shipX, shipY)).toBe(true);
    expect(gameboard.placeShip(new Ship("carrier", 5), shipX + 3, shipY)).toBe(
      true
    );

    expect(gameboard.rotateShip(shipX, shipY)).toBe(false);
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

  it("removes a ship from board", () => {
    expect(gameboard.placeShip(ship, shipX, shipY)).toBe(true);
    expect(gameboard.ships).toHaveLength(1);

    for (let i = shipY; i < shipY + ship.length; i += 1) {
      expect(gameboard.grid[shipX][i]).toEqual({ ship, attacked: false });
    }

    expect(gameboard.placeShip(new Ship("test", 4), shipX + 2, shipY)).toBe(
      true
    );
    expect(gameboard.ships).toHaveLength(2);

    expect(gameboard.removeShip(shipX, shipY)).toBe(true);
    expect(gameboard.ships).toHaveLength(1);

    for (let i = shipY; i < shipY + ship.length; i += 1) {
      expect(gameboard.grid[shipX][i]).toEqual({ ship: null, attacked: false });
    }
  });

  it("does not remove non existing ship", () => {
    expect(gameboard.removeShip(shipX, shipY)).toBe(false);
  });

  it("randomizes ship placement properly", () => {
    expect(gameboard.ships).toHaveLength(0);

    const shipArr = [
      new Ship("carrier", 5),
      new Ship("battleship", 4),
      new Ship("destroyer", 3),
      new Ship("submarine", 3),
      new Ship("small", 2),
    ];

    gameboard.randomize(shipArr);

    expect(gameboard.ships).toHaveLength(shipArr.length);
    expect(gameboard.ships).not.toEqual(shipArr);
    expect(gameboard.ships.find((s) => !s.horizontal)).toBeDefined();

    const flatGrid = gameboard.grid.flat();

    shipArr.forEach((s) => {
      expect(
        flatGrid.find((cell) => cell.ship && cell.ship.name === s.name)
      ).toBeDefined();
    });
  });

  it("clears grid properly", () => {
    expect(gameboard.placeShip(ship, shipX, shipY)).toBe(true);
    expect(gameboard.ships).toHaveLength(1);

    gameboard.clear();

    expect(gameboard.ships).toHaveLength(0);
    for (let x = 0; x < gameboard.size; x += 1) {
      for (let y = 0; y < gameboard.size; y += 1) {
        expect(gameboard.grid[x][y]).toEqual({ ship: null, attacked: false });
      }
    }
  });

  it("returns empty start coords if ship is null", () => {
    expect(gameboard.getShipStartCoords(shipX, shipY)).toBeNull();
  });

  it("returns horizontal ship start coords", () => {
    expect(gameboard.placeShip(ship, shipX, shipY)).toBe(true);
    expect(gameboard.getShipStartCoords(shipX, shipY + 4)).toEqual({
      x: shipX,
      y: shipY,
    });
  });

  it("returns vertical ship start coords", () => {
    ship.horizontal = false;

    expect(gameboard.placeShip(ship, shipX, shipY)).toBe(true);
    expect(gameboard.getShipStartCoords(shipX + 4, shipY)).toEqual({
      x: shipX,
      y: shipY,
    });
  });
});
