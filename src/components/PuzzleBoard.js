import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import PuzzlePiece from './PuzzlePiece';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width * 0.9;

// Helper functions defined outside component
const getCellIndexFromPosition = (position, pieceSize, gridSize) => {
  const row = Math.floor(position.y / pieceSize);
  const col = Math.floor(position.x / pieceSize);
  return row * gridSize + col;
};

const getPositionFromCellIndex = (index, pieceSize, gridSize) => {
  return {
    x: (index % gridSize) * pieceSize,
    y: Math.floor(index / gridSize) * pieceSize
  };
};

const PuzzleBoard = ({ pieces: initialPieces, difficulty }) => {
  const gridSize = Math.sqrt(initialPieces.length);
  const pieceSize = BOARD_SIZE / gridSize;

  // Initialize cell occupancy
  const [cellOccupancy, setCellOccupancy] = useState(() => {
    const occupancy = {};
    initialPieces.forEach(piece => {
      const cellIndex = getCellIndexFromPosition(piece.currentPosition, pieceSize, gridSize);
      occupancy[cellIndex] = piece.imageUrl;
    });
    return occupancy;
  });

  const [pieces, setPieces] = useState(initialPieces);

  const handlePieceMove = (pieceId, newPosition) => {
    setPieces(currentPieces => {
      console.log('Starting move:', { pieceId, newPosition });

      // Find the moving piece
      const movingPiece = currentPieces.find(p => p.id === pieceId);
      const originalPosition = { ...movingPiece.currentPosition };

      // Find piece in target position
      const pieceInTargetPosition = currentPieces.find(p => 
        p.id !== pieceId && 
        p.currentPosition.x === newPosition.x && 
        p.currentPosition.y === newPosition.y
      );

      console.log('Found pieces:', {
        moving: { id: movingPiece.id, pos: originalPosition },
        target: pieceInTargetPosition ? 
          { id: pieceInTargetPosition.id, pos: pieceInTargetPosition.currentPosition } : 
          'none'
      });

      // Create new array and swap positions
      const newPieces = currentPieces.map(piece => {
        if (piece.id === pieceId) {
          // This is the piece we're moving to the new position
          return {
            ...piece,
            currentPosition: { ...newPosition }
          };
        } 
        else if (pieceInTargetPosition && piece.id === pieceInTargetPosition.id) {
          // This is the piece that needs to move to the empty spot
          return {
            ...piece,
            currentPosition: { ...originalPosition }
          };
        }
        // Leave all other pieces unchanged
        return piece;
      });

      console.log('After swap:', newPieces.map(p => ({
        id: p.id,
        position: p.currentPosition
      })));

      return newPieces;
    });
  };

  return (
    <View style={styles.board}>
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
          pieces={pieces}
          onPieceMove={handlePieceMove}
          cellIndex={getCellIndexFromPosition(piece.currentPosition, pieceSize, gridSize)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: '#8338ec',
    borderRadius: 8,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -BOARD_SIZE / 2 }, { translateY: -BOARD_SIZE / 2 }],
  },
  gridOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderColor: "red",
    borderWidth: 1,
  },
  gridCell: {
    position: 'absolute',
    borderColor: '#ddd',
    borderWidth: 1,
  }
});

export default PuzzleBoard; 