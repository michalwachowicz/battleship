import Ship from "../classes/ship/ship";

export default function copyShipsArray(arr) {
  return JSON.parse(JSON.stringify(arr)).map((item) => {
    const { name, length, horizontal, hits } = item;
    const ship = new Ship(name, length, horizontal);

    ship.hits = hits;
    return ship;
  });
}
