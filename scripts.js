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
let theme = 0;
let playerDir = { x: 0, y: 1 };
const spawnDistance = 4;

populateWorld();

document.addEventListener('DOMContentLoaded', () => {
  setGridSize();
  drawWorld();
  setInterval(moveTiles, 3000);
  addToggleTheme();
});

addEventListener('resize', (e) => {
  setGridSize();
  drawWorld();
});

document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase()
  handleInput(key);
  drawWorld();
});

function populateWorld() {
  // save class data
  getData().then((result) => {
    if (result === null) return;
    classData = result.data;
    console.log(classData);

    // place students
    const gameElem = document.querySelector('#game');
    if (gameElem === null) return;
    
    shuffleArray(classData);
    for (let i = 0; i < classData.length; i++) {
      const student = classData[i];
      const placeX = randInt(i, -i);
      const placeY = randInt(i, -i);

      // delete in spawn area
      // TODO: no
      if (placeX > -spawnDistance && placeX < spawnDistance &&
          placeY > -spawnDistance && placeY < spawnDistance
      ) {
        continue;
      }
      
      const npcIndex = randInt(0, numNpcs) + 1;
      const html = `<a class="npc t${npcIndex}" href="#profile" onclick="loadStudent('${student.id}')" data-x="${placeX}" data-y="${placeY}"></a>`;
      gameElem.insertAdjacentHTML('beforeend', html);
    }
    
    drawWorld();
  });
}

async function getData() {
  const url = 'https://fdnd.directus.app/items/person?filter[squads][squad_id][tribe][name]=CMD%20Minor%20Web%20Dev&filter[squads][squad_id][cohort]=2526';
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
  const bubble = document.querySelector('#main');
  if (bubble === null) return;

  const nameElem = bubble.querySelector('[data-insert="name"]');
  const avatarElem = bubble.querySelector('[data-insert="avatar"]');
  const githubElem = bubble.querySelector('[data-insert="github"]');
  const birthdateElem = bubble.querySelector('[data-insert="birthdate"]');
  const emojiElem = bubble.querySelector('[data-insert="emoji"]');
  const fruitElem = bubble.querySelector('[data-insert="fruit"]');
  const soupElem = bubble.querySelector('[data-insert="soup"]');

  if (nameElem !== null) {
    if (data.name) {
      nameElem.textContent = data.name;
    } else {
      nameElem.textContent = '???';
    }
  }

  if (avatarElem !== null) {
    if (data.avatar) {
      avatarElem.src = data.avatar;
    } else {
      avatarElem.src = './assets/clown.png';
    }
  }
  
  if (githubElem !== null) {
    if (data.github_handle) {
      githubElem.textContent = data.github_handle;
    } else {
      githubElem.textContent = 'No class';
    }
  }
  
  if (birthdateElem !== null) {
    if (data.birthdate) {
      birthdateElem.textContent = data.birthdate;
    } else {
      birthdateElem.textContent = '???';
    }
  }

  if (emojiElem !== null)
    emojiElem.textContent = data.fav_emoji;
  
  if (soupElem !== null) {
    if (data.fav_soup) {
      soupElem.textContent = data.fav_soup;
    } else {
      soupElem.textContent = 'none';
    }
  }

  if (fruitElem !== null) {
    if (data.fav_fruit) {
      fruitElem.textContent = data.fav_fruit;
    } else {
      fruitElem.textContent = 'none';
    }
  }
}

function setGridSize() {
  // get content rect
  const contentElem = document.querySelector('#content');
  if (contentElem === null) return;

  // get tile size
  const gameElem = document.querySelector('#game');
  if (gameElem === null) return;

  const gameStyle = window.getComputedStyle(gameElem);
  const tileSizePx = gameStyle.getPropertyValue('--tile-size');
  const tileSize = parseInt(tileSizePx);
  if (isNaN(tileSize)) return;

  // set grid size (uneven)
  const gameCols = 2 * Math.floor(contentElem.offsetWidth / tileSize / 2) + 1;
  const gameRows = 2 * Math.floor(contentElem.offsetHeight / tileSize / 2) + 1;
  gameElem.style.setProperty('--cols', gameCols);
  gameElem.style.setProperty('--rows', gameRows);
}

