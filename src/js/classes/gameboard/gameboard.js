export default class Gameboard {
  constructor(size = 10) {
    this.size = size;
    this.grid = Array.from({ length: this.size }, () =>
      Array.from({ length: this.size }, () => ({ ship: null, attacked: false }))
    );
    this.ships = [];
  }

  isAdjacentToShip(x, y) {
    const neighbors = [
      [x - 1, y], // top
      [x + 1, y], // bottom
      [x, y - 1], // left
      [x, y + 1], // right
      [x - 1, y - 1], // top-left
      [x - 1, y + 1], // top-right
      [x + 1, y - 1], // bottom-left
      [x + 1, y + 1], // bottom-right
    ];

    return neighbors.some(
      ([nx, ny]) =>
        nx >= 0 &&
        nx < this.size &&
        ny >= 0 &&
        ny < this.size &&
        this.grid[nx][ny].ship
    );
  }

  checkPlacement({ length, horizontal }, x, y, callback) {
    if (horizontal) {
      if (y + length > this.size) return false;

      for (let i = y; i < y + length; i += 1) {
        if (callback(x, i)) return false;
      }
    } else {
      if (x + length > this.size) return false;

      for (let i = x; i < x + length; i += 1) {
        if (callback(i, y)) return false;
      }
    }

    return true;
  }

  isValidPlacement(ship, x, y) {
    return this.checkPlacement(ship, x, y, (nx, ny) =>
      this.isAdjacentToShip(nx, ny)
    );
  }

  placeShip(ship, x, y) {
    if (!this.isValidPlacement(ship, x, y)) return false;

    this.ships.push(ship);
    this.checkPlacement(ship, x, y, (nx, ny) => {
      this.grid[nx][ny] = { ship, attacked: false };
      return false;
    });

    return true;
  }

  rotateShip(startX, startY) {
    const { ship } = this.grid[startX][startY];
    if (!ship) return false;

    this.checkPlacement(ship, startX, startY, (x, y) => {
      this.grid[x][y] = { ...this.grid[x][y], ship: null };
      return false;
    });

    ship.horizontal = !ship.horizontal;

    if (!this.isValidPlacement(ship, startX, startY)) {
      ship.horizontal = !ship.horizontal;
      this.placeShip(ship, startX, startY);

      return false;
    }

    this.placeShip(ship, startX, startY);
    return true;
  }

  receiveAttack(x, y) {
    if (x < 0 || x >= this.size || y < 0 || y >= this.size) return false;
    const { ship, attacked } = this.grid[x][y];

    if (attacked) return false;
    if (ship) ship.hit();

    this.grid[x][y] = { ship, attacked: true };
    return true;
  }

  allShipsSunk() {
    if (!this.ships || this.ships.length === 0) return false;
    return this.ships.every((ship) => ship.isSunk());
  }
}
