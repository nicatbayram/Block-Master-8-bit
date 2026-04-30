import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useHighScore = () => {
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const loadHighScore = async () => {
      try {
        const stored = await AsyncStorage.getItem('@high_score');
        if (stored !== null) setHighScore(parseInt(stored, 10));
      } catch (e) {
        console.error('Failed to load high score', e);
      }
    };
    loadHighScore();
  }, []);

  const saveHighScore = useCallback(async (newScore) => {
    try {
      if (newScore > highScore) {
        setHighScore(newScore);
        await AsyncStorage.setItem('@high_score', newScore.toString());
        return true;
      }
    } catch (e) {
      console.error('Failed to save high score', e);
    }
    return false;
  }, [highScore]);

  return { highScore, saveHighScore };
};
