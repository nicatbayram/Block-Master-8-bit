export const BLOCK_COLORS_LIGHT = [
  { highlight: '#306230', base: '#0f380f', shadow: '#0f380f' }, // Gameboy dark green
];

export const BLOCK_COLORS_DARK = [
  { highlight: '#E0FFFF', base: '#00FFFF', shadow: '#008080' }, // Neon Arcade Cyan
];

export const lightTheme = {
  background: '#ffffffff', // Classic Gameboy pea green
  boardBg: '#ffffffff',
  emptyCellBg: '#ffffffff',
  emptyCellBorder: '#8bac0f',
  gridLines: '#a1a1a1ff',
  block: '#0f380f',
  textPrimary: '#0f380f', // Darkest green for text
  textSecondary: '#306230',
  gold: '#0f380f',
  orange: '#0f380f',
  white: '#9bbc0f',
  cardBg: '#8bac0f',
  cardBorder: '#0f380f',
  buttonPrimary: '#0f380f',
  buttonPrimaryHover: '#306230',
  destructive: '#0f380f',
  clearFlash: '#FFFFFF',
  blockColors: BLOCK_COLORS_LIGHT,
};

export const darkTheme = {
  background: '#000A14', // Deep arcade cabinet shadow
  boardBg: '#00050A', // Darkest blue for board
  emptyCellBg: '#00050A',
  emptyCellBorder: '#00334D', // Faint glowing teal borders
  gridLines: '#00334D', // Faint teal grid
  block: '#00FFFF', // Neon Cyan blocks
  textPrimary: '#00FFFF', // Neon Cyan text
  textSecondary: '#008080',
  gold: '#00FFFF',
  orange: '#00FFFF',
  white: '#FFFFFF',
  cardBg: '#001A29',
  cardBorder: '#00FFFF',
  buttonPrimary: '#00FFFF',
  buttonPrimaryHover: '#E0FFFF',
  destructive: '#FF0055',
  clearFlash: '#FFFFFF',
  blockColors: BLOCK_COLORS_DARK,
};

// Maintain fallback exports temporarily until refactor completes
export const COLORS = darkTheme; // Set back to darkTheme to show the user
export const BLOCK_COLORS = BLOCK_COLORS_DARK;
