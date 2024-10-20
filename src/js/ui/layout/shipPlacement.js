import Ship from "../../game/ship";
import copyShipsArray from "../../utils/arrayUtil";
import isDefinedNumber from "../../utils/numbersUtil";
import { hide, show } from "../../utils/visibility";
import PlacementGrid from "../components/grid/placementGrid";
import DraggableShips from "../components/ships/draggableShips";

export default class ShipPlacement {
  constructor(shipsArr, selectors) {
    this.shipsArr = copyShipsArray(shipsArr);

    this.grid = new PlacementGrid(selectors.grid);
    this.draggableShips = new DraggableShips(
      selectors.ships,
      (event) => this.handleDragStart(event, ".ship", false),
      (event) => this.handleTouchStart(event, ".ship", false),
      (event) => this.handleTouchMove(event, false),
      this.handleTouchEnd.bind(this)
    );

    this.wrapper = document.querySelector(selectors.wrapper);
    this.randomizeBtn = document.querySelector(selectors.randomizeBtn);
    this.playBtn = document.querySelector(selectors.playBtn);

    this.gameboard = null;
    this.draggedShip = null;
    this.draggedShipElement = null;

    this.randomizeBtn.addEventListener(
      "click",
      this.handleRandomize.bind(this)
    );

    this.grid.container.addEventListener(
      "dragover",
      this.handleDragOver.bind(this)
    );
    this.grid.container.addEventListener("drop", this.handleDrop.bind(this));
  }

  init(gameboard, onPlay) {
    this.gameboard = gameboard;

    this.grid.init(gameboard);
    this.grid.render();

    this.draggableShips.render(copyShipsArray(this.shipsArr));

    this.playBtn.onclick = onPlay;
    this.toggleComponentsVisibility();
  }

