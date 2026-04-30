import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';

// Pre-load all available sounds
const SOUNDS = {
  cube: require('../assets/sounds/cube.mp3'),
  'game-over': require('../assets/sounds/game-over.mp3'),
  horizontal: require('../assets/sounds/horizontal.mp3'),
  pause: require('../assets/sounds/pause.mp3'),
  twice: require('../assets/sounds/twice.mp3'),
  vertical: require('../assets/sounds/vertical.mp3'),
};

// Map to store loaded player objects
const players = {};

/**
 * Creates an audio player for a given sound asset.
 * In expo-audio, players are the primary way to manage playback.
 */
const loadSound = (name) => {
  try {
    const asset = SOUNDS[name];
    if (!asset) throw new Error(`Asset not found for sound: ${name}`);
    
    // createAudioPlayer is synchronous in expo-audio
    const player = createAudioPlayer(asset);
    players[name] = player;
    return player;
  } catch (error) {
    console.error(`[Audio] Failed to load sound: ${name}`, error);
    return null;
  }
};

// Pre-load all sounds on startup
export const initSounds = async () => {
  console.log('[Audio] Initializing sounds with expo-audio...');
  
  try {
    // Configure global audio behavior
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    });

    Object.keys(SOUNDS).forEach(name => {
      loadSound(name);
    });
    
    console.log('[Audio] All sounds initialized successfully');
  } catch (e) {
    console.error('[Audio] Error initializing audio system', e);
  }
};

/**
 * Plays a pre-loaded sound.
 * Seeks to the beginning if it was already played.
 */
export const playSound = (name) => {
  const player = players[name];
  if (player) {
    try {
      // expo-audio player.play() handles playback.
      // We seek to 0 to ensure SFX play from the start if triggered rapidly.
      player.seekTo(0);
      player.play();
    } catch (error) {
      console.warn(`Playback of ${name} failed`, error);
    }
  } else {
    // If not loaded, try to load and play
    const newPlayer = loadSound(name);
    if (newPlayer) {
      newPlayer.play();
    } else {
      console.warn(`Sound ${name} is not loaded and failed to load on fly`);
    }
  }
};

export default {
    init: initSounds,
    play: playSound
};
