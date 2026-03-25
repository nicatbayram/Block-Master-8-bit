import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { BLOCK_COLORS_LIGHT, BLOCK_COLORS_DARK } from '../constants/colors';

const Obstacle = ({ obstX, obstY, obstW, obstH, obstActive }) => {
  const { colors: COLORS } = useTheme();
  const styles = getStyles(COLORS);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: obstX.value },
      { translateY: obstY.value }
    ],
    width: obstW.value,
    height: obstH.value,
    opacity: obstActive.value,
  }));

  return (
    <Animated.View style={[styles.obstacle, animatedStyle]} />
  );
};

const getStyles = (COLORS) => StyleSheet.create({
  obstacle: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#000000', 
    borderRadius: 0, 
    borderWidth: 2,
    borderColor: '#FFFFFF', 
    zIndex: 100, 
  },
});

export default React.memo(Obstacle);
