export default function replaceScreen(previousSelector, currentSelector) {
  const previous = document.querySelector(previousSelector);
  const current = document.querySelector(currentSelector);

  previous.classList.add("hidden");
  current.classList.remove("hidden");
}
