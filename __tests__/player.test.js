import getRandomCoordinates from "../src/js/utils/coordsUtil";
import Player from "../src/js/game/player";

describe("Player", () => {
  let opponent;

  beforeEach(() => {
    opponent = new Player();
  });

  describe("Human player", () => {
    it("attacks opponent", () => {
      const player = new Player();

      expect(player.attack(opponent, 1, 1)).toBe(true);
      expect(opponent.gameboard.grid[1][1]).toEqual({
        ship: null,
        attacked: true,
      });
    });
  });

  describe("Computer player", () => {
    let computer;

    beforeEach(() => {
      computer = new Player(true);
    });

    it("attacks opponent with specific coords", () => {
      expect(computer.attack(opponent, 1, 1)).toBe(true);
      expect(opponent.gameboard.grid[1][1]).toEqual({
        ship: null,
        attacked: true,
      });
    });

    it("attacks opponent with random coords", () => {
      const { x, y } = getRandomCoordinates(opponent.gameboard);

      expect(computer.attack(opponent, x, y)).toBe(true);
      expect(
        opponent.gameboard.grid.flat().filter(({ attacked }) => attacked)
      ).toHaveLength(1);
    });
  });
});
