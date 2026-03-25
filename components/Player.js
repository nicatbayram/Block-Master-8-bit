import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { BLOCK_COLORS_LIGHT, BLOCK_COLORS_DARK } from '../constants/colors';

const Player = ({ playerY, playerX, playerSize, isDeathShatter }) => {
  const { colors: COLORS } = useTheme();
  const styles = getStyles(COLORS);
  // Main player placement 
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: playerX.value }, 
      { translateY: playerY }
    ],
    width: playerSize,
    height: playerSize,
    opacity: isDeathShatter.value === 1 ? 0 : 1, // disappear on death
  }));

  // Trail effect: 2 ghosts following playerX with spring delay
  const ghost1X = useDerivedValue(() => withSpring(playerX.value, { damping: 20, stiffness: 300 }));
  const ghost2X = useDerivedValue(() => withSpring(ghost1X.value, { damping: 20, stiffness: 200 }));

  const ghost1Style = useAnimatedStyle(() => ({
    // If the player is dodging, the ghost lags horizontally. Add a slight vertical drop to imply speed.
    transform: [{ translateX: ghost1X.value }, { translateY: playerY + 8 }],
    width: playerSize,
    height: playerSize,
    opacity: isDeathShatter.value === 1 ? 0 : 0.4,
  }));

  const ghost2Style = useAnimatedStyle(() => ({
    transform: [{ translateX: ghost2X.value }, { translateY: playerY + 16 }],
    width: playerSize,
    height: playerSize,
    opacity: isDeathShatter.value === 1 ? 0 : 0.15,
  }));

  // Death Particle System (8 tiny squares)
  const numParticles = 8;
  const particles = Array.from({ length: numParticles }).map((_, i) => {
    const angle = (Math.PI * 2 * i) / numParticles;
    const dist = 60 + Math.random() * 40;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;

    return useAnimatedStyle(() => {
      const active = isDeathShatter.value === 1;
      return {
        transform: [
          { translateX: playerX.value + (playerSize / 2) - 4 + (active ? withTiming(dx, {duration: 500}) : 0) },
          { translateY: playerY + (playerSize / 2) - 4 + (active ? withTiming(dy, {duration: 500}) : 0) }
        ],
        opacity: active ? withTiming(0, {duration: 500}) : 0,
      };
    });
  });

  return (
    <>
      <Animated.View style={[styles.ghost, ghost2Style]} />
      <Animated.View style={[styles.ghost, ghost1Style]} />
      
      <Animated.View style={[styles.playerBlock, animatedStyle]} />

      {particles.map((pStyle, idx) => (
        <Animated.View key={`particle-${idx}`} style={[styles.particle, pStyle]} />
      ))}
    </>
  );
};

const getStyles = (COLORS) => StyleSheet.create({
  playerBlock: {
    position: 'absolute',
    top: 0, 
    left: 0,
    backgroundColor: COLORS.textPrimary,
    borderRadius: 0,
    zIndex: 50,
  },
  ghost: {
    position: 'absolute',
    top: 0, 
    left: 0,
    backgroundColor: COLORS.textPrimary,
    borderRadius: 0,
    zIndex: 49,
  },
  particle: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 8,
    height: 8,
    backgroundColor: COLORS.textPrimary,
    zIndex: 60,
  }
});

export default React.memo(Player);