function drawWorld() {
  const gameElem = document.querySelector('#game');
  if (gameElem === null) return;
  const playerElem = gameElem.querySelector('.player');
  if (playerElem === null) return;

  // center on player
  const playerX = parseInt(playerElem.dataset.x);
  const playerY = parseInt(playerElem.dataset.y);
  if (isNaN(playerX)) return;
  if (isNaN(playerY)) return;

  const gameStyle = window.getComputedStyle(gameElem);
  const gameCols = gameStyle.getPropertyValue('grid-template-columns').split(' ').length;
  const gameRows = gameStyle.getPropertyValue('grid-template-rows').split(' ').length;
  const centerCol = Math.ceil(gameCols / 2) - playerX;
  const centerRow = Math.ceil(gameRows / 2) - playerY;
  
  for (const tileElem of gameElem.children) {
    // set tile sprite
    let tileSpriteX = parseInt(tileElem.dataset.spriteX);
    let tileSpriteY = parseInt(tileElem.dataset.spriteY);

    if (!isNaN(tileSpriteX))
      tileElem.style.backgroundPositionX = `calc(${tileSpriteX} * -100%)`;
    if (!isNaN(tileSpriteY))
      tileElem.style.backgroundPositionY = `calc(${tileSpriteY} * -100%)`;

    // place tiles
    let tileX = Number(tileElem.dataset.x);
    let tileY = Number(tileElem.dataset.y);
    
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
      tileElem.classList.add('invisible');
    } else {
      tileElem.classList.remove('invisible');
    }
  }
}

function moveTiles() {
  const npcElems = document.querySelectorAll('.npc:not(.invisible), .enemy:not(.invisible)');
  for (const npcElem of npcElems) {
    const direction = randInt(0, 8);
    switch(direction) {
      case 0:
        npcElem.dataset.x = Number(npcElem.dataset.x) + 1;
        npcElem.dataset.spriteY = 2;
        break;
      case 1:
        npcElem.dataset.x = Number(npcElem.dataset.x) - 1;
        npcElem.dataset.spriteY = 1;
        break;
      case 2:
        npcElem.dataset.y = Number(npcElem.dataset.y) + 1;
        npcElem.dataset.spriteY = 0;
        break;
      case 3:
        npcElem.dataset.y = Number(npcElem.dataset.y) - 1;
        npcElem.dataset.spriteY = 3;
        break;
      default:
        npcElem.dataset.spriteY = 0;
        break;
    }
  }
  drawWorld();
}

function handleInput(key) {
  const gameElem = document.querySelector('#game');
  if (gameElem === null) return;
  const playerElem = gameElem.querySelector('.player');
  if (playerElem === null) return;

  const playerX = Number(playerElem.dataset.x);
  const playerY = Number(playerElem.dataset.y);
  if (isNaN(playerX)) return;
  if (isNaN(playerY)) return;
  
  switch (key) {
    case 'd':
      playerElem.dataset.x = playerX + 1;
      playerElem.dataset.spriteY = 2;
      playerDir.x = 1;
      playerDir.y = 0;
      break;
    case 'a':
      playerElem.dataset.x = playerX - 1;
      playerElem.dataset.spriteY = 1;
      playerDir.x = -1;
      playerDir.y = 0;
      break;
    case 's':
      playerElem.dataset.y = playerY + 1;
      playerElem.dataset.spriteY = 0;
      playerDir.x = 0;
      playerDir.y = 1;
      break;
    case 'w':
      playerElem.dataset.y = playerY - 1;
      playerElem.dataset.spriteY = 3;
      playerDir.x = 0;
      playerDir.y = -1;
      break;
    case ' ':
      useNearTile();
      break;
  }
}

function useNearTile() {
  const gameElem = document.querySelector('#game');
  if (gameElem === null) return;
  const playerElem = gameElem.querySelector('.player');
  if (playerElem === null) return;

  const playerX = Number(playerElem.dataset.x);
  const playerY = Number(playerElem.dataset.y);
  if (isNaN(playerX)) return;
  if (isNaN(playerY)) return;
  
  let tileElem;
  tileElem = gameElem.querySelector(`[data-x="${playerX + playerDir.x}"][data-y="${playerY + playerDir.y}"]`);
  if (tileElem === null) return;

  if (tileElem.classList.contains('enemy')) {
    tileElem.remove();
  } else {
    tileElem.click();
  }
}

function addToggleTheme() {
  const toggleThemeElem = document.querySelector('#toggle-theme');
  if (toggleThemeElem === null) return;

  toggleThemeElem.addEventListener('change', () => {
    onToggleTheme();
  })
}

function onToggleTheme() {
  if (theme === 0) {
    const bodyElem = document.querySelector('body');
    if (bodyElem === null) return;
    bodyElem.classList.add('night');

    const npcElems = document.querySelectorAll('.npc');
    for (const npcElem of npcElems) {
      npcElem.classList.remove('npc');
      npcElem.classList.add('enemy');
    }
    theme = 1;
  }
  else {
    const bodyElem = document.querySelector('body');
    if (bodyElem === null) return;
    bodyElem.classList.remove('night');

    const enemies = document.querySelectorAll('.enemy');
    for (const enemy of enemies) {
      enemy.classList.remove('enemy');
      enemy.classList.add('npc');
    }
    theme = 0;
  }
}

// function gameMoveObjects() {
//   const gameElem = document.querySelector('#game');
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