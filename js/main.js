'use strict'




// TODO: you cannot reveal a flagged cell)


/*
Game ends when:
o LOSE: when clicking a mine, all mines should be revealed
o WIN: all the mines are flagged, and all the other cells are
shown
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


const COVER = '⬛'
const FLAG = '🚩'
const MINE = '💥'
const ONE = '1️⃣'
const TWO = '2️⃣'
const EMPTY = '⬜'

// prevents context menu from opening
document.addEventListener('contextmenu', event => event.preventDefault());


const EASY_MODE = {
    SIZE: 4,
    MINES: 2
}
const MEDIUM_MODE = {
    SIZE: 8,
    MINES: 4
}
const HARD_MODE = {
    SIZE: 12,
    MINES: 6
}

// CHOOSE MODE HERE
var gLevel = {
    MODE: MEDIUM_MODE,
}

var gTimerIntervalId;

var gBoard = [];

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    victory: false
}


function gameInit() {
    // // game started
    // gGame.isOn = true;

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
    // will only activate timer once when gGame.shownCount === 1 is checked
    // need to be able to recursivly handle it as well
    if (gGame.isOn && gGame.shownCount === 1) {
        timer()
    }

    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';

        // element to render 
        var renderElement = COVER;

        for (var j = 0; j < board[i].length; j++) {
            // neutral color after every run
            var color = 'background-color: transparent;'
            // if cell has isShown === true show what is underneath 
            if (board[i][j].isShown) {
                if (board[i][j].isMine) {
                    renderElement = MINE;

                    // present all mines AND current cell should have BGC:red
                    var color = 'background-color:red'

                    // after mine is placed game is over 
                    gGame.isOn = false

                } else if (board[i][j].minesAroundCount === 1) {
                    renderElement = ONE;
                } else if (board[i][j].minesAroundCount === 2) {
                    renderElement = TWO;
                } else {
                    renderElement = EMPTY;
                }
            } else if (board[i][j].isMarked) {
                // TODO IF FLAG IS MARKED CANNOT RIGHT CLICK ELEMENT
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

    // show whats inside cell
    exposeCell(elCell)
}


function toggleFlag(cell) {

    var cellX = +cell.classList[1].split('-')[1]
    var cellY = +cell.classList[1].split('-')[2]

    // toggles the value of the cell's isMarked depending on current value
    gBoard[cellX][cellY].isMarked = gBoard[cellX][cellY].isMarked ? false : true;
    console.log(gBoard[cellX][cellY].isMarked)

    // add or remove 1 from Game object
    var count = gBoard[cellX][cellY].isMarked ? 1 : -1;
    gGame.markedCount += count


    // render the board after adding the flag 
    renderBoard(gBoard)
}

function exposeCell(cell) {

    // grab x an y of the cell 
    var cellX = +cell.classList[1].split('-')[1]
    var cellY = +cell.classList[1].split('-')[2]

    // check that the cell is not already shown before adding ++ to shownCount
    if (!gBoard[cellX][cellY].isShown) {

        // isShown of the cells turns to true, render it with
        gBoard[cellX][cellY].isShown = true
        gGame.shownCount++
    }

    if (gGame.shownCount >= 1) {
        gGame.isOn = true
    }


    // Rerender the board
    renderBoard(gBoard)
}

function checkGameOver() {
    // if number of marked and number of shown is the same as board size => player won
    if (!gGame.isOn) {
        console.log('you lost!!!!');
    }
    if (gGame.markedCount + gGame.shownCount === gLevel.MODE.SIZE ** 2) {
        gGame.victory = true;
    }

    if (gGame.victory) {
        console.log('you won')
        gGame.isOn = false
    }
}

function setMinesNegsCount(board, cellX, cellY) {
    return countNeighbors(board, cellX, cellY)
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


// BONUS: DO IF YOU HAVE ENOUGH TIME
function expandShown() {}