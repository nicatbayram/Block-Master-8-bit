import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { BLOCK_COLORS_LIGHT, BLOCK_COLORS_DARK } from '../constants/colors';
import CornerMask from './CornerMask';

const Cell = ({ size, filled, isGhost }) => {
  const { colors: COLORS } = useTheme();
  const styles = getStyles(COLORS);
  if (!filled) return <View style={{ width: size, height: size }} />;

  const p = 1.8; // Multiplier size per pixel

  return (
    <View style={{ width: size, height: size }}>
       <View style={[styles.block, isGhost ? styles.ghost : styles.placed]}>
          <CornerMask top left p={p} />
          <CornerMask top right p={p} />
          <CornerMask bottom left p={p} />
          <CornerMask bottom right p={p} />
       </View>
    </View>
  );
};

const getStyles = (COLORS) => StyleSheet.create({
  block: {
    flex: 1,
    margin: 1, 
    position: 'relative',
  },
  placed: {
    backgroundColor: COLORS.block, 
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.textPrimary,
    borderStyle: 'dashed',
  }
});

export default React.memo(Cell);
