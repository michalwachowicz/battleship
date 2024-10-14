import cleanContainer from "../../../utils/containerCleaner";
import shipModels from "../../models/shipModels";

export default class Ships {
  constructor(selector, className = null) {
    this.container = document.querySelector(selector);
    this.className = className;
  }

  clear() {
    cleanContainer(this.container);
  }

  render(array) {
    this.clear();

    array.forEach((ship) => {
      this.container.appendChild(this.createShip(ship));
    });
  }

  createShip({ name, length, horizontal }) {
    const ship = document.createElement("div");

    ship.className = this.className ? `ship ${this.className}` : "ship";
    ship.innerHTML = shipModels.getModel(name);

    ship.dataset.name = name;
    ship.dataset.length = length;
    ship.dataset.horizontal = horizontal;

    return ship;
  }
}
