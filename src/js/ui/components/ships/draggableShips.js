import cleanContainer from "../../../utils/containerCleaner";
import ships from "../../models/ships";

export default class DraggableShips {
  constructor(selector) {
    this.container = document.querySelector(selector);
  }

  clear() {
    cleanContainer(this.container);
  }

  render(array, onDragStart) {
    this.clear();

    array.forEach(({ name, length, horizontal }) => {
      const ship = document.createElement("div");

      ship.className = "ship";
      ship.innerHTML = ships.getModel(name);
      ship.setAttribute("draggable", true);

      ship.dataset.name = name;
      ship.dataset.length = length;
      ship.dataset.horizontal = horizontal;

      ship.addEventListener("dragstart", onDragStart);
      this.container.appendChild(ship);
    });
  }
}