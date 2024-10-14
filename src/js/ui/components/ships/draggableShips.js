import Ships from "./ships";

export default class DraggableShips extends Ships {
  constructor(selector, onDragStart) {
    super(selector, "ship-draggable");

    this.onDragStart = onDragStart;
  }

  createShip(ship) {
    const shipElement = super.createShip(ship);

    shipElement.setAttribute("draggable", true);
    shipElement.addEventListener("dragstart", this.onDragStart);

    return shipElement;
  }
}
