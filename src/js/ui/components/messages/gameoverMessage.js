import replaceScreen from "../../../utils/screenReplacer";
import Message from "./message";

export default class GameoverMessage extends Message {
  constructor(selector, targetSelector) {
    super(selector, () => replaceScreen(selector, targetSelector));

    this.winner = this.container.querySelector(".message-text-winner");
  }

  open(player) {
    super.open();

    this.winner.textContent = `${player.name} won the game!`;
  }
}
