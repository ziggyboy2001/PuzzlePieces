import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import PuzzlePiece from './PuzzlePiece';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width * 0.9;

const PuzzleBoard = ({ pieces, difficulty }) => {
  const gridSize = Math.sqrt(pieces.length);
  const pieceSize = BOARD_SIZE / gridSize;

  return (
    <View style={styles.board}>
      {/* Grid overlay */}
      <View style={styles.gridOverlay}>
        {Array.from({ length: gridSize * gridSize }).map((_, index) => (
          <View
            key={`grid-${index}`}
            style={[
              styles.gridCell,
              {
                left: (index % gridSize) * pieceSize,
                top: Math.floor(index / gridSize) * pieceSize,
                width: pieceSize,
                height: pieceSize
              }
            ]}
          />
        ))}
      </View>
      
      {pieces.map((piece) => (
        <PuzzlePiece
          key={piece.id}
          piece={piece}
          pieceSize={pieceSize}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    position: 'relative',
  },
  gridOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gridCell: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#ddd',
  }
});

export default PuzzleBoard; 