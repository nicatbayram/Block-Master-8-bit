import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameState } from '../hooks/useGameState';
import { useHighScore } from '../hooks/useHighScore';
import Board, { CELL_SIZE } from '../components/Board';
import PieceTray from '../components/PieceTray';
import HUD from '../components/HUD';
import FloatingScore from '../components/FloatingScore';
import ComboBanner from '../components/ComboBanner';
import { canPlacePiece } from '../utils/boardLogic';
import { useTheme } from '../contexts/ThemeContext';
import { BLOCK_COLORS_LIGHT, BLOCK_COLORS_DARK } from '../constants/colors';

const GameScreen = ({ navigation }) => {
  const { colors: COLORS } = useTheme();
  const styles = getStyles(COLORS);
  const { 
    board, score, comboCount, lastLinesCleared, lastAddedScore, 
    trayPieces, isGameOver, clearedAreas,
    handlePlacePiece, resetGame 
  } = useGameState();
  
  const { highScore, saveHighScore } = useHighScore();
  const boardRef = useRef(null);
  const [boardLayout, setBoardLayout] = useState({ x: 0, y: 0 });

  const [ghost, setGhost] = useState(null);
  const [showScore, setShowScore] = useState(null);
  const [showCombo, setShowCombo] = useState(null);

  useEffect(() => {
    if (lastAddedScore > 0) {
      setShowScore({ value: lastAddedScore, id: `score-${Date.now()}` });
    }
    if (comboCount > 1) {
      setShowCombo({ count: comboCount, id: `combo-${Date.now()}` });
    }
  }, [lastAddedScore, comboCount]);

  useEffect(() => {
    if (isGameOver) {
      saveHighScore(score);
      navigation.navigate('GameOver', { score, isNewRecord: score > highScore });
    }
  }, [isGameOver, score, highScore, saveHighScore, navigation]);

  const measureBoard = () => {
    if (boardRef.current) {
      setTimeout(() => {
        if (boardRef.current) {
          boardRef.current.measure((x, y, width, height, pageX, pageY) => {
            setBoardLayout({ x: pageX, y: pageY });
          });
        }
      }, 50);
    }
  };

  const calculateGridPos = (absoluteX, absoluteY, piece) => {
    const GRID_BORDER = 2; // updated border width
    
    const boardRelativeX = absoluteX - boardLayout.x - GRID_BORDER;
    const boardRelativeY = absoluteY - boardLayout.y - GRID_BORDER;

    const fingerCellCol = Math.floor(boardRelativeX / CELL_SIZE);
    const fingerCellRow = Math.floor(boardRelativeY / CELL_SIZE);

    const startRow = fingerCellRow - Math.floor((piece.shape.length - 1) / 2);
    const startCol = fingerCellCol - Math.floor((piece.shape[0].length - 1) / 2);
    
    return { row: startRow, col: startCol };
  };

  const handleDragUpdate = (absoluteX, absoluteY, piece, index) => {
    const { row, col } = calculateGridPos(absoluteX, absoluteY, piece);
    
    if (canPlacePiece(board, piece.shape, row, col)) {
      setGhost({ piece, row, col });
    } else {
      setGhost(null);
    }
  };

  const handleDragEnd = (absoluteX, absoluteY, piece, index) => {
    if (ghost) {
       handlePlacePiece(index, ghost.row, ghost.col);
    }
    setGhost(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <HUD 
        score={score} 
        highScore={highScore} 
        onSettings={() => navigation.navigate('Settings')}
      />
      
      <View style={styles.boardWrapper}>
         <Board 
           ref={boardRef}
           onGridLayout={measureBoard}
           board={board} 
           ghostPiece={ghost?.piece}
           ghostPos={ghost ? { row: ghost.row, col: ghost.col } : null}
           clearedAreas={clearedAreas}
         />
         
         {showScore && (
           <FloatingScore 
             key={showScore.id}
             value={showScore.value} 
             onComplete={() => setShowScore(null)} 
           />
         )}

         {showCombo && (
           <ComboBanner 
             key={showCombo.id}
             count={showCombo.count} 
             onComplete={() => setShowCombo(null)} 
           />
         )}
      </View>

      <View style={styles.trayWrapper}>
         <PieceTray 
           trayPieces={trayPieces} 
           onDragUpdate={handleDragUpdate}
           onDragEnd={handleDragEnd}
         />
      </View>
    </SafeAreaView>
  );
};

const getStyles = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  boardWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    backgroundColor: COLORS.background,
  },
  trayWrapper: {
    paddingTop: 20,
    paddingBottom: 20,
    borderTopWidth: 2,
    borderTopColor: COLORS.textPrimary,
    backgroundColor: COLORS.background,
    zIndex: 10,
  },
});

export default GameScreen;
