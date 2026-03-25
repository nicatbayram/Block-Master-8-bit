import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { BLOCK_COLORS_LIGHT, BLOCK_COLORS_DARK } from '../constants/colors';

const Particle = ({ angle, distance, size }) => {
  const { colors: COLORS } = useTheme();
  const transX = useSharedValue(0);
  const transY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    transX.value = withTiming(Math.cos(angle) * distance, { duration: 250, easing: Easing.out(Easing.quad) });
    transY.value = withTiming(Math.sin(angle) * distance, { duration: 250, easing: Easing.out(Easing.quad) });
    opacity.value = withDelay(100, withTiming(0, { duration: 150 }));
  }, [angle, distance, transX, transY, opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: transX.value },
      { translateY: transY.value }
    ]
  }));

  return (
    <Animated.View style={[
       { position: 'absolute', width: size, height: size, backgroundColor: COLORS.block }, 
       style
    ]} />
  );
};

const RetroExplosion = () => {
  return (
    <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]} pointerEvents="none">
       {Array.from({ length: 8 }).map((_, i) => (
          <Particle 
             key={i} 
             angle={(i * Math.PI) / 4} 
             distance={22} 
             size={6} 
          />
       ))}
    </View>
  );
};

export default React.memo(RetroExplosion);
