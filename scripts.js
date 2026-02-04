document.addEventListener("DOMContentLoaded", () => {
  positionGameTiles();
});

addEventListener("keydown", (e) => {
  gameUpdate(e);
});

function limitCell(cellElem, gridElem) {
  if (gridElem === null) return;
  if (cellElem === null) return;
  
  const gridStyle = window.getComputedStyle(gridElem);
  const x = Number(window.getComputedStyle(player).gridColumn);
  const y = Number(window.getComputedStyle(player).gridRow);

  const gridWidth  = gridStyle.getPropertyValue("grid-template-columns").split(" ").length;
  const gridHeight = gridStyle.getPropertyValue("grid-template-rows").split(" ").length;

  if (x > gridWidth) {
    cellElem.style.gridColumn = gridWidth;
  }
  if (y > gridHeight) {
    cellElem.style.gridRow = gridHeight;
  }
}

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
  const playerElem = document.querySelector("#player");
  if (playerElem === null) return;

  const x = Number(window.getComputedStyle(playerElem).gridColumn);
  const y = Number(window.getComputedStyle(playerElem).gridRow);
  switch (e.key) {
    case "d":
      playerElem.style.gridColumn = x + 1;
      break;
    case "a":
      playerElem.style.gridColumn = x - 1;
      break;
    case "s":
      playerElem.style.gridRow = y + 1;
      break;
    case "w":
      playerElem.style.gridRow = y - 1;
      break;
  }
  
  limitTiles();
  gameReact();
}

function limitTiles() {
  const gameElem = document.querySelector("#game");
  if (gameElem === null) return;
  
  for (const tile of gameElem.children) {
    limitCell(tile, gameElem);
  }
}

function gameReact() {
  // player nav collision
  const playerElem = document.querySelector("#player");
  if (playerElem === null) return;
  
  const gameElem = document.querySelector("#game");
  if (gameElem === null) return;
  
  const playerX = Number(window.getComputedStyle(playerElem).gridColumn);
  const playerY = Number(window.getComputedStyle(playerElem).gridRow);

  for (const tile of gameElem.children) {
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