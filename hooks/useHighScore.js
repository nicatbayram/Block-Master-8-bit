import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useHighScore = () => {
  const [highScore, setHighScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedScore = await AsyncStorage.getItem('@high_score');
        if (storedScore !== null) setHighScore(parseInt(storedScore, 10));

        const storedBoard = await AsyncStorage.getItem('@leaderboard');
        if (storedBoard) {
          setLeaderboard(JSON.parse(storedBoard));
        } else {
          // Default arcade leaderboard
          setLeaderboard([
            { initials: 'AAA', score: 1000 },
            { initials: 'BBB', score: 800 },
            { initials: 'CCC', score: 600 },
            { initials: 'DDD', score: 400 },
            { initials: 'EEE', score: 200 },
          ]);
        }
      } catch (e) {
        console.error('Failed to load data', e);
      }
    };
    loadData();
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

  const saveToLeaderboard = useCallback(async (initials, newScore) => {
    const newEntry = { initials: initials.toUpperCase().substring(0, 3), score: newScore };
    const newBoard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    setLeaderboard(newBoard);
    await AsyncStorage.setItem('@leaderboard', JSON.stringify(newBoard));
    
    if (newScore > highScore) {
      saveHighScore(newScore);
    }
  }, [leaderboard, highScore, saveHighScore]);

  const isLeaderboardEligible = useCallback((score) => {
    if (leaderboard.length < 5) return true;
    return score > leaderboard[4].score;
  }, [leaderboard]);

  return { highScore, saveHighScore, leaderboard, saveToLeaderboard, isLeaderboardEligible };
};
