document.addEventListener("DOMContentLoaded", () => {
  positionGameTiles();
});

addEventListener("keydown", (e) => {
  tryMovePlayer(e);
});

const navButtons = [];

function positionGameTiles() {
  const game = document.querySelector("#game");
  if (game === null) return;

  for (const tile of game.children) {
    const placeX = tile.getAttribute("data-x");
    const placeY = tile.getAttribute("data-y");
    tile.style.gridColumn = placeX;
    tile.style.gridRow    = placeY;
  }
}

function tryMovePlayer(e) {
  const player = document.querySelector("#player");
  if (player === null) return;

  const x = Number(window.getComputedStyle(player).gridColumn);
  const y = Number(window.getComputedStyle(player).gridRow);
  switch (e.key) {
    case "d":
      player.style.gridColumn = x + 1;
      break;
    case "a":
      player.style.gridColumn = x - 1;
      break;
    case "s":
      player.style.gridRow = y + 1;
      break;
    case "w":
      player.style.gridRow = y - 1;
      break;
  }
}