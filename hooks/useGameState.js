import { useState, useCallback } from 'react';
import { createEmptyBoard, canPlacePiece, placePiece, checkAndClearLines, checkGameOver, applyGravityFlip } from '../utils/boardLogic';
import { generateInitialTray, generateInitialQueue, generateRandomPiece } from '../utils/pieceGenerator';
import { calculateScore } from '../utils/scoreCalculator';
import { playSound } from '../utils/audio';
import * as Haptics from 'expo-haptics';

export const useGameState = () => {
  const [board, setBoard] = useState(createEmptyBoard());
  const [score, setScore] = useState(0);
  const level = Math.floor(score / 1000) + 1;
  const [trayPieces, setTrayPieces] = useState(generateInitialTray(level));
  const [queuePieces, setQueuePieces] = useState(generateInitialQueue(level));
  const [turnsLeft, setTurnsLeft] = useState(3);
  const [rerollsLeft, setRerollsLeft] = useState(3);
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

    // Vibrate lightly when a block is placed
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

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
      
      // Heavy haptics for line clear
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

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
    const newScore = score + totalAdded;
    const currentLevel = Math.floor(newScore / 1000) + 1;
    const previousLevel = Math.floor(score / 1000) + 1;
    
    if (currentLevel > previousLevel) {
      setRerollsLeft(prev => prev <= 0 ? 1 : prev);
      playSound('cube'); // Play a sound for level up
    }
    
    setScore(newScore);
    setLastAddedScore(totalAdded);
    
    setBoard(clearedBoard);

    // Update tray: set this slot to null
    const newTray = [...trayPieces];
    newTray[trayIndex] = null;
    
    // If all slots are empty, refill the tray
    const allEmpty = newTray.every(p => p === null);
    let nextTray = newTray;
    if (allEmpty) {
      nextTray = [generateRandomPiece(currentLevel), generateRandomPiece(currentLevel), generateRandomPiece(currentLevel)];
    }
    setTrayPieces(nextTray);

    // Check game over against the pieces that will be in the tray next
    const activePieces = nextTray.filter(p => p !== null);
    if (activePieces.length > 0 && checkGameOver(clearedBoard, activePieces)) {
      setIsGameOver(true);
      playSound('game-over');
    }

    return true; // Move successful
  }, [board, trayPieces, comboCount, score]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
    playSound('pause');
  }, []);

  const handleGravityFlip = useCallback(() => {
    if (turnsLeft <= 0) return false;
    
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
    setTurnsLeft(prev => prev - 1);

    const activePieces = trayPieces.filter(p => p !== null);
    if (checkGameOver(clearedBoard, activePieces)) {
      setIsGameOver(true);
    }

    return true;
  }, [board, turnsLeft, trayPieces]);

  const handleReroll = useCallback(() => {
    if (rerollsLeft <= 0) return false;
    setTrayPieces(generateInitialTray(level));
    setRerollsLeft(prev => prev - 1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    return true;
  }, [rerollsLeft]);

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setScore(0);
    setComboCount(0);
    setLastAddedScore(0);
    setLastLinesCleared(0);
    setTrayPieces(generateInitialTray(1));
    setQueuePieces(generateInitialQueue(1));
    setTurnsLeft(3);
    setRerollsLeft(3);
    setIsGameOver(false);
    setClearedAreas(null);
  }, []);

  return {
    board,
    score,
    level,
    comboCount,
    lastLinesCleared,
    lastAddedScore,
    trayPieces,
    queuePieces,
    turnsLeft,
    rerollsLeft,
    isGameOver,
    isPaused,
    clearedAreas,
    handlePlacePiece,
    handleGravityFlip,
    handleReroll,
    togglePause,
    resetGame,
  };
};
