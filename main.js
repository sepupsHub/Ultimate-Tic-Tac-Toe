const spaces = document.getElementsByClassName("element");
const grids = document.getElementsByClassName("grid-container");
const movePar = document.getElementById("movePar");
let isRunning = false;
let turn = 0;
let gridId = 0;
const spacesCopy = Array.from(spaces);

// Utility functions
function toMove() {
  return turn % 2 === 0 ? "X" : "O";
}

function getGridIdFromSpace(space) {
  return parseInt(space.parentElement.getAttribute("data-grid-id"));
}

function getGridElements(gridId) {
  return spacesCopy.slice((gridId - 1) * 9, gridId * 9);
}

function removeOnclick(space) {
  space.onclick = null;
}

// Grid management functions
function setAllGridsActive() {
  for (let grid of grids) grid.classList.add("active");
}

function removeAllActive() {
  if (gridId === 0) for (let grid of grids) grid.classList.remove("active");
}

function getNewGridId(space) {
  removeAllActive();
  let newGridId = getGridIdFromSpace(space);
  let spaceArray = getGridElements(newGridId);
  for (let i = 0; i < spaceArray.length; i++) {
    if (space === spaceArray[i]) {
      grids[gridId].classList.remove("active");
      gridId = i + 1;
      let gridText = grids[gridId].textContent;
      grids[gridId].classList.add("active");
      if (gridText === "X" || gridText === "O") {
        setAllGridsActive();
        gridId = 0;
      }
      return;
    }
  }
}

function canPlaceAt(space) {
  let parentGridId = getGridIdFromSpace(space);
  if (gridId === 0 || gridId === parentGridId) {
    getNewGridId(space);
    return true;
  }
  return false;
}

function checkGrid(grid) {
  let gridText = grid.textContent;
  let curGridId = grid.getAttribute("data-grid-id");
  if ((gridText == "X" || gridText == "O") && curGridId == gridId) {
    grid.classList.remove("active");
    gridId = 0;
  }
}

function markGrid(space) {
  let grid = grids[getGridIdFromSpace(space)];
  let gridText = toMove();
  grid.textContent = gridText;
  checkGrid(grid);
  grid.classList.add("marked");
  changeSpaceColor(gridText, grid);
}

// Win checking functions
function checkSpaces(spaceArray) {
  if (spaceArray[0] != "X" && spaceArray[0] != "O") {
    return false;
  }
  return (
    spaceArray[0] === spaceArray[1] &&
    spaceArray[0] === spaceArray[2] &&
    spaceArray[1] === spaceArray[2]
  );
}

function checkWin(space) {
  let spaceArray =
    space.className == "element"
      ? getGridElements(getGridIdFromSpace(space))
      : space;
  spaceArray = spaceArray.map((item) => item.textContent);
  return (
    checkSpaces(spaceArray.slice(0, 3)) +
    checkSpaces(spaceArray.slice(3, 6)) +
    checkSpaces(spaceArray.slice(6, 9)) +
    checkSpaces([spaceArray[0], spaceArray[3], spaceArray[6]]) +
    checkSpaces([spaceArray[1], spaceArray[4], spaceArray[7]]) +
    checkSpaces([spaceArray[2], spaceArray[5], spaceArray[8]]) +
    checkSpaces([spaceArray[0], spaceArray[4], spaceArray[8]]) +
    checkSpaces([spaceArray[6], spaceArray[4], spaceArray[2]])
  );
}

// UI update functions
function changeSpaceColor(text, space) {
  if (text === "X") {
    space.classList.add("markX");
    grids[0].classList.add("gridO");
  } else {
    space.classList.add("markO");
    grids[0].classList.remove("gridO");
  }
}

function changeMovePar() {
  movePar.textContent = toMove() + movePar.textContent.slice(1);
}

function winCelebration() {
  for (let space of spaces) {
    removeOnclick(space);
  }
  movePar.textContent = "The Winner is " + toMove();
  isRunning = false;
}

// Event handler functions
function handler(space) {
  if (!canPlaceAt(space)) {
    return;
  }
  let spaceText = toMove();
  space.textContent = spaceText;
  removeOnclick(space);

  if (checkWin(space)) {
    markGrid(space);
    if (checkWin(Array.from(grids).slice(1, 11))) {
      winCelebration();
    }
  }
  changeSpaceColor(spaceText, space);
  turn++;
  if (isRunning) changeMovePar();
}

function spaceClickEvent() {
  for (let space of spaces) {
    space.onclick = function () {
      handler(space);
    };
  }
}

// Initialization
isRunning = true;
if (isRunning) {
  setAllGridsActive();
  spaceClickEvent();
}
