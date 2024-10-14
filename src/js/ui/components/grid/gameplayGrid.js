import getRandomCoordinates from "../../../utils/coordsUtil";
import Grid from "./grid";
import hitImage from "../../../../assets/images/cells/hit.svg";
import missImage from "../../../../assets/images/cells/miss.svg";

export default class GameplayGrid extends Grid {
  constructor(selector, onActiveChange, onShipSunk, onGameOver) {
    super(selector);

    this.onActiveChange = onActiveChange;
    this.onShipSunk = onShipSunk;
    this.onGameOver = onGameOver;

    this.player = null;
    this.opponentGrid = null;
    this.active = false;

    this.botHitCoords = null;

    this.container.addEventListener("click", this.handleCellClick.bind(this));
  }

  init(player, opponentGrid) {
    super.init(player.gameboard);

    this.player = player;
    this.opponentGrid = opponentGrid;

    this.render();
  }

  attack(cell, opponent, x, y, isBotTurn = false) {
    const { gameboard } = this.player;
    const gridItem = gameboard.grid[x][y];

    if (gridItem.attacked) return;

    opponent.attack(this.player, x, y);

    const cellElement = cell;
    const { ship } = gridItem;

    if (!ship) {
      cellElement.classList.add("grid-item-attacked");
      cellElement.innerHTML = missImage;
    } else if (ship.isSunk()) {
      if (gameboard.allShipsSunk()) {
        this.active = false;
        this.onGameOver(opponent); // Pass the winner
        return;
      }

      const { x: shipX, y: shipY } = gameboard.getShipStartCoords(x, y);

      this.renderShip(ship, shipX, shipY);
      this.onShipSunk(this.player, ship);

      if (isBotTurn) this.botHitCoords = null;
      return;
    } else {
      cellElement.classList.add("grid-item-hit");
      cellElement.innerHTML = hitImage;

      if (isBotTurn) this.botHitCoords = { x, y };
      return;
    }

    this.active = false;
    this.opponentGrid.active = true;
    this.onActiveChange(this.opponentGrid.player);

    if (this.player.computer && !isBotTurn) this.handleBotTurn();
  }

  renderShip(ship, x, y) {
    const shipElement = super.renderShip(ship, x, y);
    shipElement.classList.add("placed-ship-sunk");

    const { horizontal, length } = ship;
    const clearCell = (i, j) => {
      const cell = this.container.querySelector(
        `[data-x="${i}"][data-y="${j}"]`
      );
      if (cell) cell.innerHTML = "";
    };

    if (horizontal) {
      for (let i = y; i < y + length; i += 1) clearCell(x, i);
    } else {
      for (let i = x; i < x + length; i += 1) clearCell(i, y);
    }

    return shipElement;
  }

  handleCellClick(event) {
    const opponent = this.opponentGrid.player;
    if (!this.active || opponent.computer) return;

    const cell = event.target.closest(".grid-item");
    if (!cell) return;

    const [cellX, cellY] = cell.style.gridArea.split(" / ");
    const x = parseInt(cellX, 10) - 1;
    const y = parseInt(cellY, 10) - 1;

    this.attack(cell, opponent, x, y);
  }

  handleBotTurn() {
    const botMakeMove = () => {
      if (this.active) return;

      let x;
      let y;

      if (this.opponentGrid.botHitCoords) {
        ({ x, y } = this.getBotAdjacentCoords());

        if (x === null || y === null) {
          ({ x, y } = getRandomCoordinates(this.opponentGrid.player.gameboard));
        }
      } else {
        ({ x, y } = getRandomCoordinates(this.opponentGrid.player.gameboard));
      }

      const cell = this.opponentGrid.container.querySelector(
        `[data-x="${x}"][data-y="${y}"]`
      );

      this.opponentGrid.attack(cell, this.player, x, y, true);
      setTimeout(botMakeMove, 1000);
    };

    setTimeout(botMakeMove, 1000);
  }

  getBotAdjacentCoords() {
    const { x: currentX, y: currentY } = this.opponentGrid.botHitCoords;
    const { size, grid } = this.opponentGrid.player.gameboard;

    const directions = [
      { x: currentX - 1, y: currentY },
      { x: currentX, y: currentY + 1 },
      { x: currentX + 1, y: currentY },
      { x: currentX, y: currentY - 1 },
    ];

    const target = directions.find(
      ({ x, y }) =>
        x >= 0 && x < size && y >= 0 && y < size && !grid[x][y].attacked
    );

    return target || { x: null, y: null };
  }
}
