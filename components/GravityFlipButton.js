import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { BLOCK_COLORS_LIGHT, BLOCK_COLORS_DARK } from '../constants/colors';

const GravityFlipButton = ({ onPress, disabled }) => {
  const { colors: COLORS } = useTheme();
  const styles = getStyles(COLORS);
  return (
    <TouchableOpacity 
       style={[styles.button, disabled && styles.disabled]} 
       onPress={onPress} 
       disabled={disabled}
       activeOpacity={0.7}
    >
       <Text style={styles.text}>Gravity Flip</Text>
    </TouchableOpacity>
  );
};

const getStyles = (COLORS) => StyleSheet.create({
  button: {
    backgroundColor: '#9C27B0', // Purple for power up
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  disabled: {
    backgroundColor: '#BDBDBD',
    elevation: 0,
    shadowOpacity: 0,
  },
  text: {
    color: COLORS.white,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  }
});

export default GravityFlipButton;
