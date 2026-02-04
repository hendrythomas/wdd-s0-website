document.addEventListener("DOMContentLoaded", () => {
  saveGameSize();
  positionGameTiles();
});

setInterval(updateGame, 500);

addEventListener("keydown", (e) => {
  gameInput(e);
});

const cars = [];


// game

function updateGame() {
  gameMoveObjects();
  gameLimitTiles();
  gameReact();
}

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

let gameWidth;
let gameLength;

function saveGameSize() {
  const gameElem = document.querySelector("#game");
  if (gameElem === null) return;
  const gameStyle = window.getComputedStyle(gameElem);
  gameWidth  = gameStyle.getPropertyValue("grid-template-columns").split(" ").length;
  gameHeight = gameStyle.getPropertyValue("grid-template-rows").split(" ").length;
}

function gameInput(e) {
  gameMovePlayer(e);
  gameLimitTiles();
  gameReact();
}

function gameMovePlayer(e) {
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
}

function gameMoveObjects() {
  const gameElem = document.querySelector("#game");
  if (gameElem === null) return;

  // move cars
  const cars = gameElem.getElementsByClassName("car");
  for (const car of cars) {
    const x = Number(window.getComputedStyle(car).gridColumn);
    if (x > 1) {
      car.style.gridColumn = x - 1;
    }
    else {
      car.style.gridColumn = gameWidth;
    }
  }
}

function gameLimitTiles() {
  const gameElem = document.querySelector("#game");
  if (gameElem === null) return;

  for (const tile of gameElem.children) {
    const x = Number(window.getComputedStyle(tile).gridColumn);
    const y = Number(window.getComputedStyle(tile).gridRow);
    if (x < 1) {
      tile.style.gridColumn = 1;
    }
    if (y < 1) {
      tile.style.gridRow = 1;
    }
    if (x > gameWidth) {
      tile.style.gridColumn = gameWidth;
    }
    if (y > gameHeight) {
      tile.style.gridRow = gameHeight;
    }
  }
}

function gameReact() {
  // player tile collision
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
      // go to tile's href
      const tileHref = tile.getAttribute("href");
      if (tileHref === null) return;

      tile.click();

      if (tile.classList.contains("car")) {
        // return to spawn position
        const playerSpawnX = playerElem.getAttribute("data-x");
        const playerSpawnY = playerElem.getAttribute("data-y");
        playerElem.style.gridColumn = playerSpawnX;
        playerElem.style.gridRow    = playerSpawnY;
      }
    }
  }
}