import Ship from "../classes/ship/ship";
import ShipPlacement from "./layout/shipPlacement";

class GameplayManager {
  constructor() {
    this.player1 = null;
    this.player2 = null;

    this.shipPlacement = new ShipPlacement(
      [
        new Ship("carrier", 5),
        new Ship("battleship", 4),
        new Ship("destroyer", 3),
        new Ship("submarine", 3),
        new Ship("small", 2),
      ],
      ".ship-placement-grid",
      ".ship-placement-ships",
      ".btn-randomize",
      ".btn-play"
    );
  }

  openShipPlacement(gameboard, previousSelector) {
    this.shipPlacement.init(gameboard);

    const previousScreen = document.querySelector(previousSelector);
    const container = document.querySelector(".ship-placement");

    previousScreen.classList.add("hidden");
    container.classList.remove("hidden");
  }

  startGame(previousSelector, player1, player2) {
    this.player1 = player1;
    this.player2 = player2;

    this.openShipPlacement(player1.gameboard, previousSelector);
  }
}

export default new GameplayManager();
