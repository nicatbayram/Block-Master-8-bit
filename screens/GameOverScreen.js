import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { BLOCK_COLORS_LIGHT, BLOCK_COLORS_DARK } from '../constants/colors';

const GameOverScreen = ({ navigation, route }) => {
  const { colors: COLORS } = useTheme();
  const styles = getStyles(COLORS);
  const { score, isNewRecord } = route.params || {};
  
  const blinkOpacity = useSharedValue(1);

  useEffect(() => {
    if (isNewRecord) {
      blinkOpacity.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 100 }),
          withTiming(1, { duration: 100 })
        ),
        -1,
        true
      );
    }
  }, [isNewRecord]);

  const blinkStyle = useAnimatedStyle(() => ({
    opacity: blinkOpacity.value,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerBox}>
          <Text style={styles.title}>GAME OVER</Text>
        </View>
        
        {isNewRecord && (
          <Animated.View style={[styles.recordContainer, blinkStyle]}>
            <Text style={styles.recordText}>NEW RECORD!</Text>
          </Animated.View>
        )}

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.scoreValue}>{(score || 0).toString().padStart(6, '0')}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
             style={styles.actionButton} 
             onPress={() => navigation.replace('Game')}
             activeOpacity={1}
          >
            <Text style={styles.actionButtonText}>RETRY</Text>
          </TouchableOpacity>

          <TouchableOpacity 
             style={[styles.actionButton, styles.secondaryButton]} 
             onPress={() => navigation.navigate('Home')}
             activeOpacity={1}
          >
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>TITLE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerBox: {
    borderWidth: 4,
    borderColor: COLORS.textPrimary,
    padding: 20,
    marginBottom: 40,
    backgroundColor: COLORS.background,
  },
  title: {
    fontFamily: 'PressStart2P',
    fontSize: 32,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  recordContainer: {
    marginBottom: 30,
    backgroundColor: COLORS.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  recordText: {
    fontFamily: 'PressStart2P',
    fontSize: 16,
    color: COLORS.background,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  scoreLabel: {
    fontFamily: 'PressStart2P',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  scoreValue: {
    fontFamily: 'PressStart2P',
    fontSize: 32,
    color: COLORS.textPrimary,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  actionButton: {
    borderWidth: 4,
    borderColor: COLORS.textPrimary,
    backgroundColor: COLORS.textPrimary,
    width: '80%',
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: 'PressStart2P',
    color: COLORS.background,
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: COLORS.background,
  },
  secondaryButtonText: {
    color: COLORS.textPrimary,
  },
});

export default GameOverScreen;