  handleDragStart(event, shipClass, remove) {
    const shipElement = event.target.closest(shipClass);
    const { name, length, horizontal } = shipElement.dataset;
    const ship = new Ship(name, parseInt(length, 10), horizontal === "true");

    this.draggedShip = ship;
    this.draggedShipElement = shipElement;

    if (remove) this.removeMovedShip();

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
      event.target.addEventListener("dragend", () => dragImage.remove());
    }
  }

  handleTouchStart(event, shipClass) {
    event.preventDefault();

    const { clientX, clientY } = event.touches[0];
    const targetElement = document.elementFromPoint(clientX, clientY);
    const shipElement = targetElement.closest(shipClass);
    const { name, length, horizontal } = shipElement.dataset;
    const ship = new Ship(name, parseInt(length, 10), horizontal === "true");

    this.draggedShip = ship;
    this.draggedShipElement = shipElement;
  }

  handleDragOver(event) {
    event.preventDefault();

    if (!this.draggedShip) return;

    this.grid.resetHighlight();

    const x = parseInt(event.target.dataset.x, 10);
    const y = parseInt(event.target.dataset.y, 10);

    if (!isDefinedNumber(x) || !isDefinedNumber(y)) return;

    const valid = this.gameboard.isValidPlacement(this.draggedShip, x, y);

    this.grid.highlightCells(this.draggedShip, x, y, valid);
  }

  handleTouchMove(event, remove) {
    event.preventDefault();

    if (!this.draggedShip) return;
    if (remove && this.grid.isDragging) this.removeMovedShip();

    this.grid.resetHighlight();

    const { clientX, clientY } = event.touches[0];

    this.draggedShipElement.style.position = "fixed";
    this.draggedShipElement.style.left = `${clientX + 4}px`;
    this.draggedShipElement.style.top = `${clientY + 4}px`;
    this.draggedShipElement.style.width = `${this.draggedShip.length * 25}px`;

    const targetElement = document.elementFromPoint(clientX, clientY);
    const gridItem = targetElement.closest(".grid-item");

    if (gridItem && gridItem.dataset.x && gridItem.dataset.y) {
      const x = parseInt(gridItem.dataset.x, 10);
      const y = parseInt(gridItem.dataset.y, 10);

      if (!isDefinedNumber(x) || !isDefinedNumber(y)) return;

      const valid = this.gameboard.isValidPlacement(this.draggedShip, x, y);

      this.grid.highlightCells(this.draggedShip, x, y, valid);
    }
  }

  handleDrop(event) {
    event.preventDefault();

    let x = parseInt(event.target.dataset.x, 10);
    let y = parseInt(event.target.dataset.y, 10);

    if (!isDefinedNumber(x) || !isDefinedNumber(y)) {
      [x, y] = this.draggedShipElement.style.gridArea.split(" / ");

      x -= 1;
      y -= 1;
    }

    if (
      isDefinedNumber(x) &&
      isDefinedNumber(y) &&
      this.gameboard.isValidPlacement(this.draggedShip, x, y)
    ) {
      this.placeShipOnGrid(this.draggedShip, x, y);
    }

    this.grid.resetHighlight();

    this.draggedShip = null;
    this.draggedShipElement = null;
  }

  handleTouchEnd(event) {
    event.preventDefault();

    if (!this.draggedShip) return;

    const { clientX, clientY } = event.changedTouches[0];
    const targetElement = document.elementFromPoint(clientX, clientY);
    const gridItem = targetElement.closest(".grid-item");

    if (gridItem && gridItem.dataset.x && gridItem.dataset.y) {
      let x = parseInt(gridItem.dataset.x, 10);
      let y = parseInt(gridItem.dataset.y, 10);

      if (!isDefinedNumber(x) || !isDefinedNumber(y)) {
        [x, y] = this.draggedShipElement.style.gridArea.split(" / ");
      }

      if (
        isDefinedNumber(x) &&
        isDefinedNumber(y) &&
        this.gameboard.isValidPlacement(this.draggedShip, x, y)
      ) {
        this.placeShipOnGrid(this.draggedShip, x, y);
      }
    }

    ["position", "left", "top", "width"].forEach((property) =>
      this.draggedShipElement.style.removeProperty(property)
    );

    this.grid.resetHighlight();

    this.draggedShip = null;
    this.draggedShipElement = null;
  }

  handleRandomize() {
    this.gameboard.clear();
    this.gameboard.randomize(copyShipsArray(this.shipsArr));

    this.grid.render();
    this.draggableShips.clear();

    this.renderShipsOnGrid();
  }

  renderShipsOnGrid() {
    const { size, grid } = this.gameboard;
    const renderedShips = [];

    for (let x = 0; x < size; x += 1) {
      for (let y = 0; y < size; y += 1) {
        const { ship } = grid[x][y];

        if (ship && !renderedShips.find((shipName) => shipName === ship.name)) {
          this.renderPlacedShip(ship, x, y);
          renderedShips.push(ship.name);
        }
      }
    }
  }

  renderPlacedShip(ship, x, y) {
    const placedShip = this.grid.renderShip(ship, x, y);

    placedShip.addEventListener("dragstart", (event) =>
      this.handleDragStart(event, ".ship-placed", true)
    );
    placedShip.addEventListener("touchstart", (event) =>
      this.handleTouchStart(event, ".ship-placed")
    );
    placedShip.addEventListener("touchmove", (event) =>
      this.handleTouchMove(event, true)
    );
    placedShip.addEventListener("touchend", this.handleTouchEnd.bind(this));

    this.toggleComponentsVisibility();
  }

  removeMovedShip() {
    const { gridArea } = this.draggedShipElement.style;
    if (!gridArea) return;

    const [x, y] = gridArea.split(" / ");
    this.gameboard.removeShip(parseInt(x, 10) - 1, parseInt(y, 10) - 1);
  }

  placeShipOnGrid(ship, x, y) {
    this.draggedShipElement.remove();
    this.gameboard.placeShip(ship, x, y);

    this.renderPlacedShip(ship, x, y);
  }

  toggleComponentsVisibility() {
    const { placedShips } = this.grid;
    if (!placedShips || !this.shipsArr) return;

    if (placedShips.size === this.shipsArr.length) {
      this.playBtn.disabled = false;
      hide(this.draggableShips.container);
    } else {
      this.playBtn.disabled = true;
      show(this.draggableShips.container);
    }
  }
}
