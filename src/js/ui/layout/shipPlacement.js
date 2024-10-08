import Ship from "../../classes/ship/ship";
import ships from "../models/ships";

export default class ShipPlacement {
  constructor(gridSelector, shipSelector) {
    this.gridContainer = document.querySelector(gridSelector);
    this.shipContainer = document.querySelector(shipSelector);

    this.gameboard = null;
    this.draggedShip = null;
    this.draggedShipElement = null;

    this.startX = -1;
    this.startY = -1;
    this.isDragging = false;

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

      shipElement.addEventListener("dragstart", (event) =>
        this.handleDragStart(event, ".ship")
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

  handleMouseDown(event) {
    this.isDragging = false;
    this.startX = event.clientX;
    this.startY = event.clientY;
  }

  handleMouseMove(event) {
    const x = this.startX - event.clientX;
    const y = this.startY - event.clientY;

    if (Math.abs(x) > 5 || Math.abs(y) > 5) this.isDragging = true;
  }

  handleMouseUp(shipElement) {
    if (!this.isDragging) this.rotateShip(shipElement);

    this.isDragging = false;
  }

  handleDragStart(event, shipClass) {
    const shipElement = event.target.closest(shipClass);
    const { name, length, horizontal } = shipElement.dataset;
    const ship = new Ship(name, parseInt(length, 10), horizontal === "true");

    this.draggedShip = ship;
    this.draggedShipElement = shipElement;

    if (!ship.horizontal) {
      const svg = shipElement.querySelector("svg").cloneNode(true);
      const dragImage = document.createElement("div");

      dragImage.style.width = `${shipElement.clientWidth}px`;
      dragImage.style.height = `${shipElement.cientHeight}px`;
      dragImage.style.position = "absolute";
      dragImage.style.top = "-9999px";

      svg.style.transform = "rotate(90deg)";
      svg.style.transformOrigin = "top left";

      dragImage.appendChild(svg);
      document.body.appendChild(dragImage);

      event.dataTransfer.setDragImage(dragImage, 0, 0);

      event.target.addEventListener("dragend", () => {
        document.body.removeChild(dragImage); // Remove the temporary drag image from DOM
      });
    }
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

  rotateShip(ship) {
    const shipElement = ship;
    if (!shipElement) return;

    const { gridArea } = shipElement.style;
    const [startX, startY] = gridArea.split(" / ");
    const x = parseInt(startX - 1, 10);
    const y = parseInt(startY - 1, 10);

    if (!this.gameboard.rotateShip(x, y)) {
      // Show animation
      return;
    }

    const horizontal = !(shipElement.dataset.horizontal === "true");
    shipElement.dataset.horizontal = horizontal;

    if (horizontal) shipElement.classList.remove("placed-ship-vertical");
    else shipElement.classList.add("placed-ship-vertical");
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

  removeMovedShip() {
    const { gridArea } = this.draggedShipElement.style;
    if (gridArea) {
      const [x, y] = gridArea.split(" / ");
      this.gameboard.removeShip(x - 1, y - 1);
    }
  }

  placeShipOnGrid(ship, x, y) {
    this.removeMovedShip();
    this.gameboard.placeShip(ship, x, y);

    const placedShip = document.createElement("div");

    placedShip.classList.add("placed-ship");
    placedShip.dataset.name = ship.name;
    placedShip.dataset.length = ship.length;
    placedShip.dataset.horizontal = ship.horizontal;
    placedShip.style.gridArea = this.calculateGridArea(ship, x, y);
    placedShip.innerHTML = ships.getModel(ship.name);
    placedShip.setAttribute("draggable", true);

    if (!ship.horizontal) placedShip.classList.add("placed-ship-vertical");

    placedShip.addEventListener("mousedown", this.handleMouseDown.bind(this));
    placedShip.addEventListener("mousemove", this.handleMouseDown.bind(this));
    placedShip.addEventListener("mouseup", () =>
      this.handleMouseUp(placedShip)
    );
    placedShip.addEventListener("dragstart", (event) =>
      this.handleDragStart(event, ".placed-ship")
    );

    this.gridContainer.appendChild(placedShip);
    this.draggedShipElement.remove();
  }

  // eslint-disable-next-line class-methods-use-this
  calculateGridArea({ length }, x, y) {
    const startRow = x + 1;
    const startCol = y + 1;
    const endRow = startRow;
    const endCol = startCol + length - 1;

    return `${startRow} / ${startCol} / ${endRow + 1} / ${endCol + 1}`;
  }
}
