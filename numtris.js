const gameBoard = document.getElementById("game-board");
const nextPieceDisplay = document.getElementById("next-piece");

// Initialize game variables
const numRows = 20;
const numCols = 10;
const board = createEmptyBoard(numRows, numCols);

// Define the Tetris pieces
const pieces = [
  // I
  [[[1, 1, 1, 1]], [[1], [1], [1], [1]]],
  // J
  [
    [
      [1, 0, 0],
      [1, 1, 1],
    ],
    [
      [1, 1],
      [1, 0],
      [1, 0],
    ],
    [
      [1, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
  ],
  // L
  [
    [
      [0, 0, 1],
      [1, 1, 1],
    ],
    [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    [
      [1, 1, 1],
      [1, 0, 0],
    ],
    [
      [1, 1],
      [0, 1],
      [0, 1],
    ],
  ],
  // O
  [
    [
      [1, 1],
      [1, 1],
    ],
  ],
  // S
  [
    [
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 0],
      [1, 1],
      [0, 1],
    ],
  ],
  // T
  [
    [
      [0, 1, 0],
      [1, 1, 1],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 0],
    ],
    [
      [1, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [0, 1],
    ],
  ],
  // Z
  [
    [
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1],
      [1, 1],
      [1, 0],
    ],
  ],
];

// Game variables
let currentPiece;
let currentPiecePosition;
let nextPiece;
// let gameInterval;
let score = 0;

// Initialize the game
function init() {
  currentPiece = getRandomPiece();
  nextPiece = getRandomPiece();
  currentPiecePosition = { x: numCols / 2, y: 0 };
  // gameInterval = setInterval(updateGame, 500);
  updateGame();
}

function updateScoreDisplay() {
  const scoreValueElement = document.getElementById("score-value");
  scoreValueElement.textContent = score;
}

// Create an empty board
function createEmptyBoard(rows, cols) {
  const board = [];
  for (let i = 0; i < rows; i++) {
    board.push(new Array(cols).fill(" "));
  }
  return board;
}

// Generate a random piece
function getRandomPiece() {
  const pieceIndex = Math.floor(Math.random() * pieces.length);
  const rotationIndex = Math.floor(Math.random() * pieces[pieceIndex].length);
  return {
    shape: pieces[pieceIndex][rotationIndex],
    index: pieceIndex,
    rotationIndex: rotationIndex,
  };
}

// Check if a move is valid
function isValidMove(piece, position) {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] === 0) {
        continue;
      }

      const boardX = position.x + x;
      const boardY = position.y + y;

      if (boardX < 0 || boardX >= numCols || boardY >= numRows) {
        return false;
      }

      if (boardY < 0) {
        continue;
      }

      if (board[boardY][boardX] !== " ") {
        return false;
      }
    }
  }
  return true;
}

// Update the game board
function updateBoard(piece, position) {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x] === 1) {
        const boardX = position.x + x;
        const boardY = position.y + y;
        board[boardY][boardX] = "X";
      }
    }
  }
  clearFullRows();
}

// Move the piece down
function movePieceDown() {
  console.log("movePieceDown");
  let newPosition = {
    x: currentPiecePosition.x,
    y: currentPiecePosition.y + 1,
  };

  // Move the piece down until it is no longer valid
  while (isValidMove(currentPiece, newPosition)) {
    currentPiecePosition.y = newPosition.y;
    newPosition.y += 1;
  }

  // If the piece cannot move down any further, it has landed
  // updateBoard(currentPiece, currentPiecePosition);
  // if (isGameOver()) {
  //   clearInterval(gameInterval);
  //   alert("Game Over");
  //   return;
  // }
  // currentPiece = nextPiece;
  // nextPiece = getRandomPiece();
  // renderNextPiece();
  // currentPiecePosition = { x: Math.floor(numCols / 2), y: 0 };
}

