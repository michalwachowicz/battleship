export default function createGamemodeButton(opponent, icon, callback) {
  const button = document.createElement("button");
  button.className = "btn btn-gamemode";

  const text = document.createElement("div");
  text.className = "btn-gamemode-text";

  const playText = document.createElement("div");
  playText.className = "btn-gamemode-text-play";
  playText.textContent = "PLAY VS.";

  const opponentText = document.createElement("div");
  opponentText.className = "btn-gamemode-text-opponent";
  opponentText.textContent = opponent;

  button.innerHTML = icon;

  text.append(playText, opponentText);
  button.appendChild(text);

  button.addEventListener("click", callback);

  return button;
}
