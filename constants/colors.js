export const BLOCK_COLORS_LIGHT = [
  { highlight: '#535353', base: '#535353', shadow: '#535353' },
];

export const BLOCK_COLORS_DARK = [
  { highlight: '#C56BFF', base: '#7A00CC', shadow: '#7A00CC' }, 
];

export const lightTheme = {
  background: '#FFFFFF',
  boardBg: '#FFFFFF',
  emptyCellBg: '#FFFFFF',
  emptyCellBorder: '#535353',
  gridLines: '#EEEEEE',
  block: '#646363', // Pale gray exclusively for game pieces (old light mode)
  textPrimary: '#535353',
  textSecondary: '#535353',
  gold: '#535353',
  orange: '#535353',
  white: '#FFFFFF',
  cardBg: '#FFFFFF',
  cardBorder: '#535353',
  buttonPrimary: '#535353',
  buttonPrimaryHover: '#535353',
  destructive: '#535353',
  clearFlash: '#535353',
  blockColors: BLOCK_COLORS_LIGHT,
};

export const darkTheme = {
  background: '#000000',
  boardBg: '#000000',
  emptyCellBg: '#000000',
  emptyCellBorder: '#7A00CC', // user requested to be purple (not gray)
  gridLines: '#4A4A4A',
  block: '#7a04c9ff', // user requested small piece blocks to be purple
  textPrimary: '#A020F0', 
  textSecondary: '#C56BFF',
  gold: '#A020F0',
  orange: '#A020F0',
  white: '#FFFFFF',
  cardBg: '#0A0A0A',
  cardBorder: '#A020F0',
  buttonPrimary: '#A020F0',
  buttonPrimaryHover: '#C56BFF',
  destructive: '#FF0055',
  clearFlash: '#FFFFFF',
  blockColors: BLOCK_COLORS_DARK,
};

// Maintain fallback exports temporarily until refactor completes
export const COLORS = darkTheme;
export const BLOCK_COLORS = BLOCK_COLORS_DARK;
