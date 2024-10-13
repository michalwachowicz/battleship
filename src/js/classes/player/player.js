import getRandomCoordinates from "../../utils/coordsUtil";
import Gameboard from "../gameboard/gameboard";

export default class Player {
  constructor(computer = false) {
    this.computer = computer;
    this.gameboard = new Gameboard();
  }

  attack({ gameboard }, x, y) {
    if (!this.computer) return gameboard.receiveAttack(x, y);

    const { x: randomX, y: randomY } = getRandomCoordinates(gameboard);
    return gameboard.receiveAttack(x || randomX, y || randomY);
  }
}
