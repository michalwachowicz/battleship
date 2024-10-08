import Player from "../../../classes/player/player";
import gameplayManager from "../../gameplayManager";
import Message from "./message";

const messages = {
  hideScreen: new Message(".message-hide-screen", () => {
    const player1 = new Player(false);
    const player2 = new Player(false);

    gameplayManager.startGame(".message-hide-screen", player1, player2);
  }),
  passScreen: new Message(".message-pass-screen", () => {}),
};

const get = (key) => messages[key];

export default { get };
