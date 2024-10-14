import createGamemodeButton from "../components/buttons/gamemodeButton";
import friendIcon from "../../../assets/icons/friend.svg";
import botIcon from "../../../assets/icons/bot.svg";
import gameplayManager from "../gameplayManager";
import Player from "../../classes/player/player";
import { hide } from "../../utils/visibility";

const main = document.querySelector(".main");
const section = document.querySelector(".gamemode-btns");

export default function createGamemodeSection() {
  const friendBtn = createGamemodeButton("FRIEND", friendIcon, () => {
    hide(main);
    gameplayManager.screenMessages.hideScreen.open();
  });

  const botBtn = createGamemodeButton("BOT", botIcon, () => {
    const player = new Player();
    const bot = new Player("BOT", true);

    gameplayManager.init(".main", player, bot);
  });

  section.append(friendBtn, botBtn);
}
