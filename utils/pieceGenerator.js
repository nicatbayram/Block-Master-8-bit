export const SHAPES = {
  DOT: { blocks: [[1]] },
  SQUARE: { blocks: [[1, 1], [1, 1]] },
  LINE_3_H: { blocks: [[1, 1, 1]] },
  LINE_3_V: { blocks: [[1], [1], [1]] },
  L_SHAPE_1: { blocks: [[1, 0], [1, 1]] },
  L_SHAPE_2: { blocks: [[0, 1], [1, 1]] },
  L_SHAPE_3: { blocks: [[1, 1], [1, 0]] },
  L_SHAPE_4: { blocks: [[1, 1], [0, 1]] },
  LINE_4_H: { blocks: [[1, 1, 1, 1]] },
  LINE_4_V: { blocks: [[1], [1], [1], [1]] },
  CROSS: { blocks: [[0, 1, 0], [1, 1, 1], [0, 1, 0]] },
  T_SHAPE_U: { blocks: [[1, 1, 1], [0, 1, 0]] },
  T_SHAPE_D: { blocks: [[0, 1, 0], [1, 1, 1]] }
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
