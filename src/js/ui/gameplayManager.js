import Ship from "../game/ship";
import { hide, replaceScreen } from "../utils/visibility";
import BotMessage from "./components/messages/botMessage";
import FlipScreenMessage from "./components/messages/flipScreenMessage";
import GameoverMessage from "./components/messages/gameoverMessage";
import createScreenMessages from "./components/messages/screenMessages";
import Gameplay from "./layout/gameplay";
import ShipPlacement from "./layout/shipPlacement";

class GameplayManager {
  constructor() {
    this.player1 = null;
    this.player2 = null;

    this.shipsArr = [
      new Ship("carrier", 5),
      new Ship("battleship", 4),
      new Ship("destroyer", 3),
      new Ship("submarine", 3),
      new Ship("small", 2),
    ];

    this.shipPlacement = new ShipPlacement(this.shipsArr, {
      wrapper: ".ship-placement",
      grid: ".grid-ship-placement",
      ships: ".ship-placement-ships",
      randomizeBtn: ".btn-randomize",
      playBtn: ".btn-play",
    });

    this.gameplay = new Gameplay(this.shipsArr, this.onGameOver.bind(this));
    this.flipScreen = new FlipScreenMessage(
      ".message-flip-screen",
      ".message-flip-screen-icon"
    );
    this.screenMessages = createScreenMessages(this);
    this.botMessage = new BotMessage(
      ".message-bot",
      ".message-bot-ships",
      this.shipsArr,
      this.flipScreen
    );
    this.gameOverMessage = new GameoverMessage(
      ".message-gameover",
      ".main",
      this.flipScreen
    );
  }

  init(previousSelector, player1, player2) {
    this.player1 = player1;
    this.player2 = player2;

    this.openShipPlacement(player1.gameboard, previousSelector, () => {
      if (this.player2.computer) {
        this.botMessage.open(this.shipPlacement.wrapper, () => {
          this.player2.gameboard.randomize(this.shipsArr);
          this.startGame(this.botMessage.container);
        });
      } else {
        this.flipScreen.setHidden(this.screenMessages.passScreen.container);
        replaceScreen(
          this.shipPlacement.wrapper,
          this.screenMessages.passScreen.container
        );
      }
    });
  }

  openShipPlacement(gameboard, previousSelector, onPlay) {
    this.shipPlacement.init(gameboard, onPlay);
    this.flipScreen.setHidden(this.shipPlacement.wrapper);
    replaceScreen(previousSelector, this.shipPlacement.wrapper);
  }

  openSecondPlayerShipPlacement(previousSelector) {
    this.openShipPlacement(this.player2.gameboard, previousSelector, () =>
      this.startGame(".ship-placement")
    );
  }

  startGame(previousSelector) {
    if (!this.player1 || !this.player2) return;

    this.gameplay.init(this.player1, this.player2);
    this.flipScreen.setHidden(this.gameplay.wrapper);
    replaceScreen(previousSelector, this.gameplay.wrapper);
  }

  resetShips() {
    const { player1, player2 } = this.gameplay.elements;

    [player1, player2].forEach(({ grid }) =>
      grid.player.gameboard.ships.forEach((ship) => ship.reset())
    );
  }

  onGameOver(player) {
    hide(this.gameplay.wrapper);

    this.resetShips();
    this.gameOverMessage.open(player);
  }
}

export default new GameplayManager();
