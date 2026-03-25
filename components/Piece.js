import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import Cell from './Cell';
import { CELL_SIZE } from './Board';

// Used inside Piece tray where we might want the piece rendered a bit smaller than board cells
export const PIECE_SCALE = 0.55; 

const Piece = ({ piece, onDragEnd, onDragUpdate, index }) => {
  const isDragging = useSharedValue(false);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart((event) => {
      isDragging.value = true;
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY - 80; 
      
      if (onDragUpdate) {
        runOnJS(onDragUpdate)(event.absoluteX, event.absoluteY - 80, piece, index);
      }
    })
    .onEnd((event) => {
      isDragging.value = false;
      translateX.value = withSpring(0, { damping: 14, stiffness: 150 });
      translateY.value = withSpring(0, { damping: 14, stiffness: 150 });
      
      if (onDragEnd) {
        runOnJS(onDragEnd)(event.absoluteX, event.absoluteY - 80, piece, index);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: withSpring(isDragging.value ? 1.15 / PIECE_SCALE : 1, { 
            damping: 14, 
            stiffness: 150 
          }) 
        }
      ],
      zIndex: isDragging.value ? 1000 : 1,
      opacity: withTiming(isDragging.value ? 0.9 : 1, { duration: 150 }),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: withTiming(isDragging.value ? 12 : 0, { duration: 150 }),
      },
      shadowOpacity: withTiming(isDragging.value ? 0.5 : 0, { duration: 150 }),
      shadowRadius: withTiming(isDragging.value ? 15 : 0, { duration: 150 }),
      elevation: isDragging.value ? 15 : 0,
    };
  });

  if (!piece || !piece.shape) {
    return <View style={{ width: CELL_SIZE * 3 * PIECE_SCALE, height: CELL_SIZE * 3 * PIECE_SCALE }} />;
  }

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        {piece.shape.map((row, r) => (
          <View key={`${piece.id}-row-${r}`} style={styles.row}>
            {row.map((cellFilled, c) => (
              <View key={`${piece.id}-cell-${r}-${c}`} style={{ width: CELL_SIZE * PIECE_SCALE, height: CELL_SIZE * PIECE_SCALE }}>
                {cellFilled === 1 && (
                    <Cell size={CELL_SIZE * PIECE_SCALE} filled={true} isActive={true} />
                )}
              </View>
            ))}
          </View>
        ))}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  row: {
    flexDirection: 'row',
  }
});

export default React.memo(Piece);
