import { hide, show } from "../../../utils/visibility";

export default class Message {
  constructor(selector, onClick) {
    this.container = document.querySelector(selector);
    this.button = this.container.querySelector(".btn");

    this.button.addEventListener("click", onClick);
  }

  open() {
    show(this.container);
  }

  close() {
    hide(this.container);
  }
}
