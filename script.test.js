describe("getBoardDimensions() retrieves board size", () => {
    it("should return valid input numbers", () => {
        expect(getBoardDimensions()).toEqual({columns: 7, rows: 6});
        columnsEle.value = 4;
        rowsEle.value = 4;
        expect(getBoardDimensions()).toEqual({columns: 4, rows: 4});
        columnsEle.value = 14;
        rowsEle.value = 12;
        expect(getBoardDimensions()).toEqual({columns: 14, rows: 12});
    });
    afterAll(() => {
        columnsEle.value = 7;
        rowsEle.value = 6;
    });
});

describe("createBoard() generates a board", () => {
    beforeEach(() => {
        boardSize = getBoardDimensions();
    });
    it("should create correct number of columns", () => {
        expect(createBoard(boardSize).length).toEqual(7);
        boardSize.columns = 4;
        expect(createBoard(boardSize).length).toEqual(4);
        boardSize.columns = 14;
        expect(createBoard(boardSize).length).toEqual(14);
    });
    it("should create correct number of rows", () => {
        expect(createBoard(boardSize)[0].length).toEqual(6);
        boardSize.rows = 4;
        expect(createBoard(boardSize)[0].length).toEqual(4);
        boardSize.rows = 12;
        expect(createBoard(boardSize)[0].length).toEqual(12);
    });
    afterEach(() => {
        boardSize = undefined;
    });
});

describe("addHTML() should add the HTML for the game board", () => {
    it("should create correct board dimensions from size", () => {
        addHTML({columns: 7, rows: 6});
        expect(gameEle.childElementCount).toEqual(7 * 6);
        gameEle.innerHTML = "";
        addHTML({columns: 4, rows: 4});
        expect(gameEle.childElementCount).toEqual(4 * 4);
        gameEle.innerHTML = "";
        addHTML({columns: 14, rows: 12});
        expect(gameEle.childElementCount).toEqual(14 * 12);
    });
    afterAll(() => {
        gameEle.innerHTML = "";
    });
});

describe("hasSpace() determines if spaces are free", () => {
    const spot = {
        dataset: {
            column: 0,
            row: 0
        }
    };
    beforeEach(() => {
        boardSize = getBoardDimensions();
        addHTML(boardSize);
        board = createBoard(boardSize);
        spot.dataset.column = 0;
        spot.dataset.row = 0;
    });
    it("should see empty space in column", () => {
        expect(hasSpace(spot)).toEqual(true);
        spot.dataset.column = 4;
        spot.dataset.row = 2;
        expect(hasSpace(spot)).toEqual(true);
        spot.dataset.column = 6;
        spot.dataset.row = 5;
        expect(hasSpace(spot)).toEqual(true);
    });
    it("should see full column", () => {
        board[0] = [1, 2, 1, 2, 1, 2];
        expect(hasSpace(spot)).toEqual(false);
        board[4] = [1, 2, 1, 2, 1, 2];
        spot.dataset.column = 4;
        spot.dataset.row = 2;
        expect(hasSpace(spot)).toEqual(false);
        board[6] = [1, 2, 1, 2, 1, 2];
        spot.dataset.column = 6;
        spot.dataset.row = 5;
        expect(hasSpace(spot)).toEqual(false);
    });
    afterEach(() => {
        gameEle.innerHTML = "";
        board = undefined;
        boardSize = undefined;
    });
});


// Find space

// place token

// update html

// check win

// horizontal

// vertical

// diagonals

// isTied

// displays

