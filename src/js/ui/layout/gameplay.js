import copyShipsArray from "../../utils/arrayUtil";
import GameplayGrid from "../components/grid/gameplayGrid";
import Ships from "../components/ships/ships";

export default class Gameplay {
  constructor(shipsArr, onGameOver) {
    this.shipsArr = copyShipsArray(shipsArr);
    this.onGameOver = onGameOver;

    this.wrapper = document.querySelector(".gameplay");

    this.player1 = null;
    this.player2 = null;

    this.elements = {
      player1: this.createElements("player-1"),
      player2: this.createElements("player-2"),
    };
  }

  init(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;

    [player1, player2].forEach((player, index) => {
      const elements = this.elements[`player${index + 1}`];
      const { grid, ships, name } = elements;
      const opponentGrid = this.elements[`player${index === 0 ? 2 : 1}`].grid;

      grid.init(player, opponentGrid);
      grid.active = index === 1;

      name.textContent = player.name;
      ships.render(copyShipsArray(this.shipsArr));

      if (index === 0) this.activate(elements, false);
    });
  }

  createGrid(selector) {
    return new GameplayGrid(
      selector,
      this.onActiveChange.bind(this),
      this.onShipSunk.bind(this),
      this.onGameOver.bind(this)
    );
  }

  createElements(selector) {
    const wrapper = document.querySelector(`.gameplay-wrapper-${selector}`);

    return {
      name: wrapper.querySelector(`.gameplay-name-${selector}`),
      grid: this.createGrid(`.grid-gameplay-${selector}`),
      ships: new Ships(`.gameplay-ships-${selector}`, "ship-gameplay"),
    };
  }

  getElements(player) {
    if (player === this.player1) return this.elements.player1;
    if (player === this.player2) return this.elements.player2;

    return null;
  }

  // eslint-disable-next-line class-methods-use-this
  activate(elements, active) {
    const { name, grid } = elements;
    const { container } = grid;

    if (!active) {
      name.classList.add("gameplay-name-inactive");
      container.classList.add("grid-gameplay-inactive");
    } else {
      name.classList.remove("gameplay-name-inactive");
      container.classList.remove("grid-gameplay-inactive");
    }
  }

  onActiveChange(activePlayer) {
    const inactivePlayer =
      activePlayer === this.player1 ? this.player2 : this.player1;

    this.activate(this.getElements(activePlayer), true);
    this.activate(this.getElements(inactivePlayer), false);
  }

  onShipSunk(player, ship) {
    const elements = this.getElements(player);
    if (!elements) return;

    const { ships } = elements;
    const shipElement = ships.container.querySelector(
      `[data-name="${ship.name}"]`
    );

    shipElement.classList.add("ship-gameplay-sunk");
  }
}
