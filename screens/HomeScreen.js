import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withRepeat,
  withSequence
} from 'react-native-reanimated';
import { useHighScore } from '../hooks/useHighScore';
import { useTheme } from '../contexts/ThemeContext';
import { BLOCK_COLORS_LIGHT, BLOCK_COLORS_DARK } from '../constants/colors';

const HomeScreen = ({ navigation }) => {
  const { colors: COLORS } = useTheme();
  const styles = getStyles(COLORS);
  const { highScore } = useHighScore();
  const blinkOpacity = useSharedValue(1);

  useEffect(() => {
    // 8-bit style blinking text effect
    blinkOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 50 }),
        withTiming(0, { duration: 400 }),
        withTiming(1, { duration: 50 }),
        withTiming(1, { duration: 400 })
      ),
      -1,
      false
    );
  }, []);

  const blinkStyle = useAnimatedStyle(() => ({
    opacity: blinkOpacity.value,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleBlock}>BLOCK</Text>
          <Text style={styles.titleBlast}>MASTER</Text>
          <Text style={styles.title8Bit}>8-BIT</Text>
        </View>
        
        <View style={styles.scoreBoard}>
           <Text style={styles.highScoreLabel}>HI-SCORE</Text>
           <Text style={styles.highScoreValue}>{highScore.toString().padStart(6, '0')}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
             style={styles.playButton} 
             onPress={() => navigation.navigate('Game')}
             activeOpacity={1}
          >
            <Animated.Text style={[styles.playButtonText, blinkStyle]}>
              PRESS TO START
            </Animated.Text>
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
    paddingTop: 100,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titleContainer: {
    marginBottom: 60,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: COLORS.textPrimary,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  titleBlock: {
    fontFamily: 'PressStart2P',
    fontSize: 32,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  titleBlast: {
    fontFamily: 'PressStart2P',
    fontSize: 32,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  title8Bit: {
    fontFamily: 'PressStart2P',
    fontSize: 24,
    color: COLORS.background,
    backgroundColor: COLORS.textPrimary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginTop: 10,
  },
  scoreBoard: {
    alignItems: 'center',
    marginBottom: 80,
  },
  highScoreLabel: {
    fontFamily: 'PressStart2P',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  highScoreValue: {
    fontFamily: 'PressStart2P',
    fontSize: 24,
    color: COLORS.textPrimary,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  playButton: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  playButtonText: {
    fontFamily: 'PressStart2P',
    color: COLORS.textPrimary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default HomeScreen;
