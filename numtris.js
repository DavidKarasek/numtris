const gameBoard = document.getElementById("game-board");

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
let gameInterval;

// Initialize the game
function init() {
  currentPiece = getRandomPiece();
  currentPiecePosition = { x: numCols / 2, y: 0 };
  gameInterval = setInterval(updateGame, 500);
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
}

// Move the piece down
function movePieceDown() {
  // ...
}

// Move the piece left
function movePieceLeft() {
  // ...
}

// Move the piece right
function movePieceRight() {
  // ...
}

// Rotate the piece
function rotatePiece() {
  // ...
}

// Clear completed rows
function clearRows() {
  // ...
}

// Check if the game is over
function isGameOver() {
  // ...
}

// Render the game board
function renderBoard() {
  let output = "";
  for (let y = 0; y < numRows; y++) {
    for (let x = 0; x < numCols; x++) {
      const isCurrentPiece = currentPiece.shape.some((row, rowIndex) => {
        return row.some((cell, cellIndex) => {
          const pieceX = x - currentPiecePosition.x + cellIndex;
          const pieceY = y - currentPiecePosition.y + rowIndex;
          return (
            pieceX >= 0 &&
            pieceX < numCols &&
            pieceY >= 0 &&
            pieceY < numRows &&
            cell === 1
          );
        });
      });

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
    clearRows();
    if (isGameOver()) {
      clearInterval(gameInterval);
      alert("Game Over");
      return;
    }
    currentPiece = getRandomPiece();
    currentPiecePosition = { x: Math.floor(numCols / 2), y: 0 };
  }
  renderBoard();
}

// Event listeners for keyboard inputs
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    movePieceDown();
  } else if (e.key === "ArrowLeft") {
    movePieceLeft();
  } else if (e.key === "ArrowRight") {
    movePieceRight();
  } else if (e.key === " ") {
    rotatePiece();
  }
});

// Start the game
init();
