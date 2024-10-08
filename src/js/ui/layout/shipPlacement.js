import Ship from "../../classes/ship/ship";
import ships from "../models/ships";

export default class ShipPlacement {
  constructor(gridSelector, shipSelector) {
    this.gridContainer = document.querySelector(gridSelector);
    this.shipContainer = document.querySelector(shipSelector);

    this.gameboard = null;
    this.draggedShip = null;
    this.draggedShipElement = null;

    this.setupEventListeners();
  }

  init(gameboard, shipArr) {
    this.gameboard = gameboard;

    this.clearGrid();
    this.renderGrid();
    this.renderDraggableShips(shipArr);
  }

  clearGrid() {
    while (this.gridContainer.firstChild) {
      this.gridContainer.removeChild(this.gridContainer.firstChild);
    }
  }

  renderGrid() {
    const { size } = this.gameboard;

    for (let x = 0; x < size; x += 1) {
      for (let y = 0; y < size; y += 1) {
        const gridItem = document.createElement("div");

        gridItem.classList.add("grid-item");
        gridItem.dataset.x = x;
        gridItem.dataset.y = y;
        gridItem.style.gridArea = `${x + 1} / ${y + 1}`;

        this.gridContainer.appendChild(gridItem);
      }
    }
  }

  renderDraggableShips(shipsArr) {
    shipsArr.forEach(({ name, length, horizontal }) => {
      const shipElement = document.createElement("div");

      shipElement.className = "ship";
      shipElement.innerHTML = ships.getModel(name);
      shipElement.setAttribute("draggable", true);

      shipElement.dataset.name = name;
      shipElement.dataset.length = length;
      shipElement.dataset.horizontal = horizontal;

      shipElement.addEventListener(
        "dragstart",
        this.handleDragStart.bind(this)
      );

      this.shipContainer.appendChild(shipElement);
    });
  }

  setupEventListeners() {
    this.gridContainer.addEventListener(
      "dragover",
      this.handleDragOver.bind(this)
    );
    this.gridContainer.addEventListener(
      "dragleave",
      this.resetGridHighlight.bind(this)
    );
    this.gridContainer.addEventListener("drop", this.handleDrop.bind(this));
  }

  handleDragStart(event) {
    const shipElement = event.target.closest(".ship");
    const { name, length, horizontal } = shipElement.dataset;
    const ship = new Ship(name, parseInt(length, 10), horizontal);

    this.draggedShip = ship;
    this.draggedShipElement = shipElement;
  }

  handleDragOver(event) {
    event.preventDefault();

    if (!this.draggedShip) return;

    this.resetGridHighlight();

    const x = parseInt(event.target.dataset.x, 10);
    const y = parseInt(event.target.dataset.y, 10);

    const valid = this.gameboard.isValidPlacement(this.draggedShip, x, y);

    this.highlightCells(this.draggedShip, x, y, valid);
  }

  handleDrop(event) {
    event.preventDefault();

    const x = parseInt(event.target.dataset.x, 10);
    const y = parseInt(event.target.dataset.y, 10);

    if (this.gameboard.isValidPlacement(this.draggedShip, x, y)) {
      this.placeShipOnGrid(this.draggedShip, x, y);
    }

    this.resetGridHighlight();

    this.draggedShip = null;
    this.draggedShipElement = null;
  }

  highlightCells({ length, horizontal }, x, y, isValid) {
    for (let i = 0; i < length; i += 1) {
      const targetX = horizontal ? x : x + i;
      const targetY = horizontal ? y + i : y;
      const cell = this.gridContainer.querySelector(
        `.grid-item[data-x="${targetX}"][data-y="${targetY}"]`
      );

      if (cell) {
        cell.classList.remove("grid-item-valid");
        cell.classList.remove("grid-item-invalid");

        cell.classList.add(isValid ? "grid-item-valid" : "grid-item-invalid");
      }
    }
  }

  resetGridHighlight() {
    const gridItems = this.gridContainer.querySelectorAll(".grid-item");

    gridItems.forEach((item) => {
      item.classList.remove("grid-item-valid");
      item.classList.remove("grid-item-invalid");
    });
  }

  placeShipOnGrid(ship, x, y) {
    this.gameboard.placeShip(ship, x, y);

    const placedShip = document.createElement("div");

    placedShip.classList.add("placed-ship");
    placedShip.style.gridArea = this.calculateGridArea(ship, x, y);
    placedShip.innerHTML = ships.getModel(ship.name);

    this.gridContainer.appendChild(placedShip);
    this.draggedShipElement.remove();
  }

  // eslint-disable-next-line class-methods-use-this
  calculateGridArea({ length, horizontal }, x, y) {
    const startRow = x + 1;
    const startCol = y + 1;
    const endRow = horizontal ? startRow : startCol + length - 1;
    const endCol = horizontal ? startCol + length - 1 : startCol;

    return `${startRow} / ${startCol} / ${endRow + 1} / ${endCol + 1}`;
  }
}
