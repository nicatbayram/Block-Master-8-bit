import { useState, useCallback } from 'react';
import { createEmptyBoard, canPlacePiece, placePiece, checkAndClearLines, checkGameOver, applyGravityFlip } from '../utils/boardLogic';
import { generateInitialTray, generateInitialQueue, generateRandomPiece } from '../utils/pieceGenerator';
import { calculateScore } from '../utils/scoreCalculator';
import { playSound } from '../utils/audio';

export const useGameState = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [score, setScore] = useState(0);
  const [trayPieces, setTrayPieces] = useState(generateInitialTray());
  const [queuePieces, setQueuePieces] = useState(generateInitialQueue());
  const [gravityFlipUsed, setGravityFlipUsed] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [lastLinesCleared, setLastLinesCleared] = useState(0);
  const [lastAddedScore, setLastAddedScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [clearedAreas, setClearedAreas] = useState(null);

  const handlePlacePiece = useCallback((trayIndex, row, col) => {
    const piece = trayPieces[trayIndex];
    if (!piece) return false;

    if (!canPlacePiece(board, piece.shape, row, col)) {
      return false; // Invalid move
    }

    const { newBoard, blocksPlaced } = placePiece(board, piece.shape, row, col);
    const { newBoard: clearedBoard, linesCleared, clearedRows, clearedCols, clearedSubgrids } = checkAndClearLines(newBoard);
    
    // Update combo (linesCleared now includes rows + cols + subgrids)
    let newCombo = comboCount;
    if (linesCleared > 0) {
      newCombo += 1;
    } else {
      newCombo = 0;
    }
    setComboCount(newCombo);
    setLastLinesCleared(linesCleared);

    if (linesCleared > 0) {
      setClearedAreas({ rows: clearedRows, cols: clearedCols, subgrids: clearedSubgrids, id: Date.now() });
      
      // Trigger sounds based on clear type
      const hasRows = clearedRows.length > 0;
      const hasCols = clearedCols.length > 0;
      const hasSubgrids = clearedSubgrids.length > 0;

      if ((hasRows && hasCols) || (hasSubgrids && (hasRows || hasCols))) {
        playSound('twice');
      } else if (hasSubgrids) {
        playSound('cube');
      } else if (hasRows) {
        playSound('horizontal');
      } else if (hasCols) {
        playSound('vertical');
      }

      setTimeout(() => {
        setClearedAreas(null);
      }, 400);
    }

    // Calculate score with combo bonus
    const baseScore = calculateScore(blocksPlaced, linesCleared);
    const bonus = newCombo > 1 ? baseScore * (newCombo - 1) : 0;
    const totalAdded = baseScore + bonus;
    
    setScore(prev => prev + totalAdded);
    setLastAddedScore(totalAdded);
    
    setBoard(clearedBoard);

    // Update tray: set this slot to null
    const newTray = [...trayPieces];
    newTray[trayIndex] = null;
    
    // If all slots are empty, refill the tray
    const allEmpty = newTray.every(p => p === null);
    let nextTray = newTray;
    if (allEmpty) {
      nextTray = [generateRandomPiece(), generateRandomPiece(), generateRandomPiece()];
    }
    setTrayPieces(nextTray);

    // Check game over against the pieces that will be in the tray next
    const activePieces = nextTray.filter(p => p !== null);
    if (activePieces.length > 0 && checkGameOver(clearedBoard, activePieces)) {
      setIsGameOver(true);
      playSound('game-over');
    }

    return true; // Move successful
  }, [board, trayPieces, comboCount]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
    playSound('pause');
  }, []);

  const handleGravityFlip = useCallback(() => {
    if (gravityFlipUsed) return false;
    
    const flippedBoard = applyGravityFlip(board);
    const { newBoard: clearedBoard, linesCleared, clearedRows, clearedCols, clearedSubgrids } = checkAndClearLines(flippedBoard);
    
    if (linesCleared > 0) {
       const addedScore = calculateScore(0, linesCleared);
       setScore(prev => prev + addedScore);
       setLastAddedScore(addedScore);
       setClearedAreas({ rows: clearedRows, cols: clearedCols, subgrids: clearedSubgrids, id: Date.now() });
       setTimeout(() => { setClearedAreas(null); }, 400);
    }
    
    setBoard(clearedBoard);
    setGravityFlipUsed(true);

    const activePieces = trayPieces.filter(p => p !== null);
    if (checkGameOver(clearedBoard, activePieces)) {
      setIsGameOver(true);
    }

    return true;
  }, [board, gravityFlipUsed, trayPieces]);

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setScore(0);
    setComboCount(0);
    setLastAddedScore(0);
    setLastLinesCleared(0);
    setTrayPieces(generateInitialTray());
    setQueuePieces(generateInitialQueue());
    setGravityFlipUsed(false);
    setIsGameOver(false);
    setClearedAreas(null);
  }, []);

  return {
    board,
    score,
    comboCount,
    lastLinesCleared,
    lastAddedScore,
    trayPieces,
    queuePieces,
    gravityFlipUsed,
    isGameOver,
    isPaused,
    clearedAreas,
    handlePlacePiece,
    handleGravityFlip,
    togglePause,
    resetGame,
  };
};
