import Ship from "../../classes/ship/ship";
import cleanContainer from "../../utils/containerCleaner";
import ships from "../models/ships";

export default class ShipPlacement {
  constructor(
    shipsArr,
    gridSelector,
    shipSelector,
    randomizeBtnSelector,
    playBtnSelector
  ) {
    this.shipsArr = shipsArr || [];
    this.placedShips = new Set();

    this.gridContainer = document.querySelector(gridSelector);
    this.shipContainer = document.querySelector(shipSelector);
    this.randomizeBtn = document.querySelector(randomizeBtnSelector);
    this.playBtn = document.querySelector(playBtnSelector);

    this.gameboard = null;
    this.draggedShip = null;
    this.draggedShipElement = null;

    this.startX = -1;
    this.startY = -1;
    this.isDragging = false;

    this.setupEventListeners();
    this.randomizeBtn.addEventListener(
      "click",
      this.handleRandomize.bind(this)
    );
  }

  init(gameboard) {
    this.gameboard = gameboard;
    this.placedShips = new Set();

    this.clearGrid();
    this.renderGrid();
    this.renderDraggableShips();

    this.showPlayButton();
  }

  clearGrid() {
    cleanContainer(this.gridContainer);
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

  renderDraggableShips() {
    this.clearShips();

    this.shipsArr.forEach(({ name, length, horizontal }) => {
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

  clearShips() {
    cleanContainer(this.shipContainer);
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

  handleMouseUp(ship, shipElement) {
    if (!this.isDragging) this.rotateShip(ship, shipElement);

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

  handleRandomize() {
    this.gameboard.clear();
    this.gameboard.randomize(this.shipsArr);

    this.clearGrid();
    this.renderGrid();
    this.clearShips();

    this.renderShipsOnGrid();
  }

  renderShipsOnGrid() {
    const renderedShips = [];

    for (let x = 0; x < this.gameboard.size; x += 1) {
      for (let y = 0; y < this.gameboard.size; y += 1) {
        const { ship } = this.gameboard.grid[x][y];

        if (ship && !renderedShips.find((shipName) => shipName === ship.name)) {
          this.renderPlacedShip(ship, x, y);
          renderedShips.push(ship.name);
        }
      }
    }
  }

  rotateShip(ship, shipEl) {
    const shipElement = shipEl;
    if (!shipElement) return;

    const [startX, startY] = shipElement.style.gridArea.split(" / ");
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

    shipElement.style.width = this.calculateShipWidth(y + 1, ship.length);
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
    const { gridColumn, gridRow } = this.draggedShipElement.style;
    if (gridColumn && gridRow) {
      const x = gridRow.split(" / ")[0];
      const y = gridColumn.split(" / ")[0];

      this.gameboard.removeShip(x - 1, y - 1);
    }
  }

  calculateShipWidth(startColumn, length) {
    const totalColumns = this.gameboard.size;
    const endColumn = startColumn + length - 1;

    if (endColumn <= totalColumns) return "100%";

    const columnsThatFit = totalColumns - startColumn + 1;
    const width = Math.round((length / columnsThatFit) * 100 * 100) / 100;

    return `${width}%`;
  }

  renderPlacedShip(ship, x, y) {
    const placedShip = document.createElement("div");

    placedShip.classList.add("placed-ship");
    placedShip.dataset.name = ship.name;
    placedShip.dataset.length = ship.length;
    placedShip.dataset.horizontal = ship.horizontal;
    placedShip.style.gridArea = this.calculateGridArea(ship, x, y);
    placedShip.style.width = this.calculateShipWidth(y + 1, ship.length);
    placedShip.innerHTML = ships.getModel(ship.name);
    placedShip.setAttribute("draggable", true);

    if (!ship.horizontal) placedShip.classList.add("placed-ship-vertical");

    placedShip.addEventListener("mousedown", this.handleMouseDown.bind(this));
    placedShip.addEventListener("mousemove", this.handleMouseDown.bind(this));
    placedShip.addEventListener("mouseup", () =>
      this.handleMouseUp(ship, placedShip)
    );
    placedShip.addEventListener("dragstart", (event) =>
      this.handleDragStart(event, ".placed-ship")
    );

    this.gridContainer.appendChild(placedShip);
    this.placedShips.add(ship.name);
    this.showPlayButton();
  }

  placeShipOnGrid(ship, x, y) {
    this.removeMovedShip();
    this.gameboard.placeShip(ship, x, y);
    this.renderPlacedShip(ship, x, y);
    this.draggedShipElement.remove();
  }

  showPlayButton() {
    if (!this.placedShips || !this.shipsArr) return;

    if (this.placedShips.size === this.shipsArr.length) {
      this.playBtn.classList.remove("hidden");
    } else {
      this.playBtn.classList.add("hidden");
    }
  }

  // eslint-disable-next-line class-methods-use-this
  calculateGridArea({ length }, x, y) {
    return `${x + 1} / ${y + 1} / span 1 / span ${length}`;
  }
}
