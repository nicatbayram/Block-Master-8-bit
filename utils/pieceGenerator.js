export const SHAPES = {
  DOT: { blocks: [[1]] },
  
  LINE_2_H: { blocks: [[1, 1]] },
  LINE_2_V: { blocks: [[1], [1]] },
  
  LINE_3_H: { blocks: [[1, 1, 1]] },
  LINE_3_V: { blocks: [[1], [1], [1]] },
  
  LINE_4_H: { blocks: [[1, 1, 1, 1]] },
  LINE_4_V: { blocks: [[1], [1], [1], [1]] },
  
  LINE_5_H: { blocks: [[1, 1, 1, 1, 1]] },
  LINE_5_V: { blocks: [[1], [1], [1], [1], [1]] },

  SQUARE_2: { blocks: [[1, 1], [1, 1]] },

  // Small L-Shapes (Corner in all 4 directions)
  L_SMALL_TR: { blocks: [[1, 1], [0, 1]] },
  L_SMALL_TL: { blocks: [[1, 1], [1, 0]] },
  L_SMALL_BR: { blocks: [[0, 1], [1, 1]] },
  L_SMALL_BL: { blocks: [[1, 0], [1, 1]] },

  // Large L-Shapes (Corner in all 4 directions)
  L_LARGE_TR: { blocks: [[1, 1, 1], [0, 0, 1], [0, 0, 1]] },
  L_LARGE_TL: { blocks: [[1, 1, 1], [1, 0, 0], [1, 0, 0]] },
  L_LARGE_BR: { blocks: [[0, 0, 1], [0, 0, 1], [1, 1, 1]] },
  L_LARGE_BL: { blocks: [[1, 0, 0], [1, 0, 0], [1, 1, 1]] },

  // T-Shapes (All 4 directions)
  T_UP: { blocks: [[0, 1, 0], [1, 1, 1]] },
  T_DOWN: { blocks: [[1, 1, 1], [0, 1, 0]] },
  T_LEFT: { blocks: [[0, 1], [1, 1], [0, 1]] },
  T_RIGHT: { blocks: [[1, 0], [1, 1], [1, 0]] },

  CROSS: { blocks: [[0, 1, 0], [1, 1, 1], [0, 1, 0]] },
};

const SHAPE_KEYS = Object.keys(SHAPES);

export const generateRandomPiece = () => {
  const randomIndex = Math.floor(Math.random() * SHAPE_KEYS.length);
  const key = SHAPE_KEYS[randomIndex];
  return {
    id: Math.random().toString(36).substring(2, 9),
    shape: SHAPES[key].blocks,
  };
};

export const generateInitialTray = () => {
  return [generateRandomPiece(), generateRandomPiece(), generateRandomPiece()];
};

export const generateInitialQueue = () => {
  return [generateRandomPiece(), generateRandomPiece(), generateRandomPiece()];
};