// Move the piece left
function movePiece(amt) {
  const newPosition = {
    x: currentPiecePosition.x + amt,
    y: currentPiecePosition.y,
  };
  if (isValidMove(currentPiece, newPosition)) {
    currentPiecePosition.x = newPosition.x;
  }
}

// Rotate the piece
function rotatePiece() {
  const nextRotationIndex =
    (currentPiece.rotationIndex + 1) % pieces[currentPiece.index].length;
  console.log(currentPiece.rotationIndex, nextRotationIndex);
  const newShape = pieces[currentPiece.index][nextRotationIndex];

  if (isValidMove({ shape: newShape }, currentPiecePosition)) {
    currentPiece.shape = newShape;
    currentPiece.rotationIndex = nextRotationIndex;
  }
}

// Clear completed rows
function clearFullRows() {
  let rowsCleared = 0;
  for (let y = numRows - 1; y >= 0; ) {
    if (board[y].every((cell) => cell === "X")) {
      for (let y2 = y; y2 > 0; y2--) {
        board[y2] = board[y2 - 1];
      }
      board[0] = new Array(numCols).fill(" ");
      rowsCleared++;
    } else {
      y--;
    }
  }

  // Update the score based on the number of rows cleared
  if (rowsCleared > 0) {
    score += rowsCleared * 10;
    updateScoreDisplay();
  }
}

// Check if the game is over
function isGameOver() {
  const startPosition = { x: Math.floor(numCols / 2) - 1, y: 0 };
  return !isValidMove(currentPiece, startPosition);
}

function renderNextPiece() {
  let output = "";
  for (let y = 0; y < nextPiece.shape.length; y++) {
    for (let x = 0; x < nextPiece.shape[y].length; x++) {
      output += nextPiece.shape[y][x] === 1 ? "X" : " ";
    }
    output += "\n";
  }
  nextPieceDisplay.textContent = output;
}

// Render the game board
function renderBoard() {
  let output = "";
  for (let y = 0; y < numRows; y++) {
    for (let x = 0; x < numCols; x++) {
      let isCurrentPiece = false;
      for (let rowIndex = 0; rowIndex < currentPiece.shape.length; rowIndex++) {
        for (
          let cellIndex = 0;
          cellIndex < currentPiece.shape[rowIndex].length;
          cellIndex++
        ) {
          if (currentPiece.shape[rowIndex][cellIndex] === 0) {
            continue;
          }

          const pieceX = currentPiecePosition.x + cellIndex;
          const pieceY = currentPiecePosition.y + rowIndex;

          if (pieceX === x && pieceY === y) {
            isCurrentPiece = true;
          }
        }
      }

      output += isCurrentPiece ? "X" : board[y][x];
    }
    output += "\n";
  }
  gameBoard.textContent = output;
}

// Update the game state
function updateGame() {
  if (
    isValidMove(currentPiece, {
      x: currentPiecePosition.x,
      y: currentPiecePosition.y + 1,
    })
  ) {
    currentPiecePosition.y++;
  } else {
    updateBoard(currentPiece, currentPiecePosition);
    if (isGameOver()) {
      // clearInterval(gameInterval);
      score = 0;
      updateScoreDisplay();
      alert("Game Over");
      return;
    }
    currentPiece = nextPiece;
    nextPiece = getRandomPiece();
    renderNextPiece();
    currentPiecePosition = { x: Math.floor(numCols / 2), y: 0 };
  }
  renderBoard();

  const interval = 500 - Math.floor(score / 100) * 50;
  const clampedInterval = Math.max(100, interval);

  setTimeout(updateGame, clampedInterval);
}

// Event listeners for keyboard inputs
document.addEventListener("keydown", (e) => {
  if (e.key === "s") {
    movePieceDown();
  } else if (e.key === "a") {
    movePiece(-1);
  } else if (e.key === "d") {
    movePiece(1);
  } else if (e.key === " ") {
    rotatePiece();
  }
});

document.getElementById("play-again").addEventListener("click", () => {
  resetGame();
  renderBoard();
});

// Start the game
init();
