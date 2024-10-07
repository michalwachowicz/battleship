import createGamemodeButton from "../components/buttons/gamemodeButton";
import friendIcon from "../../../assets/icons/friend.svg";
import botIcon from "../../../assets/icons/bot.svg";

const section = document.querySelector(".gamemode-btns");

export default function createGamemodeSection() {
  const friendBtn = createGamemodeButton("FRIEND", friendIcon, () => {
    // TODO: Start game with friend
  });

  const botBtn = createGamemodeButton("BOT", botIcon, () => {
    // TODO: Start game with bot
  });

  section.append(friendBtn, botBtn);
}
