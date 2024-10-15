import { replaceScreen } from "../../../utils/visibility";
import Message from "./message";

export default class GameoverMessage extends Message {
  constructor(selector, targetSelector, flipScreen) {
    super(
      selector,
      () => {
        flipScreen.setHidden(targetSelector);
        replaceScreen(selector, targetSelector);
      },
      flipScreen
    );

    this.winner = this.container.querySelector(".message-text-winner");
  }

  open(player) {
    super.open();

    this.winner.textContent = `${player.name} won the game!`;
  }
}
