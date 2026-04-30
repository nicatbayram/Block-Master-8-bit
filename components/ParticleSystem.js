import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay, 
  runOnJS 
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { CELL_SIZE } from './Board';

const Particle = ({ x, y, color, onComplete }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Random velocity
    const angle = Math.random() * Math.PI * 2;
    const speed = 20 + Math.random() * 40;
    const destX = Math.cos(angle) * speed;
    const destY = Math.sin(angle) * speed;

    translateX.value = withTiming(destX, { duration: 400 });
    translateY.value = withTiming(destY + 20, { duration: 400 }); // +20 for gravity effect
    scale.value = withTiming(0, { duration: 400 });
    opacity.value = withDelay(200, withTiming(0, { duration: 200 }, (finished) => {
      if (finished && onComplete) {
        runOnJS(onComplete)();
      }
    }));
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value }
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.particle, { backgroundColor: color, left: x, top: y }, animatedStyle]} />
  );
};

const ParticleSystem = ({ clearedAreas, onComplete }) => {
  const { colors: COLORS } = useTheme();
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!clearedAreas) return;

    const newParticles = [];
    const GRID_BORDER = 2;

    // Generate particles for cleared rows
    if (clearedAreas.rows) {
      clearedAreas.rows.forEach(row => {
        for (let col = 0; col < 9; col++) {
          // 3 particles per cell
          for (let i = 0; i < 3; i++) {
            newParticles.push({
              id: `r-${row}-c-${col}-${i}-${Date.now()}`,
              x: GRID_BORDER + (col * CELL_SIZE) + (CELL_SIZE / 2),
              y: GRID_BORDER + (row * CELL_SIZE) + (CELL_SIZE / 2),
              color: COLORS.textPrimary
            });
          }
        }
      });
    }

    // Generate particles for cleared cols
    if (clearedAreas.cols) {
      clearedAreas.cols.forEach(col => {
        for (let row = 0; row < 9; row++) {
          for (let i = 0; i < 3; i++) {
            newParticles.push({
              id: `c-${col}-r-${row}-${i}-${Date.now()}`,
              x: GRID_BORDER + (col * CELL_SIZE) + (CELL_SIZE / 2),
              y: GRID_BORDER + (row * CELL_SIZE) + (CELL_SIZE / 2),
              color: COLORS.textPrimary
            });
          }
        }
      });
    }

    // Subgrids could be added here

    setParticles(newParticles);
  }, [clearedAreas]);

  const handleParticleComplete = (id) => {
    setParticles(prev => {
      const next = prev.filter(p => p.id !== id);
      if (next.length === 0 && onComplete) {
        onComplete();
      }
      return next;
    });
  };

  if (particles.length === 0) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map(p => (
        <Particle 
          key={p.id} 
          x={p.x} 
          y={p.y} 
          color={p.color} 
          onComplete={() => handleParticleComplete(p.id)} 
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    zIndex: 1000,
  }
});

export default React.memo(ParticleSystem);
