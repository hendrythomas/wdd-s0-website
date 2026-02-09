document.addEventListener("DOMContentLoaded", () => {
  setGridSize();
  displayWorld();
  createInput();
});

addEventListener("resize", (e) => {
  setGridSize();
  displayWorld();
});

function setGridSize() {
  // get content rect
  const contentElem = document.querySelector("#content");
  if (contentElem === null) return;

  // get tile size
  const gameElem = document.querySelector("#game");
  if (gameElem === null) return;
  const gameStyle = window.getComputedStyle(gameElem);
  const tileSizePx = gameStyle.getPropertyValue("--tile-size");
  const tileSize = parseInt(tileSizePx);
  if (tileSize === NaN) return;

  // set grid size (uneven)
  const gameCols = 2 * Math.floor(contentElem.offsetWidth / tileSize / 2) - 1;
  const gameRows = 2 * Math.floor(contentElem.offsetHeight / tileSize / 2) - 1;
  game.style.setProperty("--cols", gameCols);
  game.style.setProperty("--rows", gameRows);
}

function displayWorld() {
  const gameElem = document.querySelector("#game");
  if (gameElem === null) return;
  const playerElem = gameElem.querySelector(".player");
  if (playerElem === null) return;
  
  // get center
  const gameStyle = window.getComputedStyle(gameElem);
  const gameCols = gameStyle.getPropertyValue("grid-template-columns").split(" ").length;
  const gameRows = gameStyle.getPropertyValue("grid-template-rows").split(" ").length;

  const centerCol = Math.ceil(gameCols / 2);
  const centerRow = Math.ceil(gameRows / 2);
  
  // place tiles
  for (const tileElem of gameElem.children) {
    const tileX = Number(tileElem.getAttribute("data-x"));
    const tileY = Number(tileElem.getAttribute("data-y"));
    //TODO: return if not number
    tileElem.style.gridColumn = tileX + centerCol;
    tileElem.style.gridRow    = tileY + centerRow;
  }
  // playerElem.style.gridColumn = centerCol;
  // playerElem.style.gridRow    = centerRow;
}

function createInput() {}

// document.addEventListener("DOMContentLoaded", () => {
//   insertData();
//   saveGameSize();
//   positionGameTiles();
// });

// setInterval(updateGame, 500);

// addEventListener("keydown", (e) => {
//   gameInput(e);
// });

// function insertData() {
//   const nameElem = document.querySelector('[data-insert="name"]');
//   const githubElem = document.querySelector('[data-insert="github"]');
//   const birthdateElem = document.querySelector('[data-insert="birthdate"]');
//   const emojiElem = document.querySelector('[data-insert="emoji"]');

//   getData().then((result) => {
//     const data = result.data[0];

//     nameElem.textContent = data.name;
//     githubElem.textContent = data.github_handle;
//     birthdateElem.textContent = data.birthdate;
//     emojiElem.textContent = data.fav_emoji;
//   });
// }

// async function getData() {
//   const fdnfId = 324;
//   const url = `https://fdnd.directus.app/items/person/?filter={"id":"${fdnfId}"}`;
//   try {
//     const response = await fetch(url);
//     const result = await response.json();
//     return(result);
//   }
//   catch (error) {
//     console.error(error.message);
//   }
// }


// // game

// const cars = [];

// function updateGame() {
//   gameMoveObjects();
//   gameLimitTiles();
//   gameReact();
// }

// function positionGameTiles() {
//   const gameElem = document.querySelector("#game");
//   if (gameElem === null) return;

//   for (const tile of gameElem.children) {
//     const placeX = tile.getAttribute("data-x");
//     const placeY = tile.getAttribute("data-y");
//     tile.style.gridColumn = placeX;
//     tile.style.gridRow    = placeY;
//   }
// }

// let gameWidth;
// let gameLength;

// function saveGameSize() {
//   const gameElem = document.querySelector("#game");
//   if (gameElem === null) return;
//   const gameStyle = window.getComputedStyle(gameElem);
//   gameWidth  = gameStyle.getPropertyValue("grid-template-columns").split(" ").length;
//   gameHeight = gameStyle.getPropertyValue("grid-template-rows").split(" ").length;
// }

// function gameInput(e) {
//   gameMovePlayer(e);
//   gameLimitTiles();
//   gameReact();
// }

// function gameMovePlayer(e) {
//   const playerElem = document.querySelector("#player");
//   if (playerElem === null) return;

//   const x = Number(window.getComputedStyle(playerElem).gridColumn);
//   const y = Number(window.getComputedStyle(playerElem).gridRow);
//   switch (e.key) {
//     case "d":
//       playerElem.style.gridColumn = x + 1;
//       break;
//     case "a":
//       playerElem.style.gridColumn = x - 1;
//       break;
//     case "s":
//       playerElem.style.gridRow = y + 1;
//       break;
//     case "w":
//       playerElem.style.gridRow = y - 1;
//       break;
//   }
// }

// function gameMoveObjects() {
//   const gameElem = document.querySelector("#game");
//   if (gameElem === null) return;

//   // move cars
//   const cars = gameElem.getElementsByClassName("car");
//   for (const car of cars) {
//     const x = Number(window.getComputedStyle(car).gridColumn);
//     if (x > 1) {
//       car.style.gridColumn = x - 1;
//     }
//     else {
//       car.style.gridColumn = gameWidth;
//     }
//   }
// }

// function gameLimitTiles() {
//   const gameElem = document.querySelector("#game");
//   if (gameElem === null) return;

//   for (const tile of gameElem.children) {
//     const x = Number(window.getComputedStyle(tile).gridColumn);
//     const y = Number(window.getComputedStyle(tile).gridRow);
//     if (x < 1) {
//       tile.style.gridColumn = 1;
//     }
//     if (y < 1) {
//       tile.style.gridRow = 1;
//     }
//     if (x > gameWidth) {
//       tile.style.gridColumn = gameWidth;
//     }
//     if (y > gameHeight) {
//       tile.style.gridRow = gameHeight;
//     }
//   }
// }

// function gameReact() {
//   // player tile collision
//   const playerElem = document.querySelector("#player");
//   if (playerElem === null) return;
  
//   const gameElem = document.querySelector("#game");
//   if (gameElem === null) return;
  
//   const playerX = Number(window.getComputedStyle(playerElem).gridColumn);
//   const playerY = Number(window.getComputedStyle(playerElem).gridRow);

//   for (const tile of gameElem.children) {
//     if (tile.id === "player") continue;
    
//     const tileX = Number(window.getComputedStyle(tile).gridColumn);
//     const tileY = Number(window.getComputedStyle(tile).gridRow);
    
//     if (playerX === tileX &&
//         playerY === tileY
//     ) {
//       // go to tile's href
//       const tileHref = tile.getAttribute("href");
//       if (tileHref === null) return;

//       tile.click();

//       if (tile.classList.contains("car")) {
//         // return to spawn position
//         const playerSpawnX = playerElem.getAttribute("data-x");
//         const playerSpawnY = playerElem.getAttribute("data-y");
//         playerElem.style.gridColumn = playerSpawnX;
//         playerElem.style.gridRow    = playerSpawnY;
//       }
//     }
//   }
// }