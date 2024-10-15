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
    this.botHitOrientation = null;
    this.botHitDirection = null;

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

      if (isBotTurn && this.botHitCoords) {
        const { x: botX, y: botY } = this.botHitCoords;
        const { ship: botShip } = gameboard.grid[botX][botY];

        if (!botShip.isSunk()) {
          this.botHitDirection = this.flipDirection(
            this.botHitOrientation,
            this.botHitDirection
          );
        }
      }
    } else if (ship.isSunk()) {
      if (gameboard.allShipsSunk()) {
        this.active = false;
        this.onGameOver(opponent); // Pass the winner
        return;
      }

      const { x: shipX, y: shipY } = gameboard.getShipStartCoords(x, y);

      this.renderShip(ship, shipX, shipY);
      this.onShipSunk(this.player, ship);

      if (isBotTurn) {
        this.botHitCoords = null;
        this.botHitOrientation = null;
        this.botHitDirection = null;
      }
      return;
    } else {
      cellElement.classList.add("grid-item-hit");
      cellElement.innerHTML = hitImage;

      if (isBotTurn) {
        this.determineBotOrientation(x, y);
        this.botHitCoords = { x, y };
      }
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
    let { x, y } = this.opponentGrid.botHitCoords;
    const { gameboard } = this.opponentGrid.player;
    const { size, grid } = gameboard;

    const { botHitOrientation, botHitDirection } = this.opponentGrid;
    if (!botHitOrientation || !botHitDirection) {
      const directions = [
        { x, y: y + 1 }, // right
        { x, y: y - 1 }, // left
        { x: x + 1, y }, // down
        { x: x - 1, y }, // Up
      ];

      const target = directions.find(
        ({ x: nx, y: ny }) =>
          nx >= 0 && nx < size && ny >= 0 && ny < size && !grid[nx][ny].attacked
      );

      return target || { x: null, y: null };
    }

    const directions = {
      horizontal: {
        right: { x: 0, y: 1 },
        left: { x: 0, y: -1 },
      },
      vertical: {
        top: { x: 1, y: 0 },
        bottom: { x: -1, y: 0 },
      },
    };
    let direction = directions[botHitOrientation][botHitDirection];

    while (grid[x][y].attacked) {
      const newX = x + direction.x;
      const newY = y + direction.y;

      if (newX < 0 || newX >= size || newY < 0 || newY >= size) {
        const newDirection = this.flipDirection(
          botHitOrientation,
          botHitDirection
        );

        this.opponentGrid.botHitDirection = newDirection;
        direction = directions[botHitOrientation][newDirection];
      }

      x += direction.x;
      y += direction.y;
    }

    return { x, y };
  }

  // eslint-disable-next-line class-methods-use-this
  flipDirection(orientation, direction) {
    if (!orientation || !direction) return null;

    const oppositeDirections = {
      horizontal: { right: "left", left: "right" },
      vertical: { top: "bottom", bottom: "top" },
    };
    return oppositeDirections[orientation][direction];
  }

  determineBotOrientation(x, y) {
    if (!this.botHitCoords) {
      this.botHitOrientation = null;
      return;
    }

    const { x: prevX, y: prevY } = this.botHitCoords;

    if (prevX === x && Math.abs(prevY - y) === 1) {
      this.botHitOrientation = "horizontal";
      this.botHitDirection = Math.random() > 0.5 ? "right" : "left";
    } else if (prevY === y && Math.abs(prevX - x) === 1) {
      this.botHitOrientation = "vertical";
      this.botHitDirection = Math.random() > 0.5 ? "top" : "bottom";
    }
  }
}
