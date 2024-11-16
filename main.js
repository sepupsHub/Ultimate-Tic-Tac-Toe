const spaces = document.getElementsByClassName("element");
const grids = document.getElementsByClassName("grid-container");
const movePar = document.getElementById("movePar");
let isRunning = false;
let turn = 0;
let gridId = 0;
const spacesCopy = Array.from(spaces);

function toMove() {
  if (turn % 2 === 0) {
    return "X";
  } else return "O";
}

function getGridIdFromSpace(space) {
  let grid = space.parentElement;
  let gridId = grid.getAttribute("data-grid-id");
  return parseInt(gridId);
}

function getGridElements(gridId) {
  return Array.from(spacesCopy).slice((gridId - 1) * 9, gridId * 9);
}

function getNewGridId(space) {
  let newGridId = getGridIdFromSpace(space);
  let spaceArray = getGridElements(newGridId);
  for (let i = 0; i < spaceArray.length; i++) {
    if (space === spaceArray[i]) {
        grids[gridId].classList.remove('active')
      gridId = i + 1;
      let gridText = grids[gridId].textContent;
      grids[gridId].classList.add('active')
      if (gridText === "X" || gridText === "O") {
        grids[gridId].classList.remove('active')
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

function checkSpaces(spaceArray) {
  if (spaceArray[0] != "X" && spaceArray[0] != "O") {
    return false;
  }
  if (
    spaceArray[0] === spaceArray[1] &&
    spaceArray[0] === spaceArray[2] &&
    spaceArray[1] === spaceArray[2]
  )
    return true;
  return false;
}

function checkGrid(grid) {
    let gridText = grid.textContent
    let curGridId = grid.getAttribute("data-grid-id");
    console.log(gridText)
    console.log(curGridId)
    console.log(gridId)
    if ((gridText == "X" || gridText == "O") && curGridId == gridId) {
        grid.classList.remove('active');
        gridId = 0;
      }
}

function checkWin(space) {
  let spaceArray;
  if (space.className == "element") {
    spaceArray = getGridElements(getGridIdFromSpace(space));
  } else spaceArray = space;
  spaceArray = spaceArray.map((item) => {
    return item.textContent;
  });
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

function removeOnclick(space) {
  space.onclick = "";
}

function winCelebration() {
  console.log("WIENER");
  for (let space of spaces) {
    removeOnclick(space);
  }
  movePar.textContent = "The Winner is " + toMove();
  isRunning = false;
}

function markGrid(space) {
  let grid = grids[getGridIdFromSpace(space)];
  grid.textContent = toMove();
  checkGrid(grid);

  grid.classList.add('marked')
}

function changeMovePar() {
  movePar.textContent = toMove() + movePar.textContent.slice(1);
}

function handler(space) {
  if (!canPlaceAt(space)) {
    return;
  }
  space.textContent = toMove();
  removeOnclick(space);
  if (checkWin(space)) {
    markGrid(space);
    if (checkWin(Array.from(grids).slice(1, 11))) {
      winCelebration();
    }
  }
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

isRunning = true;
if (isRunning) {
  spaceClickEvent();
}
