// the playing board
const gameEle = document.querySelector("#game");
// game options form
const formEle = document.querySelector("form");
// game options inputs
const columnsEle = formEle.querySelector("#columns");
const rowsEle = formEle.querySelector("#rows");
// board variables
let boardSize, board;
let currentPlayer = 'a';
// end message element
const msgEle = document.querySelector("#message");

// returns user selected board height & width
function getBoardDimensions() {
    // extracts values from form inputs
    const columns = parseInt(columnsEle.value);
    const rows = parseInt(rowsEle.value);
    return {columns, rows};
}

// returns a newly generated blank board
function createBoard(size) {
    const board = [];
    let {columns, rows} = size;
    for (let c = 0; c < columns; c++) {
        const column = [];
        for (let r = 0; r < rows; r++) {
            column.push(0);
        }
        board.push(column);
    }
    return board;
}

// adds the HTML board
function addHTML(size) {
    const {columns, rows} = size;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const div = document.createElement("div");
            div.dataset.column = c;
            div.dataset.row = r;
            div.classList.add("spot");
            gameEle.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
            gameEle.append(div);
        }
    }
}

// checks if the column has an empty spot to go in
function hasSpace(spot) {
    const {column} = spot.dataset;
    return board[column].some(val => !val);
}

// returns the bottom most empty space in a column
function findSpace(spot) {
    const {column} = spot.dataset;
    let counter = boardSize.rows - 1;
    while (counter) {
        if (!board[column][counter]) break;
        counter--;
    }
    return {column, row: counter};
}

// fills in the board spot
function placeToken(spot) {
    const {column, row} = spot;
    board[column][row] = currentPlayer;
}

// updates the spot to taken in the HTML
function updateHTML(spot) {
    const {column, row} = spot;
    // find the selcted spot in the DOM
    const spacesArr = [...gameEle.children];
    const spaceEle = spacesArr.find(space => (
        space.dataset.column == column
        && space.dataset.row == row
    ));
    // update the GUI
    spaceEle.classList.add(currentPlayer);
    // token to be dropped
    const piece = document.createElement("span");
    spaceEle.append(piece);
}

// check win
function hasWon(spot) {
    return [
        lineWin(spot, true),
        lineWin(spot, false),
        diagonalsWin()
    ].some(bool => bool);
}

// won by line
function lineWin(spot, isVertical) {
    const {column, row} = spot;
    const {columns, rows} = boardSize;
    let count = 0;
    for (let i = 0; i < (isVertical ? rows: columns); i++) {
        if ((isVertical ? board[column][i]: board[i][row]) === currentPlayer) count++;
        else count = 0;
        if (count === 4) return true;
    }
    return false;
}

// won by diagonals
function diagonalsWin() {
    const {columns, rows} = boardSize;
    function isValid(group) {
        return group.every(([c, r]) => (
            c >= 0 &&
            r >= 0 &&
            c < columns &&
            r < columns &&
            board[c][r] === currentPlayer
        ));
    }
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows; r++) {
            const southEast = [[c, r], [c + 1, r + 1], [c + 2, r + 2], [c + 3, r + 3]];
            const southWest = [[c, r], [c + 1, r - 1], [c + 2, r - 2], [c + 3, r - 3]];
            if (isValid(southEast) || isValid(southWest)) return true;
        }
    }
    return false;
}

// check if game is tied
function isTied() {
    return board.every(col => col.every(row => row));
}

// displays an end game message
function display(msg) {
    msgEle.innerText = msg;
    msgEle.parentElement.classList.remove("hide");
}

// handles restart button
msgEle.addEventListener("click", e => {
    window.location.reload();
});

// handles the gameplay
function boardClick(e) {
    // handle any non spot clicks
    if (e.target.tagName !== "DIV") return;
    // clicked div
    const clickedSpot = e.target;
    // handle unailable columns
    if (!hasSpace(clickedSpot)) return;
    const foundSpot = findSpace(clickedSpot);
    // fills up a spot
    placeToken(foundSpot);
    updateHTML(foundSpot);
    // checks if game is won
    if(hasWon(foundSpot)) {
        display(`Player ${currentPlayer === 'a' ? "red": "blue"} has won!`);
        gameEle.removeEventListener("click", boardClick);
    }
    // checks if game is tied
    if (isTied()) {
        display("Oh no, it's a tied game!");
        gameEle.removeEventListener("click", boardClick);
    }
    // changes player
    currentPlayer = currentPlayer === 'a' ? 'b': 'a';
}

// user started game
formEle.addEventListener("submit", e => {
    e.preventDefault();
    // update boardSize to final dimensions
    boardSize = getBoardDimensions();
    // update generated board
    board = createBoard(boardSize);
    // create the HTML with it
    addHTML(boardSize);
    // remove the form
    formEle.remove();
});

gameEle.addEventListener("click", boardClick);
