import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay,
  runOnJS,
  Easing
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { BLOCK_COLORS_LIGHT, BLOCK_COLORS_DARK } from '../constants/colors';

const FloatingScore = ({ value, onComplete }) => {
  const { colors: COLORS } = useTheme();
  const styles = getStyles(COLORS);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 300, easing: Easing.back(1.5) });
    translateY.value = withTiming(-350, { duration: 1500 });
    opacity.value = withDelay(1100, withTiming(0, { duration: 400 }, (finished) => {
      if (finished && onComplete) {
        runOnJS(onComplete)();
      }
    }));
  }, [onComplete, scale, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.scoreBox, animatedStyle]}>
        <Animated.Text style={styles.text}>+{value}</Animated.Text>
      </Animated.View>
    </View>
  );
};

const getStyles = (COLORS) => StyleSheet.create({
  container: {
    position: 'absolute',
    top: '40%',
    left: '45%',
    zIndex: 1000,
    pointerEvents: 'none',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'PressStart2P',
    fontSize: 24,
    color: COLORS.textPrimary,
  }
});

export default FloatingScore;
