export default class Ship {
  constructor(name, length, horizontal = true) {
    this.name = name;
    this.length = length;
    this.horizontal = horizontal;
    this.hits = 0;
  }

  hit() {
    this.hits += 1;
  }

  isSunk() {
    return this.hits >= this.length;
  }
}
