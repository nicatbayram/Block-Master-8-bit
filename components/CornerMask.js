import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { BLOCK_COLORS_LIGHT, BLOCK_COLORS_DARK } from '../constants/colors';

const CornerMask = ({ top, bottom, left, right, p = 1.8 }) => {
  const { colors: COLORS } = useTheme();
  const c = -1; 
  const baseStyle = { position: 'absolute', backgroundColor: COLORS.background, zIndex: 10, width: p, height: p };

  const getStyle = (offsetY, offsetX) => {
    const s = { ...baseStyle };
    if (top) s.top = c + offsetY * p;
    if (bottom) s.bottom = c + offsetY * p;
    if (left) s.left = c + offsetX * p;
    if (right) s.right = c + offsetX * p;
    return s;
  };

  return (
    <>
      <View style={getStyle(0, 0)} />
      <View style={getStyle(0, 1)} />
      <View style={getStyle(1, 0)} />
      <View style={getStyle(0, 2)} />
      <View style={getStyle(2, 0)} />
    </>
  );
};

export default React.memo(CornerMask);
