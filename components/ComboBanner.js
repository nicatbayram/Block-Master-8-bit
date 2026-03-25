import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withDelay,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { BLOCK_COLORS_LIGHT, BLOCK_COLORS_DARK } from '../constants/colors';

const ComboBanner = ({ count, onComplete }) => {
  const { colors: COLORS } = useTheme();
  const styles = getStyles(COLORS);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1.2, { damping: 10, stiffness: 100 });
    opacity.value = withTiming(1, { duration: 200 });
    
    scale.value = withDelay(200, withSpring(1, { damping: 12 }));

    opacity.value = withDelay(1000, withTiming(0, { duration: 300 }, (finished) => {
      if (finished && onComplete) {
        runOnJS(onComplete)();
      }
    }));
  }, [onComplete, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.text}>{count} COMBO!</Text>
    </Animated.View>
  );
};

const getStyles = (COLORS) => StyleSheet.create({
  container: {
    position: 'absolute',
    top: '30%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1100,
    pointerEvents: 'none',
  },
  text: {
    fontFamily: 'PressStart2P',
    fontSize: 24,
    color: COLORS.textPrimary,
  },
});

export default ComboBanner;
