'use strict'
/*
● Support 3 levels of the game
o Beginner (4*4 with 2 MINES)
o Medium (8 * 8 with 12 MINES)
o Expert (12 * 12 with 30 MINES)
● If you have the time, make your Minesweeper look great.
● Expanding: When left clicking on cells there are 3 possible
cases we want to address:
o MINE – reveal the mine clicked
o Cell with neighbors – reveal the cell alone
o Cell without neighbors – expand it and its 1st degree
neighbors
*/


// add smiley functionality
// BUGFIX openRecursively needs to open cells until it reaches mines and not one cell after it


const COVER = ''
const FLAG = '🚩'
const MINE = '💥'

const NUMBERS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣']
const EMPTY = '0️⃣'

// prevents context menu from opening
document.addEventListener('contextmenu', event => event.preventDefault());

const EASY_MODE = {
    SIZE: 4,
    MINES: 2
}
const MEDIUM_MODE = {
    SIZE: 8,
    MINES: 12
}
const HARD_MODE = {
    SIZE: 12,
    MINES: 30
}

// CHOOSE MODE HERE
var gLevel = {
    MODE: EASY_MODE,
}

var gTimerIntervalId;

var gBoard = [];

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    victory: false,
    defeat: false,
    isTimer: false
}

var gFlagClickedOnce = false


function gameInit() {
    // create the matrix in according to what level im playing at
    createBoard()

    // render the board
    renderBoard(gBoard)
}


function createBoard() {
    // inside the loop should decide on a random place to put the mines, 
    // and should only put the EXACT amount of mines in the mode 
    // create model and after update DOM

    // Array of random indexes to insert minesinto board
    var minesIndex = getRandomIntsInclusive(0, (gLevel.MODE.SIZE ** 2) - 1,
        gLevel.MODE.MINES)
    var minesCount = 0

    var board = createMat(gLevel.MODE.SIZE)
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j] = {
                isShown: false,

                // checks if it has mines inside it if it does true else false  
                isMine: minesIndex.includes(minesCount),

                isMarked: false
            }
            minesCount++

        }
    }
    // another for loop to add minesAroundCount since only after creation ill know where the mines are
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            board[i][j].minesAroundCount = setMinesNegsCount(board, i, j)
        }
    }
    gBoard = board
}



function renderBoard(board) {
    var numbersColor = 'background-color:#1a3c9b'

    // activate timer
    if (!gGame.isTimer) {
        if (gGame.isOn && gGame.shownCount === 1 || gGame.markedCount === 1) {
            timer();
            gGame.isTimer = true
        }
    }

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';

        // element to render 
        var renderElement = COVER;

        for (var j = 0; j < board[i].length; j++) {
          
            // neutral color after every run
            var color = 'background-color: gray;'

            // if cell has isShown === true show what is underneath 
            if (board[i][j].isShown) {
               
                if (board[i][j].isMine) {
                    renderElement = MINE;

                    // present all mines AND cell should have BGC:red
                    var color = 'background-color:red'

                    // after mine is placed game is over 
                    gGame.isOn = false

                } else if (board[i][j].minesAroundCount) {
                    var color = numbersColor
                    renderElement = NUMBERS[board[i][j].minesAroundCount - 1];
                } else {
                    renderElement = EMPTY;
                    color = 'background-color:green';
                }
            } else if (board[i][j].isMarked) {
                renderElement = FLAG;
            }
            else {
                renderElement = COVER;
            }
            strHTML += `<td style="${color}" class="cell cell-${i}-${j}" oncontextmenu="cellRightClick(this)" onclick="cellLeftClick(this)">${renderElement}</td>`
        }
        strHTML += '</tr>';
    }
    var boardEl = document.querySelector('.board')
    boardEl.innerHTML = strHTML

    // dont run if game hasnt started
    if (gGame.shownCount !== 0) {
        checkGameOver();
    }

}

function cellRightClick(elCell) {
    // change gboard is marked of element to true and render anew
    toggleFlag(elCell)

}

