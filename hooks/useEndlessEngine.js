import { useState, useCallback, useRef } from 'react';
import { useSharedValue, useFrameCallback, runOnJS, withSequence, withTiming } from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

// --- Physics & Game Constants ---
const BASE_SPEED = 6;
// Every 10 seconds (600 frames), speed *= 1.05
const DIFFICULTY_INTERVAL_FRAMES = 600; 

const PLAYER_Y = height - 150; 
const PLAYER_SIZE = 40;

// Pool Constants
const POOL_SIZE = 10;
const OBSTACLE_SPAWN_Y_BASE = -100;

export const useEndlessEngine = () => {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Shared Values for Worklet
  const scoreShared = useSharedValue(0);
  const gameSpeed = useSharedValue(BASE_SPEED);
  const frameCount = useSharedValue(0);
  const engineActive = useSharedValue(0);

  // Player position (horizontal)
  const playerX = useSharedValue(width / 2 - PLAYER_SIZE / 2);
  
  // Create object pool manually to satisfy strict React Hook rules
  const p0x = useSharedValue(0); const p0y = useSharedValue(0); const p0w = useSharedValue(0); const p0h = useSharedValue(40); const p0a = useSharedValue(0); const p0p = useSharedValue(0);
  const p1x = useSharedValue(0); const p1y = useSharedValue(0); const p1w = useSharedValue(0); const p1h = useSharedValue(40); const p1a = useSharedValue(0); const p1p = useSharedValue(0);
  const p2x = useSharedValue(0); const p2y = useSharedValue(0); const p2w = useSharedValue(0); const p2h = useSharedValue(40); const p2a = useSharedValue(0); const p2p = useSharedValue(0);
  const p3x = useSharedValue(0); const p3y = useSharedValue(0); const p3w = useSharedValue(0); const p3h = useSharedValue(40); const p3a = useSharedValue(0); const p3p = useSharedValue(0);
  const p4x = useSharedValue(0); const p4y = useSharedValue(0); const p4w = useSharedValue(0); const p4h = useSharedValue(40); const p4a = useSharedValue(0); const p4p = useSharedValue(0);
  const p5x = useSharedValue(0); const p5y = useSharedValue(0); const p5w = useSharedValue(0); const p5h = useSharedValue(40); const p5a = useSharedValue(0); const p5p = useSharedValue(0);
  const p6x = useSharedValue(0); const p6y = useSharedValue(0); const p6w = useSharedValue(0); const p6h = useSharedValue(40); const p6a = useSharedValue(0); const p6p = useSharedValue(0);
  const p7x = useSharedValue(0); const p7y = useSharedValue(0); const p7w = useSharedValue(0); const p7h = useSharedValue(40); const p7a = useSharedValue(0); const p7p = useSharedValue(0);
  const p8x = useSharedValue(0); const p8y = useSharedValue(0); const p8w = useSharedValue(0); const p8h = useSharedValue(40); const p8a = useSharedValue(0); const p8p = useSharedValue(0);
  const p9x = useSharedValue(0); const p9y = useSharedValue(0); const p9w = useSharedValue(0); const p9h = useSharedValue(40); const p9a = useSharedValue(0); const p9p = useSharedValue(0);

  const pool = [
    { x: p0x, y: p0y, w: p0w, h: p0h, active: p0a, passed: p0p },
    { x: p1x, y: p1y, w: p1w, h: p1h, active: p1a, passed: p1p },
    { x: p2x, y: p2y, w: p2w, h: p2h, active: p2a, passed: p2p },
    { x: p3x, y: p3y, w: p3w, h: p3h, active: p3a, passed: p3p },
    { x: p4x, y: p4y, w: p4w, h: p4h, active: p4a, passed: p4p },
    { x: p5x, y: p5y, w: p5w, h: p5h, active: p5a, passed: p5p },
    { x: p6x, y: p6y, w: p6w, h: p6h, active: p6a, passed: p6p },
    { x: p7x, y: p7y, w: p7w, h: p7h, active: p7a, passed: p7p },
    { x: p8x, y: p8y, w: p8w, h: p8h, active: p8a, passed: p8p },
    { x: p9x, y: p9y, w: p9w, h: p9h, active: p9a, passed: p9p },
  ];

  const shakeOffset = useSharedValue(0);
  const isDeathShatter = useSharedValue(0); 
  const flashOpacity = useSharedValue(0);
  
  const gameOverTriggered = useRef(false);

  const stopAudioHaptics = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };

  const triggerGameOverFromWorklet = () => {
    if (gameOverTriggered.current) return;
    gameOverTriggered.current = true;
    
    frameCallback.setActive(false);
    engineActive.value = 0;
    setIsPlaying(false);
    setIsGameOver(true);
    isDeathShatter.value = 1; 
    
    stopAudioHaptics();
    
    shakeOffset.value = withSequence(
      withTiming(-15, { duration: 50 }),
      withTiming(15, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );

    flashOpacity.value = withSequence(
      withTiming(1, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  const spawnObstacle = (i, startingY) => {
    'worklet';
    const obj = pool[i];
    obj.passed.value = 0;
    obj.active.value = 1;
    obj.h.value = 40; 
    obj.w.value = 40 + Math.random() * 80; 
    obj.x.value = Math.random() * (width - obj.w.value - 20) + 10;
    obj.y.value = startingY - (150 + Math.random() * 200); 
  };

  // Main Event Loop
  const frameCallback = useFrameCallback(() => {
    const speed = gameSpeed.value;
    frameCount.value += 1;

    // 1. Difficulty Curve
    if (frameCount.value % DIFFICULTY_INTERVAL_FRAMES === 0) {
      gameSpeed.value *= 1.05;
    }

    // 2. Find highest active obstacle to stagger spawns above it
    let highestY = OBSTACLE_SPAWN_Y_BASE;
    for (let j = 0; j < POOL_SIZE; j++) {
      if (pool[j].active.value === 1 && pool[j].y.value < highestY) {
         highestY = pool[j].y.value;
      }
    }

    for (let i = 0; i < POOL_SIZE; i++) {
      const obj = pool[i];
      if (obj.active.value === 1) {
        // Fall Down
        obj.y.value += speed;

        // Score logic
        if (obj.passed.value === 0 && (obj.y.value > PLAYER_Y + PLAYER_SIZE)) {
          obj.passed.value = 1;
          scoreShared.value += 1;
          runOnJS(setScore)(scoreShared.value);
        }

        // AABB Collision
        // Player Box: x=playerX, y=PLAYER_Y, w=PLAYER_SIZE, h=PLAYER_SIZE
        if (
          playerX.value < obj.x.value + obj.w.value &&
          playerX.value + PLAYER_SIZE > obj.x.value &&
          PLAYER_Y < obj.y.value + obj.h.value &&
          PLAYER_Y + PLAYER_SIZE > obj.y.value
        ) {
          runOnJS(triggerGameOverFromWorklet)();
          return;
        }

        // Despawn when it falls way below screen
        if (obj.y.value > height + 100) {
           obj.active.value = 0;
           spawnObstacle(i, highestY);
           highestY = Math.min(highestY, obj.y.value);
        }
      }
    }
  }, false);

  const setPlayerPos = useCallback((targetX) => {
    'worklet';
    if (engineActive.value === 0) return;
    let boundedX = Math.max(10, targetX);
    boundedX = Math.min(width - PLAYER_SIZE - 10, boundedX);
    playerX.value = boundedX;
  }, [engineActive, playerX]);

  const startGame = useCallback(() => {
    setScore(0);
    scoreShared.value = 0;
    frameCount.value = 0;
    
    setIsGameOver(false);
    gameOverTriggered.current = false;
    isDeathShatter.value = 0;

    gameSpeed.value = BASE_SPEED;
    playerX.value = width / 2 - PLAYER_SIZE / 2;

    // Initialize Spawns staggered vertically
    let currentY = OBSTACLE_SPAWN_Y_BASE;
    for (let i = 0; i < POOL_SIZE; i++) {
       pool[i].passed.value = 0;
       pool[i].active.value = 1;
       pool[i].h.value = 40;
       pool[i].w.value = 50 + Math.random() * 80;
       pool[i].x.value = Math.random() * (width - pool[i].w.value - 20) + 10;
       pool[i].y.value = currentY - Math.random() * 50;
       currentY = pool[i].y.value - 250; // stagger upwards
    }
    
    shakeOffset.value = 0;
    setIsPlaying(true);
    engineActive.value = 1;
    frameCallback.setActive(true);
  }, [frameCallback, playerX, gameSpeed, scoreShared, frameCount, pool, shakeOffset, isDeathShatter, engineActive]);

  const resetGame = useCallback(() => {
     frameCallback.setActive(false);
     engineActive.value = 0;
     setIsPlaying(false);
     setScore(0);
     scoreShared.value = 0;
     setIsGameOver(false);
     isDeathShatter.value = 0;
     flashOpacity.value = 0;
  }, [frameCallback, scoreShared, isDeathShatter, flashOpacity, engineActive]);

  return {
    score,
    isGameOver,
    isPlaying,
    
    playerX, // Exporting X for horizontally moving player
    PLAYER_Y, // Static Y
    PLAYER_SIZE,
    shakeOffset,
    isDeathShatter,
    flashOpacity,
    
    pool,
    
    setPlayerPos,
    startGame,
    resetGame,
  };
};
