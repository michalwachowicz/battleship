// Tested in player.test.js
export default function getRandomCoordinates(gameboard) {
  const { size } = gameboard;

  let x;
  let y;

  do {
    x = Math.floor(Math.random() * size);
    y = Math.floor(Math.random() * size);
  } while (gameboard.grid[x][y].attacked);

  return { x, y };
}
