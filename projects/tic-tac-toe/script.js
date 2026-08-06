var currentPlayer = 'X';
var board = ['', '', '', '', '', '', '', '', ''];
var gameOver = false;

function updateBoard(index) {
  if (gameOver) return;
  if (board[index] === '') {
    board[index] = currentPlayer;
    document.querySelectorAll('td')[index].textContent = currentPlayer;
    if (checkWinner()) {
      gameOver = true;
    } else if (checkDraw()) {
      gameOver = true;
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
  }
}

function checkWinner() {
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let condition of winConditions) {
    if (board[condition[0]] === board[condition[1]] && board[condition[1]] === board[condition[2]] && board[