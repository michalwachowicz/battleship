export default class Message {
  constructor(selector, onClick) {
    this.container = document.querySelector(selector);
    this.button = this.container.querySelector(".btn");

    this.button.addEventListener("click", onClick);
  }

  open() {
    this.container.classList.remove("hidden");
  }

  close() {
    this.container.classList.add("hidden");
  }
}