function cellLeftClick(elCell) {
    // grab the cells values in gBoard
    var cellX = elCell.classList[1].split('-')[1];
    var cellY = elCell.classList[1].split('-')[2];
    var cell = gBoard[cellX][cellY];

    // checks if cell is flagged
    if (cell.isMarked) return;

    // show whats inside cell
    exposeCell(elCell)
}


function toggleFlag(cell) {

    if (!gFlagClickedOnce) {
        if (!gGame.defeat) {
            gGame.isOn = true;
            gFlagClickedOnce = true
        }
    }

    // toggle flag only if game is on
    if (gGame.isOn) {

        var cellX = +cell.classList[1].split('-')[1]
        var cellY = +cell.classList[1].split('-')[2]

        // toggles the value of the cell's isMarked depending on current value
        gBoard[cellX][cellY].isMarked = gBoard[cellX][cellY].isMarked ? false : true;

        // add or remove 1 from Game object
        var count = gBoard[cellX][cellY].isMarked ? 1 : -1;
        gGame.markedCount += count


        // render the board after adding the flag 
        renderBoard(gBoard)
    }
}

function exposeCell(cell) {
    // grab x an y of the cell 
    var cellX = +cell.classList[1].split('-')[1]
    var cellY = +cell.classList[1].split('-')[2]

    // check that the cell is not already shown before adding ++ to shownCount
    if (!gBoard[cellX][cellY].isShown) {

        // show mines only if the game is still active
        if (!gGame.victory) {
            if (!gGame.defeat) {

                // isShown of the cells turns to true
                gBoard[cellX][cellY].isShown = true
                gGame.shownCount++

                // openRecursively(gBoard, cellX, cellY);
            }
        }
    }
    if (gGame.shownCount === 1) {
        gGame.isOn = true
    }



    // check if mine is shown
    // if mine is clicked expose all mines 
    exposeAllMines(cellX, cellY)

    // Rerender the board
    renderBoard(gBoard)
}

function checkGameOver() {
    if (!gGame.isOn && gGame.defeat) {
        console.log('you lost!!!!');
        stopTimer()
    }

    // if number of marked and number of shown is the same as board size => player won
    if (gGame.markedCount === gLevel.MODE.MINES) {
        if (gGame.shownCount + gGame.markedCount === gLevel.MODE.SIZE ** 2) {
            gGame.victory = true;
        }
    }

    if (gGame.victory) {
        console.log('you won')
        stopTimer()
        gGame.isOn = false
    }
}

function setMinesNegsCount(board, cellX, cellY) {
    return countNeighbors(board, cellX, cellY, 'isMine', true)
}

function timer() {
    var startTime = Date.now()
    gTimerIntervalId = setInterval(function () {
        var timerEl = document.querySelector('.timer')
        // update model first
        gGame.secsPassed = Math.floor((Date.now() - startTime) / 1000)

        // update DOM with Model
        timerEl.innerText = gGame.secsPassed
    }, 1000)

}

function exposeAllMines(cellX, cellY) {
    if (gBoard[cellX][cellY].isMine) {
        // player lost 
        gGame.defeat = true
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[i].length; j++) {
                if (gBoard[i][j].isMine) {
                    gBoard[i][j].isShown = true
                }
            }
        }
    }
}

function levelChosen(level) {
    // reinitiate all game variables to start a new game
    if (gTimerIntervalId !== undefined) {
        stopTimer()
        gTimerIntervalId = undefined
    }
    var timerEl = document.querySelector('.timer')
    timerEl.innerText = '0'

    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        victory: false,
        defeat: false,
        isTimer: false
    }



    // choose the level 
    gLevel.MODE = level
    createBoard()
    renderBoard(gBoard)
}

function stopTimer() {
    clearInterval(gTimerIntervalId)
}

// not working yet.
function openRecursively(board, cellX, cellY) {

    for (var i = cellX - 1; i <= cellX + 1; i++) {
            if (i < 0 || i > board.length - 1) continue
            for (var j = cellY - 1; j <= cellY + 1; j++) {
                if (j < 0 || j > board[0].length - 1) continue
                if (i === cellX && j === cellY) continue
                var cell = board[i][j]
                console.log(cell)

                // what cell needs to be to count
                if (!cell.isMine) {
                    cell.isShown =true
                }
            }
        }
}

