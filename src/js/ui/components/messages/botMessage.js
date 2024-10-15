import { replaceScreen } from "../../../utils/visibility";
import Ships from "../ships/ships";

export default class BotMessage {
  constructor(selector, shipsSelector, shipsArr, flipScreen) {
    this.container = document.querySelector(selector);
    this.ships = new Ships(shipsSelector, "ship-bot");
    this.shipsArr = shipsArr;
    this.flipScreen = flipScreen;
  }

  open(previous, callback) {
    this.flipScreen.setHidden(this.container);
    this.ships.render(this.shipsArr);

    replaceScreen(previous, this.container);

    const placedShips = [...this.shipsArr];

    const removeShip = () => {
      if (placedShips.length === 0) {
        callback();
        return;
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

    setTimeout(removeShip, 500);
  }
}
