import Player from "../../../classes/player/player";
import Message from "./message";

export default function createScreenMessages(gameplayManager) {
  return {
    hideScreen: new Message(
      ".message-hide-screen",
      () => {
        const player1 = new Player("PLAYER 1", false);
        const player2 = new Player("PLAYER 2", false);

        gameplayManager.init(".message-hide-screen", player1, player2);
      },
      gameplayManager.flipScreen
    ),
    passScreen: new Message(
      ".message-pass-screen",
      () => {
        gameplayManager.openSecondPlayerShipPlacement(".message-pass-screen");
      },
      gameplayManager.flipScreen
    ),
  };
}
