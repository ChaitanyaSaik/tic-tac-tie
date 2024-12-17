const board = document.getElementById('game-board');
const resetBtn = document.getElementById('reset');
const playerInfo = document.getElementById('player-info');
const playerNameInput = document.getElementById('player-name'); // Input for player's name
let currentPlayer = 'X'; // Player X (human)
let gameBoard = ['', '', '', '', '', '', '', '', '']; // Empty game board
let gameActive = true;

// Create the game board (3x3 grid)
function createBoard() {
  board.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.setAttribute('data-index', i);
    square.addEventListener('click', handlePlayerMove);
    board.appendChild(square);
  }
  updatePlayerInfo(); // Update player info on board creation
}

// Handle human player moves
function handlePlayerMove(e) {
  const index = e.target.getAttribute('data-index');
  if (gameBoard[index] !== '' || !gameActive || currentPlayer !== 'X') return; // Human's turn
  gameBoard[index] = 'X';
  e.target.textContent = 'X';
  checkGameStatus();
  if (gameActive) {
    currentPlayer = 'O'; // AI's turn
    updatePlayerInfo();
    aiMove();
  }
}

// AI's Move (simple random AI)
function aiMove() {
  if (!gameActive) return;
  const emptyIndexes = gameBoard
    .map((val, index) => (val === '' ? index : -1))
    .filter(index => index !== -1);
  
  const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  gameBoard[randomIndex] = 'O';
  document.querySelector(`[data-index='${randomIndex}']`).textContent = 'O';
  checkGameStatus();
  if (gameActive) {
    currentPlayer = 'X'; // Human's turn
    updatePlayerInfo();
  }
}

// Check for winner or draw
function checkGameStatus() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (let combination of winningCombinations) {
    const [a, b, c] = combination;
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      gameActive = false;
      setTimeout(() => {
        alert(`${gameBoard[a]} wins!`);
        redirectToWinnerPage(gameBoard[a]); // Redirect to winner page
      }, 200);
      return;
    }
  }

  if (!gameBoard.includes('')) {
    gameActive = false;
    setTimeout(() => {
      alert('It\'s a draw!');
      redirectToWinnerPage('Draw'); // Redirect to winner page in case of draw
    }, 200);
  }
}

// Update the player info displayed on the page
function updatePlayerInfo() {
  const playerName = playerNameInput.value || 'Player'; // Default to 'Player' if no name entered
  playerInfo.innerHTML = `
    
  `;
}

// Reset the game
function resetGame() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'X';
  const squares = document.querySelectorAll('.square');
  squares.forEach(square => square.textContent = '');
  createBoard();
}

resetBtn.addEventListener('click', resetGame);

// Initialize the board when the page loads
createBoard();

// Redirect to winner page and store winner's name
function redirectToWinnerPage(winner) {
  // Store the winner's name in sessionStorage and the player's name
  const playerName = playerNameInput.value || 'Player'; // Get player's name from input
  sessionStorage.setItem('winner', winner);
  sessionStorage.setItem('playerName', playerName); // Store player name
  window.location.href = 'winner.html'; // Redirect to winner page
}
