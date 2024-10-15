import timeout from "../../../utils/timeout";
import Grid from "./grid";

export default class PlacementGrid extends Grid {
  constructor(selector) {
    super(selector);

    this.startX = -1;
    this.startY = -1;
    this.isDragging = false;

    this.container.addEventListener(
      "dragleave",
      this.resetHighlight.bind(this)
    );
  }

  highlightCells({ length, horizontal }, x, y, isValid) {
    for (let i = 0; i < length; i += 1) {
      const targetX = horizontal ? x : x + i;
      const targetY = horizontal ? y + i : y;
      const cell = this.container.querySelector(
        `.grid-item[data-x="${targetX}"][data-y="${targetY}"]`
      );

      if (cell) {
        cell.classList.remove("grid-item-valid");
        cell.classList.remove("grid-item-invalid");

        cell.classList.add(isValid ? "grid-item-valid" : "grid-item-invalid");
      }
    }
  }

  resetHighlight() {
    const gridItems = this.container.querySelectorAll(".grid-item");

    gridItems.forEach((item) => {
      item.classList.remove("grid-item-valid");
      item.classList.remove("grid-item-invalid");
    });
  }

  renderShip(ship, x, y) {
    const placedShip = super.renderShip(ship, x, y);

    placedShip.setAttribute("draggable", true);
    placedShip.addEventListener("mousedown", this.handleMouseDown.bind(this));
    placedShip.addEventListener("mousemove", this.handleMouseDown.bind(this));
    placedShip.addEventListener("mouseup", () =>
      this.handleMouseUp(ship, placedShip)
    );

    return placedShip;
  }

  rotateShip(ship, shipEl) {
    const shipElement = shipEl;
    if (!shipElement) return;

    const [startX, startY] = shipElement.style.gridArea.split(" / ");
    const x = parseInt(startX - 1, 10);
    const y = parseInt(startY - 1, 10);

    if (!this.gameboard.rotateShip(x, y)) {
      this.animateInvalidRotation(shipElement);
      return;
    }

    const horizontal = !(shipElement.dataset.horizontal === "true");
    shipElement.dataset.horizontal = horizontal;

    if (horizontal) shipElement.classList.remove("ship-placed-vertical");
    else shipElement.classList.add("ship-placed-vertical");

    shipElement.style.width = this.calculateShipWidth(y + 1, ship.length);
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

  // eslint-disable-next-line class-methods-use-this
  async animateInvalidRotation(element) {
    element.classList.add("rotation-invalid");
    await timeout(300);
    element.classList.remove("rotation-invalid");
  }
}
