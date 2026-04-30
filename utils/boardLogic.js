export const BOARD_SIZE = 9;

export const createEmptyBoard = () => {
  // 9x9 grid, 0 means empty, 1 means filled
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
};

export const canPlacePiece = (board, pieceShape, startRow, startCol) => {
  for (let r = 0; r < pieceShape.length; r++) {
    for (let c = 0; c < pieceShape[r].length; c++) {
      if (pieceShape[r][c] === 1) {
        const boardR = startRow + r;
        const boardC = startCol + c;
        // Check bounds
        if (boardR < 0 || boardR >= BOARD_SIZE || boardC < 0 || boardC >= BOARD_SIZE) {
          return false;
        }
        // Check collision
        if (board[boardR][boardC] !== 0) {
          return false;
        }
      }
    }
  }
  return true;
};

export const placePiece = (board, pieceShape, startRow, startCol) => {
  // Always copy board, don't mutate directly
  const newBoard = board.map(row => [...row]);
  let blocksPlaced = 0;

  for (let r = 0; r < pieceShape.length; r++) {
    for (let c = 0; c < pieceShape[r].length; c++) {
      if (pieceShape[r][c] === 1) {
        newBoard[startRow + r][startCol + c] = 1;
        blocksPlaced++;
      }
    }
  }

  return { newBoard, blocksPlaced };
};

export const checkAndClearLines = (board) => {
  const rowsToClear = new Set();
  const colsToClear = new Set();

  for (let r = 0; r < BOARD_SIZE; r++) {
    let rowFull = true;
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === 0) rowFull = false;
    }
    if (rowFull) rowsToClear.add(r);
  }

  for (let c = 0; c < BOARD_SIZE; c++) {
    let colFull = true;
    for (let r = 0; r < BOARD_SIZE; r++) {
      if (board[r][c] === 0) colFull = false;
    }
    if (colFull) colsToClear.add(c);
  }

  // Check 3x3 Subgrids
  const subgridsToClear = []; // Array of {rowStart, colStart}
  for (let r = 0; r < 9; r += 3) {
    for (let c = 0; c < 9; c += 3) {
      let subgridFull = true;
      for (let sr = 0; sr < 3; sr++) {
        for (let sc = 0; sc < 3; sc++) {
          if (board[r + sr][c + sc] === 0) subgridFull = false;
        }
      }
      if (subgridFull) subgridsToClear.push({ rowStart: r, colStart: c });
    }
  }

  const linesCleared = rowsToClear.size + colsToClear.size + subgridsToClear.length;
  const newBoard = board.map(row => [...row]);

  // Actually clear
  rowsToClear.forEach(r => {
    for (let c = 0; c < BOARD_SIZE; c++) newBoard[r][c] = 0;
  });
  colsToClear.forEach(c => {
    for (let r = 0; r < BOARD_SIZE; r++) newBoard[r][c] = 0;
  });
  subgridsToClear.forEach(({ rowStart, colStart }) => {
    for (let sr = 0; sr < 3; sr++) {
      for (let sc = 0; sc < 3; sc++) {
        newBoard[rowStart + sr][colStart + sc] = 0;
      }
    }
  });

  return {
    newBoard,
    linesCleared,
    clearedRows: Array.from(rowsToClear),
    clearedCols: Array.from(colsToClear),
    clearedSubgrids: subgridsToClear
  };
};

export const checkGameOver = (board, availablePieces) => {
  // If no pieces are left in the active tray (normally shouldn't happen if we refill, but maybe possible on end of game)
  if (!availablePieces || availablePieces.length === 0) return true;

  for (const piece of availablePieces) {
    if (!piece || !piece.shape) continue; // Null slots in tray
    
    // Check if THIS piece can fit anywhere
    let canFit = false;
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (canPlacePiece(board, piece.shape, r, c)) {
          canFit = true;
          break;
        }
      }
      if (canFit) break;
    }

    // If ANY piece can fit, game is NOT over
    if (canFit) return false;
  }

  // If we checked all pieces and none fit
  return true;
};

// Power-up: rotates the board 90 degrees clockwise
export const applyGravityFlip = (board) => {
  const newBoard = createEmptyBoard();
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      newBoard[c][BOARD_SIZE - 1 - r] = board[r][c];
    }
  }
  return newBoard;
};
