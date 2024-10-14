import Ships from "../ships/ships";

export default class BotMessage {
  constructor(selector, shipsSelector, shipsArr) {
    this.container = document.querySelector(selector);
    this.ships = new Ships(shipsSelector, "ship-bot");
    this.shipsArr = shipsArr;
  }

  open(callback) {
    this.container.classList.remove("hidden");
    this.ships.render(this.shipsArr);

    const placedShips = [...this.shipsArr];

    const removeShip = () => {
      if (placedShips.length === 0) {
        callback();
        this.close();
      }

      const ship = placedShips.pop();
      if (ship && ship.name) {
        const shipElement = this.ships.container.querySelector(
          `[data-name="${ship.name}"]`
        );

        if (shipElement) shipElement.remove();
      }

      setTimeout(removeShip, 500);
    };

    removeShip();
  }

  close() {
    this.container.classList.add("hidden");
  }
}
