const canvas = document.getElementById("game-board");
const nextPieceDisplay = document.getElementById("next-piece");

// Initialize game variables
const numRows = 20;
const numCols = 10;
const board = createEmptyBoard(numRows, numCols);

const cellSize = 20;
canvas.width = numCols * cellSize;
canvas.height = numRows * cellSize;
nextPieceDisplay.width = 4 * cellSize;
nextPieceDisplay.height = 4 * cellSize;

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
  renderNextPiece();
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

function getColorForValue(value) {
  const neonPinkGradient = ["#ff4dff", "#ff00ff", "#cc00cc"];
  const neonBlueGradient = ["#00bfff", "#0080ff", "#0066cc"];
  const neonGreenGradient = ["#00ff00", "#00cc00", "#009900"];

  if (value >= 1 && value <= 3) {
    const index = Math.floor(((value - 1) / 3) * neonPinkGradient.length);
    return neonPinkGradient[index];
  } else if (value >= 4 && value <= 6) {
    const index = Math.floor(((value - 4) / 3) * neonBlueGradient.length);
    return neonBlueGradient[index];
  } else if (value >= 7 && value <= 9) {
    const index = Math.floor(((value - 7) / 3) * neonGreenGradient.length);
    return neonGreenGradient[index];
  }

  return "#333"; // default color
}

function addPieceValue(piece, num) {
  if (num >= 2 && num <= 9) {
    for (let i = 0; i < piece.length; i++) {
      for (let j = 0; j < piece[i].length; j++) {
        if (piece[i][j] === 1) {
          piece[i][j] = num;
        }
      }
    }
  }
  return piece;
}

// Generate a random piece
function getRandomPiece() {
  const pieceIndex = Math.floor(Math.random() * pieces.length);
  const rotationIndex = Math.floor(Math.random() * pieces[pieceIndex].length);
  let piece = JSON.parse(JSON.stringify(pieces[pieceIndex][rotationIndex]));

  // If the generated number is between 2-9, replace all the 1's in the shape array with the generated number
  const num = Math.floor(Math.random() * 9) + 1;
  piece = addPieceValue(piece, num);

  return {
    shape: piece,
    index: pieceIndex,
    rotationIndex: rotationIndex,
    value: num,
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
      if (piece.shape[y][x] >= 1) {
        const boardX = position.x + x;
        const boardY = position.y + y;
        board[boardY][boardX] = piece.shape[y][x];
      }
    }
  }
  clearFullRows();
}

// Move the piece down
function movePieceDown() {
  let newPosition = {
    x: currentPiecePosition.x,
    y: currentPiecePosition.y + 1,
  };

  // Move the piece down until it is no longer valid
  while (isValidMove(currentPiece, newPosition)) {
    currentPiecePosition.y = newPosition.y;
    newPosition.y += 1;
  }
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
  const newShape = addPieceValue(
    pieces[currentPiece.index][nextRotationIndex],
    currentPiece.value
  );

  if (isValidMove({ shape: newShape }, currentPiecePosition)) {
    currentPiece.shape = newShape;
    currentPiece.rotationIndex = nextRotationIndex;
  }
}

// Clear completed rows
function clearFullRows() {
  let rowsCleared = 0;
  let currentScore = 0;
  for (let y = numRows - 1; y >= 0; ) {
    if (board[y].every((cell) => cell >= 1)) {
      let rowValue = 0;
      for (let x = 0; x < numCols; x++) {
        rowValue = rowValue + board[y][x];
        board[y][x] = " ";
      }
      currentScore += rowValue;
      rowsCleared++;
      for (let y2 = y; y2 > 0; y2--) {
        board[y2] = board[y2 - 1];
      }
      board[0] = new Array(numCols).fill(" ");
    } else {
      y--;
    }
  }

  // Update the score
  score += currentScore * rowsCleared;

  // Update the score based on the number of rows cleared
  if (rowsCleared > 0) {
    updateScoreDisplay();
  }
}

// Check if the game is over
function isGameOver() {
  const startPosition = { x: Math.floor(numCols / 2) - 1, y: 0 };
  return !isValidMove(currentPiece, startPosition);
}

function renderNextPiece() {
  const nextPieceContext = nextPieceDisplay.getContext("2d");

  // Clear the next piece canvas
  nextPieceContext.clearRect(
    0,
    0,
    nextPieceDisplay.width,
    nextPieceDisplay.height
  );

  for (let y = 0; y < nextPiece.shape.length; y++) {
    for (let x = 0; x < nextPiece.shape[y].length; x++) {
      if (nextPiece.shape[y][x] >= 1) {
        nextPieceContext.fillStyle = getColorForValue(nextPiece.shape[y][x]);
        nextPieceContext.fillRect(
          x * cellSize,
          y * cellSize,
          cellSize,
          cellSize
        );
        nextPieceContext.strokeStyle = "#333";
        nextPieceContext.strokeRect(
          x * cellSize,
          y * cellSize,
          cellSize,
          cellSize
        );

        // Center the number in the box
        nextPieceContext.fillStyle = "white";
        nextPieceContext.font = "bold 16px Arial";
        nextPieceContext.textAlign = "center";
        nextPieceContext.textBaseline = "middle";
        nextPieceContext.fillText(
          nextPiece.shape[y][x],
          x * cellSize + cellSize / 2,
          y * cellSize + cellSize / 2
        );
      }
    }
  }
}

// Render the game board
function renderBoard() {
  const context = canvas.getContext("2d");

  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the board
  for (let y = 0; y < numRows; y++) {
    for (let x = 0; x < numCols; x++) {
      const cell = board[y][x];

      if (cell !== " ") {
        context.fillStyle = getColorForValue(cell);
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        context.strokeStyle = "#333";
        context.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);

        // Center the number in the box
        context.fillStyle = "white";
        context.font = "bold 16px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(
          cell,
          x * cellSize + cellSize / 2,
          y * cellSize + cellSize / 2
        );
      }
    }
  }

  // Draw the current piece
  context.fillStyle = getColorForValue(currentPiece.value);
  for (let y = 0; y < currentPiece.shape.length; y++) {
    for (let x = 0; x < currentPiece.shape[y].length; x++) {
      if (currentPiece.shape[y][x] !== 0) {
        const boardX = currentPiecePosition.x + x;
        const boardY = currentPiecePosition.y + y;
        context.fillStyle = getColorForValue(currentPiece.value);
        context.fillRect(
          boardX * cellSize,
          boardY * cellSize,
          cellSize,
          cellSize
        );
        context.strokeStyle = "#333";
        context.strokeRect(
          boardX * cellSize,
          boardY * cellSize,
          cellSize,
          cellSize
        );
        context.fillStyle = "white";
        context.font = "bold 16px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(
          currentPiece.value,
          boardX * cellSize + cellSize / 2,
          boardY * cellSize + cellSize / 2 + 2
        );
      }
    }
  }
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
      // alert("Game Over");
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
