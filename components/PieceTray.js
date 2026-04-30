import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Piece, { PIECE_SCALE } from './Piece';
import Cell from './Cell';
import { CELL_SIZE } from './Board';
import { useTheme } from '../contexts/ThemeContext';
import { BLOCK_COLORS_LIGHT, BLOCK_COLORS_DARK } from '../constants/colors';

const MiniPiece = ({ piece }) => {
  const { colors: COLORS } = useTheme();
  const styles = getStyles(COLORS);
  if (!piece || !piece.shape) return <View style={styles.miniPiecePlaceholder} />;
  
  const MINI_CELL_SIZE = CELL_SIZE * 0.4;

  return (
    <View style={styles.miniPieceContainer}>
      {piece.shape.map((row, r) => (
        <View key={`${piece.id}-mini-row-${r}`} style={styles.row}>
          {row.map((cellFilled, c) => (
             <Cell 
               key={`${piece.id}-mini-cell-${r}-${c}`}
               size={MINI_CELL_SIZE}
               filled={cellFilled === 1}
               isGhost={false}
             />
          ))}
        </View>
      ))}
    </View>
  );
};

const PieceTray = ({ trayPieces, onDragUpdate, onDragEnd }) => {
  const { colors: COLORS } = useTheme();
  const styles = getStyles(COLORS);
  return (
    <View style={styles.container}>
      <View style={styles.trayContainer}>
        {trayPieces.map((piece, i) => (
          <View key={`tray-slot-${i}`} style={styles.slot}>
            <Piece 
               key={piece ? piece.id : `empty-${i}`}
               piece={piece} 
               index={i} 
               onDragUpdate={onDragUpdate} 
               onDragEnd={onDragEnd} 
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const getStyles = (COLORS) => StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  trayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
    height: CELL_SIZE * 3 * PIECE_SCALE + 16, 
    zIndex: 10,
  },
  slot: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  miniPieceContainer: {},
  miniPiecePlaceholder: {
    width: CELL_SIZE * 0.4 * 3,
  },
  row: {
    flexDirection: 'row',
  },
});

export default PieceTray;
