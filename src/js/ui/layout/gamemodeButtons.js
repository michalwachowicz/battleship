import createGamemodeButton from "../components/buttons/gamemodeButton";
import friendIcon from "../../../assets/icons/friend.svg";
import botIcon from "../../../assets/icons/bot.svg";
import gameplayManager from "../gameplayManager";
import Player from "../../classes/player/player";
import screenMessages from "../components/messages/screenMessages";

const main = document.querySelector(".main");
const section = document.querySelector(".gamemode-btns");

export default function createGamemodeSection() {
  const friendBtn = createGamemodeButton("FRIEND", friendIcon, () => {
    main.classList.add("hidden");
    screenMessages.get("hideScreen").open();
  });

  const botBtn = createGamemodeButton("BOT", botIcon, () => {
    const player = new Player(false);
    const bot = new Player(true);

    gameplayManager.startGame(".main", player, bot);
  });

  section.append(friendBtn, botBtn);
}
