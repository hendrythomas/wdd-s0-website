// function from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function randInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The minimum is inclusive and the maximum is exclusive 
}

// function from https://stackoverflow.com/a/12646864
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

let classData = [];
const numNpcs = 4;

populateWorld();

document.addEventListener("DOMContentLoaded", () => {
  setGridSize();
  displayWorld();
});

addEventListener("resize", (e) => {
  setGridSize();
  displayWorld();
});

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase()
  handleInput(key);
  displayWorld();
});

function populateWorld() {
  // save class data
  getData().then((result) => {
    if (result === null) return;
    classData = result.data;
    console.log(classData);

    // place students
    const gameElem = document.querySelector("#game");
    if (gameElem === null) return;
    
    shuffleArray(classData);
    for (let i = 0; i < classData.length; i++) {
      const student = classData[i];
      const placeX = randInt(i*1.5, -i*1.5);
      const placeY = randInt(i*1.5, -i*1.5);
      const npcIndex = randInt(0, numNpcs) + 1;
      
      const html = `<a class="npc t${npcIndex}" href="#0" onclick="loadStudent('${student.id}')" data-x="${placeX}" data-y="${placeY}"></a>`;
      gameElem.insertAdjacentHTML("beforeend", html);
    }

    //TODO: better async syntax
    displayWorld();
  });
}

async function getData() {
  const url = "https://fdnd.directus.app/items/person?filter[squads][squad_id][tribe][name]=CMD%20Minor%20Web%20Dev&filter[squads][squad_id][cohort]=2526";
  try {
    const response = await fetch(url);
    const result = await response.json();
    return(result);
  }
  catch (error) {
    console.error(error.message);
  }
}

function loadStudent(id) {
  const data = classData.find(student => {
    return student.id === parseInt(id);
  });
  if (data === undefined) return;

  if (isNaN(parseInt(id))) return;
  const bubble = document.querySelector("#main");
  if (bubble === null) return;

  const nameElem = bubble.querySelector('[data-insert="name"]');
  const avatarElem = bubble.querySelector('[data-insert="avatar"]');
  const githubElem = bubble.querySelector('[data-insert="github"]');
  const birthdateElem = bubble.querySelector('[data-insert="birthdate"]');
  const emojiElem = bubble.querySelector('[data-insert="emoji"]');

  if (nameElem !== null)
    nameElem.textContent = data.name;

  if (avatarElem !== null) {
    if (data.avatar) {
      avatarElem.src = data.avatar;
    } else {
      avatarElem.src = "./assets/clown.png";
    }
  }
  
  if (githubElem !== null)
    githubElem.textContent = data.github_handle;
  
  if (birthdateElem !== null)
    birthdateElem.textContent = data.birthdate;
  
  if (emojiElem !== null)
    emojiElem.textContent = data.fav_emoji;
}

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
  if (isNaN(tileSize)) return;

  // set grid size (uneven)
  const gameCols = 2 * Math.floor(contentElem.offsetWidth / tileSize / 2) + 1;
  const gameRows = 2 * Math.floor(contentElem.offsetHeight / tileSize / 2) + 1;
  game.style.setProperty("--cols", gameCols);
  game.style.setProperty("--rows", gameRows);
}

function displayWorld() {
  const gameElem = document.querySelector("#game");
  if (gameElem === null) return;
  const playerElem = gameElem.querySelector(".player");
  if (playerElem === null) return;

  // center on player
  const playerX = parseInt(playerElem.getAttribute("data-x"));
  const playerY = parseInt(playerElem.getAttribute("data-y"));
  if (isNaN(playerX)) return;
  if (isNaN(playerY)) return;

  const gameStyle = window.getComputedStyle(gameElem);
  const gameCols = gameStyle.getPropertyValue("grid-template-columns").split(" ").length;
  const gameRows = gameStyle.getPropertyValue("grid-template-rows").split(" ").length;
  const centerCol = Math.ceil(gameCols / 2) - playerX;
  const centerRow = Math.ceil(gameRows / 2) - playerY;
  
  for (const tileElem of gameElem.children) {
    // set tile sprite
    let tileSpriteX = parseInt(tileElem.getAttribute("data-sprite-x"));
    let tileSpriteY = parseInt(tileElem.getAttribute("data-sprite-y"));

    if (!isNaN(tileSpriteX))
      playerElem.style.backgroundPositionX = `calc(${tileSpriteX} * -100%)`;
    if (!isNaN(tileSpriteY))
      playerElem.style.backgroundPositionY = `calc(${tileSpriteY} * -100%)`;

    // place tiles
    let tileX = Number(tileElem.getAttribute("data-x"));
    let tileY = Number(tileElem.getAttribute("data-y"));
    
    if (!isNaN(parseInt(tileX)))
      tileElem.style.gridColumn = tileX + centerCol;
    if (!isNaN(parseInt(tileY)))
      tileElem.style.gridRow = tileY + centerRow;
    
    // hide off-screen tiles
    if (tileElem.style.gridColumn < 1 ||
        tileElem.style.gridColumn > gameCols ||
        tileElem.style.gridRow    < 1 ||
        tileElem.style.gridRow    > gameRows
    ) {
      tileElem.classList.add("invisible");
    } else {
      tileElem.classList.remove("invisible");
    }
  }
}

function handleInput(key) {
  const gameElem = document.querySelector("#game");
  if (gameElem === null) return;
  const playerElem = gameElem.querySelector(".player");
  if (playerElem === null) return;

  const playerX = Number(playerElem.getAttribute("data-x"));
  const playerY = Number(playerElem.getAttribute("data-y"));
  if (isNaN(playerX)) return;
  if (isNaN(playerY)) return;
  
  switch (key) {
    case "d":
      playerElem.dataset.x = playerX + 1;
      playerElem.dataset.spriteY = 2;
      break;
    case "a":
      playerElem.dataset.x = playerX - 1;
      playerElem.dataset.spriteY = 1;
      break;
    case "s":
      playerElem.dataset.y = playerY + 1;
      playerElem.dataset.spriteY = 0;
      break;
    case "w":
      playerElem.dataset.y = playerY - 1;
      playerElem.dataset.spriteY = 3;
      break;
    case " ":
      clickNearTile();
      break;
    case "n":
      // debug night mode
      const npcs = game.querySelectorAll(".npc");
      for (const npc of npcs) {
        npc.classList.remove("npc");
        npc.classList.add("enemy");
      }
      break;
  }
}

function clickNearTile() {
  const gameElem = document.querySelector("#game");
  if (gameElem === null) return;
  const playerElem = gameElem.querySelector(".player");
  if (playerElem === null) return;

  const playerX = Number(playerElem.getAttribute("data-x"));
  const playerY = Number(playerElem.getAttribute("data-y"));
  if (isNaN(playerX)) return;
  if (isNaN(playerY)) return;
  
  // get neighbouring tile
  let tileElem;
  tileElem =
    gameElem.querySelector(`[data-x="${playerX + 1}"][data-y="${playerY}"]`) ||
    gameElem.querySelector(`[data-x="${playerX - 1}"][data-y="${playerY}"]`) ||
    gameElem.querySelector(`[data-x="${playerX}"][data-y="${playerY + 1}"]`) ||
    gameElem.querySelector(`[data-x="${playerX}"][data-y="${playerY - 1}"]`);
  if (tileElem === null) return;

  tileElem.click();
}

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