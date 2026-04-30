import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated';
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
import audio from '../utils/audio';
import CRTOverlay from '../components/CRTOverlay';
import PowerUps from '../components/PowerUps';
import ParticleSystem from '../components/ParticleSystem';

const GameScreen = ({ navigation }) => {
  const { colors: COLORS } = useTheme();
  const styles = getStyles(COLORS);
  const { 
    board, score, comboCount, lastLinesCleared, lastAddedScore, 
    trayPieces, isGameOver, isPaused, clearedAreas, turnsLeft, rerollsLeft,
    handlePlacePiece, handleGravityFlip, handleReroll, resetGame, togglePause 
  } = useGameState();
  
  const { highScore, saveHighScore } = useHighScore();
  const boardRef = useRef(null);
  const lastGhostPosRef = useRef(null);
  const [boardLayout, setBoardLayout] = useState({ x: 0, y: 0 });

  const [ghost, setGhost] = useState(null);
  const [showScore, setShowScore] = useState(null);
  const [showCombo, setShowCombo] = useState(null);

  useEffect(() => {
    audio.init();
  }, []);

  useEffect(() => {
    if (lastAddedScore > 0) {
      setShowScore({ value: lastAddedScore, id: `score-${Date.now()}` });
    }
    if (comboCount > 1) {
      setShowCombo({ count: comboCount, id: `combo-${Date.now()}` });
    }
  }, [lastAddedScore, comboCount]);

  const shakeTranslateX = useSharedValue(0);
  useEffect(() => {
    if (clearedAreas) {
      shakeTranslateX.value = withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [clearedAreas]);

  const animatedBoardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeTranslateX.value }]
  }));

  const isFocused = useIsFocused();
  
  useEffect(() => {
    if (isGameOver && isFocused) {
      saveHighScore(score);
      navigation.navigate('GameOver', { score, isNewRecord: score > highScore });
    }
  }, [isGameOver, score, highScore, saveHighScore, navigation, isFocused]);

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
    if (isPaused) return;
    const { row, col } = calculateGridPos(absoluteX, absoluteY, piece);
    
    const posKey = `${row},${col}`;
    if (lastGhostPosRef.current === posKey) return; // Prevent stutter - no state update if within the same cell!
    lastGhostPosRef.current = posKey;

    if (canPlacePiece(board, piece.shape, row, col)) {
      setGhost({ piece, row, col });
    } else {
      setGhost(null);
    }
  };

  const handleDragEnd = (absoluteX, absoluteY, piece, index) => {
    if (isPaused) return;
    if (ghost) {
       handlePlacePiece(index, ghost.row, ghost.col);
    }
    setGhost(null);
    lastGhostPosRef.current = null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <HUD 
        score={score} 
        highScore={Math.max(score, highScore)} 
        onSettings={() => navigation.navigate('Settings')}
        onPause={togglePause}
        isPaused={isPaused}
      />
      
      <Animated.View style={[styles.boardWrapper, animatedBoardStyle]}>
         <Board 
           ref={boardRef}
           onGridLayout={measureBoard}
           board={board} 
           ghostPiece={ghost?.piece}
           ghostPos={ghost ? { row: ghost.row, col: ghost.col } : null}
           clearedAreas={clearedAreas}
         />
         <ParticleSystem clearedAreas={clearedAreas} />
         
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

         {isPaused && (
           <View style={styles.pauseOverlay}>
             <Text style={styles.pauseText}>PAUSED</Text>
             <TouchableOpacity 
               style={styles.pauseButton}
               onPress={() => {
                 togglePause();
                 navigation.navigate('Home');
               }}
             >
               <Text style={styles.pauseButtonText}>MAIN MENU</Text>
             </TouchableOpacity>
           </View>
         )}
      </Animated.View>

      <PowerUps 
        onGravityFlip={handleGravityFlip} 
        onReroll={handleReroll} 
        turnsLeft={turnsLeft} 
        rerollsLeft={rerollsLeft}
      />

      <View style={styles.trayWrapper}>
         <PieceTray 
           trayPieces={trayPieces} 
           onDragUpdate={handleDragUpdate}
           onDragEnd={handleDragEnd}
         />
      </View>
      <CRTOverlay />
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
    marginVertical: 15,
  },
  trayWrapper: {
    paddingTop: 10,
    paddingBottom: 20,
    borderTopWidth: 2,
    borderTopColor: COLORS.textPrimary,
    backgroundColor: COLORS.background,
    zIndex: 10,
  },
  pauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  pauseText: {
    fontFamily: 'PressStart2P',
    fontSize: 24,
    color: '#FFFFFF',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
  pauseButton: {
    marginTop: 30,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#000000',
  },
  pauseButtonText: {
    fontFamily: 'PressStart2P',
    fontSize: 14,
    color: '#FFFFFF',
  },
});

export default GameScreen;
