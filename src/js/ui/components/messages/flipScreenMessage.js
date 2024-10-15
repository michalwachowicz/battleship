import flipImage from "../../../../assets/images/ui/flip-screen.svg";
import { hide, show } from "../../../utils/visibility";

export default class FlipScreenMessage {
  constructor(container, icon, defaultSelector = ".main") {
    this.container = document.querySelector(container);
    this.hiddenScreen = defaultSelector
      ? document.querySelector(defaultSelector)
      : null;

    document.querySelector(icon).innerHTML = flipImage;

    // eslint-disable-next-line no-restricted-globals
    screen.orientation.addEventListener("change", this.handleChange.bind(this));
    window.addEventListener("resize", this.handleChange.bind(this));
    window.addEventListener("load", this.handleChange.bind(this));
  }

  setHidden(element) {
    this.hiddenScreen =
      typeof element === "string" ? document.querySelector(element) : element;
  }

  open() {
    show(this.container);
    if (this.hiddenScreen) hide(this.hiddenScreen);
  }

  close() {
    hide(this.container);
    if (this.hiddenScreen) show(this.hiddenScreen);
  }

  handleChange() {
    if (window.innerHeight > window.innerWidth) this.open();
    else this.close();
  }
}
