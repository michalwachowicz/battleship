import Gameboard from "./gameboard";

export default class Player {
  constructor(name = "HUMAN", computer = false) {
    this.name = name;
    this.computer = computer;
    this.gameboard = new Gameboard();
  }

  // eslint-disable-next-line class-methods-use-this
  attack({ gameboard }, x, y) {
    return gameboard.receiveAttack(x, y);
  }
}
