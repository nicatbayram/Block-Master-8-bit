import React, { forwardRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Cell from './Cell';
import RetroExplosion from './RetroExplosion';
import { BOARD_SIZE } from '../utils/boardLogic';
import { useTheme } from '../contexts/ThemeContext';
import { BLOCK_COLORS_LIGHT, BLOCK_COLORS_DARK } from '../constants/colors';

const { width, height } = Dimensions.get('window');
const BOARD_PADDING = 10; // Reduce padding to save space
// Limit board size so it doesn't overflow vertically on shorter screens
const MAX_BOARD_SIZE = Math.min(width - BOARD_PADDING * 1, height * 0.5); 
export const CELL_SIZE = Math.floor(MAX_BOARD_SIZE / BOARD_SIZE);

const Board = forwardRef(({ board, ghostPiece, ghostPos, onGridLayout, clearedAreas }, ref) => {
  const { colors: COLORS } = useTheme();
  const styles = getStyles(COLORS);
  const isGhostCell = (r, c) => {
    if (!ghostPiece || !ghostPos) return false;
    const { row: startRow, col: startCol } = ghostPos;
    const pieceRow = r - startRow;
    const pieceCol = c - startCol;
    
    if (pieceRow >= 0 && pieceRow < ghostPiece.shape.length &&
        pieceCol >= 0 && pieceCol < ghostPiece.shape[0].length) {
      return ghostPiece.shape[pieceRow][pieceCol] === 1;
    }
    return false;
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid} ref={ref} onLayout={onGridLayout}>
        {board.map((row, r) => (
          <View key={`row-${r}`} style={styles.row}>
            {row.map((cellState, c) => {
                const showGhost = isGhostCell(r, c) && cellState === 0;
                const isExploding = clearedAreas !== null && (
                   clearedAreas.rows.includes(r) ||
                   clearedAreas.cols.includes(c) ||
                   clearedAreas.subgrids.some(sg => r >= sg.rowStart && r < sg.rowStart + 3 && c >= sg.colStart && c < sg.colStart + 3)
                );
                
                return (
                 <View 
                   key={`cell-${r}-${c}`} 
                   style={styles.cellBackground}
                 >
                    <Cell 
                      size={CELL_SIZE} 
                      value={cellState} 
                      isGhost={showGhost} 
                    />
                    {isExploding && <RetroExplosion key={`expl-${clearedAreas.id}`} />}
                 </View>
                );
             })}
           </View>
         ))}
       </View>
     </View>
   );
});
 
const getStyles = (COLORS) => StyleSheet.create({
   container: {
     padding: BOARD_PADDING,
     alignItems: 'center',
     justifyContent: 'center',
   },
   grid: {
     backgroundColor: COLORS.background,
     borderWidth: 2,
     borderColor: COLORS.textPrimary,
     borderStyle: 'solid',
   },
   row: {
     flexDirection: 'row',
   },
   cellBackground: {
     borderWidth: 1,
     borderColor: COLORS.gridLines,
     backgroundColor: 'transparent', 
   }
});

export default Board;
