import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { BLOCK_COLORS_LIGHT, BLOCK_COLORS_DARK } from '../constants/colors';

const HUD = ({ score, highScore, onSettings, onPause, isPaused }) => {
  const { colors: COLORS } = useTheme();
  const styles = getStyles(COLORS);
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>HIGH</Text>
          <Text style={styles.scoreValue}>{highScore.toString().padStart(6, '0')}</Text>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.scoreValue}>{(score || 0).toString().padStart(6, '0')}</Text>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity onPress={onPause} style={styles.iconButton}>
            <Text style={styles.iconText}>{isPaused ? 'RESUME' : 'PAUSE'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onSettings} style={[styles.iconButton, { marginLeft: 8 }]}>
            <Text style={styles.iconText}>OPT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const getStyles = (COLORS) => StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 8,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 70, // Increased height to fit stacked texts
    borderBottomWidth: 2,
    borderBottomColor: COLORS.textPrimary,
    paddingBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    flex: 1,
  },
  scoreLabel: {
    fontFamily: 'PressStart2P',
    fontSize: 10,
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  scoreValue: {
    fontFamily: 'PressStart2P',
    fontSize: 12, // Reduced from 16 to fit 12 zeros without overlap
    color: COLORS.textPrimary,
  },
  iconButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: COLORS.textPrimary,
  },
  iconText: {
    fontFamily: 'PressStart2P',
    fontSize: 10,
    color: COLORS.textPrimary,
  },
});

export default HUD;
