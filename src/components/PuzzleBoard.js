import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
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
  const [pieces, setPieces] = useState(initialPieces);
  const [score, setScore] = useState(0);
  const [solvedPieces, setSolvedPieces] = useState(new Set());
  const [isSolved, setIsSolved] = useState(false);
  
  const gridSize = Math.sqrt(initialPieces.length);
  const pieceSize = BOARD_SIZE / gridSize;

  // Check if a piece is in its correct position
  const isCorrectPosition = (piece) => {
    return piece.correctPosition.x === piece.currentPosition.x &&
           piece.correctPosition.y === piece.currentPosition.y;
  };

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
          const newPiece = {
            ...piece,
            currentPosition: { ...newPosition }
          };
          
          // Check if piece landed in correct position
          if (isCorrectPosition(newPiece) && !solvedPieces.has(pieceId)) {
            setScore(prev => prev + 100);
            setSolvedPieces(prev => new Set([...prev, pieceId]));
          }
          
          return newPiece;
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

      // Check if puzzle is solved
      const allCorrect = newPieces.every(isCorrectPosition);
      if (allCorrect && !isSolved) {
        setScore(prev => prev + 1000);
        setIsSolved(true);
      }

      return newPieces;
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.board, isSolved && styles.solvedBoard]}>
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
                  height: pieceSize,
                  borderWidth: isSolved ? 0 : 1
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
            onPieceMove={handlePieceMove}
            isLocked={solvedPieces.has(piece.id)}
            isSolved={isCorrectPosition(piece)}
          />
        ))}
      </View>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>

      {isSolved && (
        <View style={styles.solvedContainer}>
          <Text style={styles.solvedText}>Puzzle Solved! +1000 points</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: '#8338ec',
    borderRadius: 8,
    position: 'relative',
  },
  solvedBoard: {
    borderWidth: 4,
    borderColor: 'gold',
  },
  gridOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gridCell: {
    position: 'absolute',
    borderColor: '#ddd',
  },
  scoreContainer: {
    position: 'absolute',
    top: 20,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
  },
  scoreText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  solvedContainer: {
    position: 'absolute',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderRadius: 12,
    alignItems: 'center',
  },
  solvedText: {
    color: 'gold',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default PuzzleBoard; 