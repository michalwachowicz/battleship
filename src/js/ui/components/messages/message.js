import { hide, show } from "../../../utils/visibility";

export default class Message {
  constructor(selector, onClick, flipScreen) {
    this.container = document.querySelector(selector);
    this.button = this.container.querySelector(".btn");
    this.flipScreen = flipScreen;

    this.button.addEventListener("click", onClick);
  }

  open() {
    show(this.container);
    this.flipScreen.setHidden(this.container);
  }

  close() {
    hide(this.container);
  }
}
