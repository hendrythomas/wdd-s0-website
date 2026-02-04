document.addEventListener("DOMContentLoaded", () => {
  positionGameTiles();
});

addEventListener("keydown", (e) => {
  gameUpdate(e);
});

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

function gameUpdate(e) {
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
  
  gameReact();
}

function gameReact() {
  // player nav collision
  const player = document.querySelector("#player");
  if (player === null) return;
  
  const game = document.querySelector("#game");
  if (game === null) return;
  
  const playerX = Number(window.getComputedStyle(player).gridColumn);
  const playerY = Number(window.getComputedStyle(player).gridRow);

  for (const tile of game.children) {
    if (tile.id === "player") continue;
    
    const tileX = Number(window.getComputedStyle(tile).gridColumn);
    const tileY = Number(window.getComputedStyle(tile).gridRow);
    
    if (playerX === tileX &&
        playerY === tileY
    ) {
      const tileHref = tile.getAttribute("href");
      if (tileHref === null) return;

      tile.click();
    }
  }
}