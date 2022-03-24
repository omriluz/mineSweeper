"use strict";

function getTime() { } // get the exact current time

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function renderCars() {
    var strHTML = "";
    for (var i = 0; i < gCars.length; i++) {
        strHTML +=
            '<div class="car car' +
            (i + 1) +
            '"onclick="speedUp(' +
            i +
            ')"></div>';
    }
    // console.log('strHTML', strHTML);
    var elRoad = document.querySelector(".road");
    elRoad.innerHTML = strHTML;
}

function moveCars() {
    // Dom:
    var elCars = document.querySelectorAll(".car");
    // console.log('elCars', elCars);

    for (var i = 0; i < gCars.length; i++) {
        // Model:
        var car = gCars[i];
        // console.log('car', car);
        // Dom:
        var elCar = elCars[i];
        // console.log('elCar', elCar);

        // Update the Model:
        car.distance += car.speed;

        // Update the Dom:
        elCar.style.marginLeft = car.distance + "px";

        if (car.distance > 400) {
            console.log("Victory!", car.id);
            clearInterval(gIntervalId);
        }
    }
}

function copyMat(mat) {
    var newMat = [];
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = [];
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j];
        }
    }
    return newMat;
}

// creat copy
function copyMat(mat) {
    var newMat = [];
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = [];
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j];
        }
    }
    return newMat;
}

// sum col in mat
function sumCol(matrix, colIdx) {
    var sum = 0;
    for (var i = 0; i < matrix.length; i++) {
        var currRow = matrix[i];
        sum += currRow[colIdx];
    }
    return sum;
}

// sum row in mat
function sumRow(matrix, rowIdx) {
    var sum = 0;
    for (var i = 0; i < matrix[rowIdx].length; i++) {
        sum += matrix[rowIdx][i];
    }
    return sum;
}

// find max in mat
function findMax(matrix, colIdx) {
    var max = 0;
    var col = [];
    for (var i = 0; i < matrix.length; i++) {
        var currRow = matrix[i];
        col.push(currRow[colIdx]);
    }
    return (max = Math.max(...col));
}

// find avg in mat
function findAvg(matrix) {
    var sum = 0;
    var avg = null;
    var length = matrix.length * matrix[0].length;
    for (var i = 0; i < matrix.length; i++) {
        var currRow = matrix[i];
        for (var j = 0; j < currRow.length; j++) {
            var currNum = currRow[j];
            sum += currNum;
        }
    }
    return (avg = sum / length);
}

// find the sum in area
function sumArea(matrix, rowIdxStart, rowIdxEnd, colIdxStart, colIdxEnd) {
    var sum = 0;
    for (var i = rowIdxStart; i <= rowIdxEnd; i++) {
        var currRow = matrix[i];
        for (var j = colIdxStart; j <= colIdxEnd; j++) {
            var currNum = currRow[j];
            sum += currNum;
        }
    }
    return sum;
}

// check if the mat symmetric
function checkIfSymmetric(mat) {
    for (var i = 0; i < mat.length; i++) {
        var currRow = mat[i];
        for (var j = 0; j < currRow.length; j++) {
            if (mat[i][j] !== mat[j][i]) return false;
        }
    }
    return true;
}

// sum primary diagonal
function printPrimaryDiagonal(mat) {
    var sum = 0;
    for (var d = 0; d < mat.length; d++) {
        var item = mat[d][d];
        sum += item;
    }
    return sum;
}

// sum secondary diagonal
function printSecondaryDiagonal(mat) {
    var sum = 0;
    for (var d = 0; d < mat.length; d++) {
        var item = mat[d][mat.length - d - 1];
        sum += item;
    }
    return sum;
}

// reset nums
function resetNums() {
    var nums = [];
    for (var i = 1; i <= 25; i++) {
        nums.push(i);
    }
    gNums = nums;
}

// draw num
function drawNum() {
    var rNum = Math.floor(Math.random() * 25);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (rNum === board[i][j].value && board[i][j].isHit === false) {
                board[i][j].isHit = true;
                gPlayers[0].hitCount += 1;
            }
        }
    }
}

// creat board
function createBingoBoard(num) {
    resetNums();
    var board = [];
    for (var i = 0; i < num; i++) {
        board[i] = [];
        for (var j = 0; j < num; j++) {
            board[i][j] = { value: gNums.pop(), isHit: false };
        }
    }
    return board;
}

