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

    this.container.addEventListener("click", this.handleCellClick.bind(this));
  }

  init(player, opponentGrid) {
    super.init(player.gameboard);

    this.player = player;
    this.opponentGrid = opponentGrid;

    this.render();
  }

  attack(cell, opponent, x, y) {
    const gridItem = this.player.gameboard.grid[x][y];
    if (gridItem.attacked) return;

    opponent.attack(this.player, x, y);

    const cellElement = cell;
    const { ship } = gridItem;

    if (!ship) {
      cellElement.classList.add("grid-item-attacked");
      cellElement.innerHTML = missImage;
    } else if (ship.isSunk()) {
      if (this.player.gameboard.allShipsSunk()) {
        this.onGameOver(opponent); // Pass the winner
        return;
      }

      // TODO: Add a ship image with placed-ship-sunk class + remove image from hit cells
      this.onShipSunk(this.player, ship);
    } else {
      cellElement.classList.add("grid-item-hit");
      cellElement.innerHTML = hitImage;
    }

    this.active = false;
    this.opponentGrid.active = true;
    this.onActiveChange(this.opponentGrid.player);

    if (this.player.computer) this.handleBotTurn();
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
    setTimeout(() => {
      const { x, y } = getRandomCoordinates(this.player.gameboard);
      const cell = this.opponentGrid.container.querySelector(
        `[data-x="${x}"][data-y="${y}"]`
      );

      this.opponentGrid.attack(cell, this.player, x, y);
    }, 1000);
  }
}
