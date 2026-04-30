export const SHAPES_TIER_1 = {
  DOT: { blocks: [[1]] },
  LINE_2_H: { blocks: [[1, 1]] },
  LINE_2_V: { blocks: [[1], [1]] },
  LINE_3_H: { blocks: [[1, 1, 1]] },
  LINE_3_V: { blocks: [[1], [1], [1]] },
  L_SMALL_TR: { blocks: [[1, 1], [0, 1]] },
  L_SMALL_TL: { blocks: [[1, 1], [1, 0]] },
  L_SMALL_BR: { blocks: [[0, 1], [1, 1]] },
  L_SMALL_BL: { blocks: [[1, 0], [1, 1]] },
};

export const SHAPES_TIER_2 = {
  LINE_4_H: { blocks: [[1, 1, 1, 1]] },
  LINE_4_V: { blocks: [[1], [1], [1], [1]] },
  SQUARE_2: { blocks: [[1, 1], [1, 1]] },
  T_UP: { blocks: [[0, 1, 0], [1, 1, 1]] },
  T_DOWN: { blocks: [[1, 1, 1], [0, 1, 0]] },
  T_LEFT: { blocks: [[0, 1], [1, 1], [0, 1]] },
  T_RIGHT: { blocks: [[1, 0], [1, 1], [1, 0]] },
};

export const SHAPES_TIER_3 = {
  LINE_5_H: { blocks: [[1, 1, 1, 1, 1]] },
  LINE_5_V: { blocks: [[1], [1], [1], [1], [1]] },
  L_LARGE_TR: { blocks: [[1, 1, 1], [0, 0, 1], [0, 0, 1]] },
  L_LARGE_TL: { blocks: [[1, 1, 1], [1, 0, 0], [1, 0, 0]] },
  L_LARGE_BR: { blocks: [[0, 0, 1], [0, 0, 1], [1, 1, 1]] },
  L_LARGE_BL: { blocks: [[1, 0, 0], [1, 0, 0], [1, 1, 1]] },
  CROSS: { blocks: [[0, 1, 0], [1, 1, 1], [0, 1, 0]] },
  U_UP: { blocks: [[1, 0, 1], [1, 1, 1]] },
  U_DOWN: { blocks: [[1, 1, 1], [1, 0, 1]] },
  S_H: { blocks: [[0, 1, 1], [1, 1, 0]] },
  Z_H: { blocks: [[1, 1, 0], [0, 1, 1]] },
  SQUARE_3: { blocks: [[1, 1, 1], [1, 1, 1], [1, 1, 1]] },
};

const getShapeFromTier = (tier) => {
  const keys = Object.keys(tier);
  return tier[keys[Math.floor(Math.random() * keys.length)]].blocks;
};

export const generateRandomPiece = (level = 1) => {
  let tierSelect = Math.random();
  let selectedBlocks;

  if (level === 1) {
    selectedBlocks = tierSelect < 0.7 ? getShapeFromTier(SHAPES_TIER_1) : getShapeFromTier(SHAPES_TIER_2);
  } else if (level === 2) {
    if (tierSelect < 0.4) selectedBlocks = getShapeFromTier(SHAPES_TIER_1);
    else if (tierSelect < 0.9) selectedBlocks = getShapeFromTier(SHAPES_TIER_2);
    else selectedBlocks = getShapeFromTier(SHAPES_TIER_3);
  } else {
    if (tierSelect < 0.2) selectedBlocks = getShapeFromTier(SHAPES_TIER_1);
    else if (tierSelect < 0.6) selectedBlocks = getShapeFromTier(SHAPES_TIER_2);
    else selectedBlocks = getShapeFromTier(SHAPES_TIER_3);
  }

  // Deep clone to avoid mutating constants
  let shape = selectedBlocks.map(row => [...row]);

  // Stone block chance for higher levels
  if (level >= 3 && Math.random() < 0.2) {
    // Pick a random block in the shape and turn it to stone (2)
    let ones = [];
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] === 1) ones.push({r, c});
      }
    }
    if (ones.length > 0) {
      const target = ones[Math.floor(Math.random() * ones.length)];
      shape[target.r][target.c] = 2; // 2 represents Stone
    }
  }

  return {
    id: Math.random().toString(36).substring(2, 9),
    shape,
  };
};

export const generateInitialTray = (level = 1) => {
  return [generateRandomPiece(level), generateRandomPiece(level), generateRandomPiece(level)];
};

export const generateInitialQueue = (level = 1) => {
  return [generateRandomPiece(level), generateRandomPiece(level), generateRandomPiece(level)];
};
