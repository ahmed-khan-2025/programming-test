const fs = require('fs');

// Read entire input file
const rawInput = fs.readFileSync('input.txt', 'utf8')
  .replace(/\r\n/g, '\n')  // normalize line endings
  .trim();

// Split input into lines
const lines = rawInput.split('\n');

// Extract draw numbers after "Draw numbers:" line
const drawNumbersLineIndex = lines.findIndex(line => line.startsWith('Draw numbers:'));
if (drawNumbersLineIndex === -1) {
  throw new Error('Draw numbers line not found');
}
const drawNumbers = lines[drawNumbersLineIndex + 1]
  .split(',')
  .map(s => s.trim())
  .map(Number);

// Extract boards after "Boards:" line
const boardsLineIndex = lines.findIndex(line => line.startsWith('Boards:'));
if (boardsLineIndex === -1) {
  throw new Error('Boards line not found');
}

// Collect all board lines after "Boards:"
const boardLines = lines.slice(boardsLineIndex + 1);

// Boards are 5 lines each, separated by blank lines, so split by empty lines
const boards = [];
let currentBoard = [];

for (const line of boardLines) {
  if (line.trim() === '') {
    if (currentBoard.length === 5) {
      boards.push(currentBoard.map(row => row.trim().split(/\s+/).map(Number)));
    }
    currentBoard = [];
  } else {
    currentBoard.push(line);
  }
}
// Push last board if any
if (currentBoard.length === 5) {
  boards.push(currentBoard.map(row => row.trim().split(/\s+/).map(Number)));
}
// Helper to check bingo
function hasBingo(marked) {
  for (let i = 0; i < 5; i++) {
    if (marked[i].every(Boolean)) return true;         // row bingo
    if ([0,1,2,3,4].every(j => marked[j][i])) return true; // column bingo
  }
  return false;
}

// Main function: find last winner
function findLastWinner(draws, boards) {
  const marked = Array.from({ length: boards.length }, () =>
    Array.from({ length: 5 }, () => Array(5).fill(false))
  );
  const won = new Set();
  let lastResult = null;

  for (const num of draws) {
    for (let bi = 0; bi < boards.length; bi++) {
      if (won.has(bi)) continue;

      const board = boards[bi];
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          if (board[i][j] === num) marked[bi][i][j] = true;
        }
      }

      if (hasBingo(marked[bi])) {
        won.add(bi);
        const sumUnmarked = board.flat().reduce((sum, val, idx) => {
          const i = Math.floor(idx / 5), j = idx % 5;
          return marked[bi][i][j] ? sum : sum + val;
        }, 0);
        lastResult = {
          boardIndex: bi,
          lastNumber: num,
          score: sumUnmarked * num
        };
        //console.log(`Board ${bi} wins with ${num}, score: ${lastResult.score}`);
      }
    }
    if (won.size === boards.length) break;
  }
  return lastResult;
}

const result = findLastWinner(drawNumbers, boards);
console.log("Last winning board info:", result);
