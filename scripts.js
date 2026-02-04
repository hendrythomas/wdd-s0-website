let gameWidth;
let gameLength;

document.addEventListener("DOMContentLoaded", () => {
  positionGameTiles();

  const gameElem = document.querySelector("#game");
  if (gameElem === null) return;
  const gameStyle = window.getComputedStyle(gameElem);
  gameWidth  = gameStyle.getPropertyValue("grid-template-columns").split(" ").length;
  gameHeight = gameStyle.getPropertyValue("grid-template-rows").split(" ").length;
});

addEventListener("keydown", (e) => {
  gameUpdate(e);
});


// game

function positionGameTiles() {
  const gameElem = document.querySelector("#game");
  if (gameElem === null) return;

  for (const tile of gameElem.children) {
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
  
  gameLimitTiles();
  gameReact();
}

function gameLimitTiles() {
  const gameElem = document.querySelector("#game");
  if (gameElem === null) return;

  for (const tile of gameElem.children) {
    const x = Number(window.getComputedStyle(tile).gridColumn);
    const y = Number(window.getComputedStyle(tile).gridRow);
    if (x > gameWidth) {
      tile.style.gridColumn = gameWidth;
    }
    if (y > gameHeight) {
      tile.style.gridRow = gameHeight;
    }
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