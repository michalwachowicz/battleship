import cleanContainer from "../../../utils/containerCleaner";
import shipModels from "../../models/shipModels";

export default class Grid {
  constructor(selector) {
    this.container = document.querySelector(selector);
    this.gameboard = null;
    this.placedShips = new Set();
  }

  init(gameboard) {
    this.gameboard = gameboard;
    this.placedShips = new Set();
  }

  clear() {
    cleanContainer(this.container);
  }

  render() {
    this.clear();

    const { size } = this.gameboard;

    for (let x = 0; x < size; x += 1) {
      for (let y = 0; y < size; y += 1) {
        const gridItem = document.createElement("div");

        gridItem.classList.add("grid-item");
        gridItem.dataset.x = x;
        gridItem.dataset.y = y;
        gridItem.style.gridArea = `${x + 1} / ${y + 1}`;

        this.container.appendChild(gridItem);
      }
    }
  }

  renderShip(ship, x, y) {
    const { name, length, horizontal } = ship;
    const placedShip = document.createElement("div");

    placedShip.classList.add("ship-placed");
    placedShip.innerHTML = shipModels.getModel(name);

    placedShip.dataset.name = name;
    placedShip.dataset.length = length;
    placedShip.dataset.horizontal = horizontal;

    placedShip.style.gridArea = this.calculateGridArea(ship, x, y);
    placedShip.style.width = this.calculateShipWidth(y + 1, length);

    if (!horizontal) placedShip.classList.add("ship-placed-vertical");

    this.container.appendChild(placedShip);
    this.placedShips.add(ship.name);

    return placedShip;
  }

  calculateShipWidth(startColumn, length) {
    const totalColumns = this.gameboard.size;
    const endColumn = startColumn + length - 1;

    if (endColumn <= totalColumns) return "100%";

    const columnsThatFit = totalColumns - startColumn + 1;
    const width = Math.round((length / columnsThatFit) * 100 * 100) / 100;

    return `${width}%`;
  }

  // eslint-disable-next-line class-methods-use-this
  calculateGridArea({ length }, x, y) {
    return `${x + 1} / ${y + 1} / span 1 / span ${length}`;
  }
}
