import Gameboard from "../gameboard/gameboard";

export default class Player {
  constructor(computer = false) {
    this.computer = computer;
    this.gameboard = new Gameboard();
  }

  attack(opponent, x, y) {
    const { gameboard } = opponent;
    if (!this.computer) return gameboard.receiveAttack(x, y);

    const { x: randomX, y: randomY } = this.getRandomCoordinates();
    return gameboard.receiveAttack(x || randomX, y || randomY);
  }

  getRandomCoordinates() {
    const x = Math.floor(Math.random() * this.gameboard.size);
    const y = Math.floor(Math.random() * this.gameboard.size);

    return { x, y };
  }
}
