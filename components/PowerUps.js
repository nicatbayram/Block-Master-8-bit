import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const PowerUps = ({ onGravityFlip, onReroll, turnsLeft, rerollsLeft }) => {
  const { colors: COLORS } = useTheme();
  const styles = getStyles(COLORS);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, turnsLeft <= 0 && styles.disabled]} 
        onPress={onGravityFlip} 
        disabled={turnsLeft <= 0}
      >
        <Text style={styles.text}>TURN ({turnsLeft})</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, rerollsLeft <= 0 && styles.disabled]} 
        onPress={onReroll}
        disabled={rerollsLeft <= 0}
      >
        <Text style={styles.text}>REROLL ({rerollsLeft})</Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (COLORS) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 5,
    marginTop: 25,
  },
  button: {
    backgroundColor: COLORS.block,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: COLORS.textPrimary,
    borderBottomWidth: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontFamily: 'PressStart2P',
    color: COLORS.background,
    fontSize: 10,
  }
});

export default React.memo(PowerUps);
