import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { BLOCK_COLORS_LIGHT, BLOCK_COLORS_DARK } from '../constants/colors';

const Cell = ({ size, value, isGhost }) => {
  const { colors: COLORS } = useTheme();
  const styles = getStyles(COLORS);
  
  if (!value && !isGhost) return <View style={{ width: size, height: size }} />;

  const isStone = value === 2;

  return (
    <View style={{ width: size, height: size }}>
       <View style={[
         styles.block, 
         isGhost ? styles.ghost : styles.placed,
         isStone && styles.stone
       ]} />
    </View>
  );
};

const getStyles = (COLORS) => StyleSheet.create({
  block: {
    flex: 1,
    margin: 1, 
    borderWidth: 3,
    borderTopColor: 'rgba(255,255,255,0.4)',
    borderLeftColor: 'rgba(255,255,255,0.4)',
    borderBottomColor: 'rgba(0,0,0,0.4)',
    borderRightColor: 'rgba(0,0,0,0.4)',
  },
  placed: {
    backgroundColor: COLORS.block, 
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.textPrimary,
    borderStyle: 'dashed',
  },
  stone: {
    backgroundColor: COLORS.gridLines,
    borderWidth: 4,
    borderTopColor: COLORS.emptyCellBorder,
    borderLeftColor: COLORS.emptyCellBorder,
  }
});

export default React.memo(Cell);
