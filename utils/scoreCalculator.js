// 1 point per block placed
// 18 points base per row/col cleared
// Cascade multiplier: x1.5, x2, x2.5, etc.

export const BASE_LINE_SCORE = 18;
export const BLOCK_SCORE = 1;

export const calculateScore = (blocksPlaced, linesCleared) => {
  let score = blocksPlaced * BLOCK_SCORE;

  if (linesCleared > 0) {
    // Determine combo multiplier
    // 1 line = x1
    // 2 lines = x2 (Wait, requirements say cascade x2 for 2 lines, cascade x3+ for 3 lines)
    // cascade x2 means double line score. cascade x3+ means triple line score.
    
    let multiplier = 1;
    if (linesCleared === 2) {
      multiplier = 2;
    } else if (linesCleared >= 3) {
      multiplier = 3;
    }

    score += (linesCleared * BASE_LINE_SCORE * multiplier);
  }

  return score;
};