// print board
function printBingoBoard(board) {
    var boardToPrint = [];
    for (var i = 0; i < board.length; i++) {
        boardToPrint[i] = [];
        for (var j = 0; j < board.length; j++) {
            // console.log(board[i][j]);
            boardToPrint[i][j] = board[i][j].value;
            // console.log(boardToPrint[i][j]);
            if (board[i][j].isHit === true) boardToPrint[i][j] = "v"; //לבדוק אם לשים += לפני V
        }
    }
    console.table(boardToPrint);
}

// random color
function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// get time
function getTime() {
    return new Date().toString().split(" ")[4];
}

// function renderBoard(board) {
//     var strHTML = "";
//     for (var i = 0; i < board.length; i++) {
//         strHTML += "<tr>";
//         for (var j = 0; j < board[0].length; j++) {

//         }
//         strHTML += "</tr>";
//     }
//     var boardEl = document.querySelector('.board')
//     boardEl.innerHTML = strHTML 
// }

function renderCars() {
    var strHTML = "";
    for (var i = 0; i < gCars.length; i++) {
        strHTML +=
            '<div class="car car' +
            (i + 1) +
            '"onclick="speedUp(' +
            i +
            ')"></div>';
    }
    // console.log('strHTML', strHTML);
    var elRoad = document.querySelector(".road");
    elRoad.innerHTML = strHTML;
}

function moveCars() {
    // Dom:
    var elCars = document.querySelectorAll(".car");
    // console.log('elCars', elCars);

    for (var i = 0; i < gCars.length; i++) {
        // Model:
        var car = gCars[i];
        // console.log('car', car);
        // Dom:
        var elCar = elCars[i];
        // console.log('elCar', elCar);

        // Update the Model:
        car.distance += car.speed;

        // Update the Dom:
        elCar.style.marginLeft = car.distance + "px";

        if (car.distance > 400) {
            console.log("Victory!", car.id);
            clearInterval(gIntervalId);
        }
    }
}

function copyMat(mat) {
    var newMat = [];
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = [];
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j];
        }
    }
    return newMat;
}

function countNeighbors(mat, rowIdx, colIdx, condition, conditionBool) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = mat[i][j]

            // what cell needs to be to count
            if (cell[condition] === conditionBool) {
                count++
            }
        }
    }
    return count
}

function createMat(size) {
    var mat = []
    for (var i = 0; i < size; i++) {
        mat[i] = []
        for (var j = 0; j < size; j++) {
            mat[i].push('')
        }
    }
    return mat
}

function getRandomIntsInclusive(min, max, amount) {
    // WARNING, infinite loop happens if chosen more elements to can be provided
    // I.E: (1,5, 6)
    var arr = []
    for (var i = 0; i < amount; i++) {
        var randInt = getRandomIntInclusive(min, max)
        while (arr.includes(randInt)) {
            randInt = getRandomIntInclusive(min, max)
        }
        arr.push(randInt)
    }
    return arr
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* 
function modalMat(length) {
    var mat = [];
    for (var i = 0; i < length; i++) {
        mat[i] = [];
        for (var j = 0; j < length; j++) {
            mat[i][j] = '';
        }
    }
    return mat;
  }
  
  function renderMat(mat, selector) {
      var strHTML = '<table border="1"><tbody>';
      for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
          var cell = mat[i][j];
          var className = 'cell cell-' + i + '-' + j;
          strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
        }
        strHTML += '</tr>'
      }
      strHTML += '</tbody></table>';
      var elContainer = document.querySelector(selector);
      elContainer.innerHTML = strHTML;
    }
    
    // location such as: {i: 2, j: 7}
    function renderCell(location, value) {
      // Select the elCell and set the value
      var elCell = document.querySelector(`.cell-${location.i}-${location.j}`);
      elCell.innerHTML = value;
    }
    
    function countNeighbors(cellI, cellJ, mat) {
      var neighborsCount = 0;
      for (var i = cellI - 1; i <= cellI + 1; i++) {
          if (i < 0 || i >= mat.length) continue;
          for (var j = cellJ - 1; j <= cellJ + 1; j++) {
              if (i === cellI && j === cellJ) continue;
              if (j < 0 || j >= mat[i].length) continue;
              // if (mat[i][j] === LIFE || mat[i][j] === SUPER_LIFE)
              if (mat[i][j]) neighborsCount++;
          }
      }
      return neighborsCount;
  }
  */