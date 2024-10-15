import Ships from "./ships";

export default class DraggableShips extends Ships {
  constructor(selector, onDragStart, onTouchStart, onTouchMove, onTouchEnd) {
    super(selector, "ship-draggable");

    this.onDragStart = onDragStart;
    this.onTouchStart = onTouchStart;
    this.onTouchMove = onTouchMove;
    this.onTouchEnd = onTouchEnd;
  }

  createShip(ship) {
    const shipElement = super.createShip(ship);

    shipElement.setAttribute("draggable", true);
    shipElement.addEventListener("dragstart", this.onDragStart);
    shipElement.addEventListener("touchstart", this.onTouchStart);
    shipElement.addEventListener("touchmove", this.onTouchMove);
    shipElement.addEventListener("touchend", this.onTouchEnd);

    return shipElement;
  }
}
