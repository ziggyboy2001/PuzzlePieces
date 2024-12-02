import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, Image } from 'react-native';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import PuzzlePiece from './PuzzlePiece';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width * 0.9;

const CATEGORIES = ['bear', 'giraffe', 'puppy', 'pig', 'compilation'];

const FULL_IMAGES = {
  bear: require('../../assets/images/bear/full_image/full.png'),
  giraffe: require('../../assets/images/giraffe/full_image/full.png'),
  puppy: require('../../assets/images/puppy/full_image/full.png'),
  pig: require('../../assets/images/pig/full_image/full.png'),
  compilation: require('../../assets/images/compilation/full_image/full.png'),
  cherub: require('../../assets/images/cherub/full_image/full.png'),
  penguin: require('../../assets/images/penguin/full_image/full.png'),
  mermaid: require('../../assets/images/mermaid/full_image/full.png'),
};

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

const PuzzleBoard = ({ 
  pieces: initialPieces, 
  difficulty, 
  onNextPuzzle, 
  level,
  currentCategoryIndex,
  bgColors,
  currentBgColor,
  onColorChange,
  currentCategory
}) => {
  const [connectSound, setConnectSound] = useState();
  const [pageSound, setPageSound] = useState();
  const [pieces, setPieces] = useState(initialPieces);
  const [score, setScore] = useState(0);
  const [solvedPieces, setSolvedPieces] = useState(new Set());
  const [isSolved, setIsSolved] = useState(false);

  useEffect(() => {
    setPieces(initialPieces);
    setSolvedPieces(new Set());
    setIsSolved(false);
  }, [initialPieces]);

  useEffect(() => {
    return () => {
      if (connectSound) connectSound.unloadAsync();
      if (pageSound) pageSound.unloadAsync();
    };
  }, [connectSound, pageSound]);

  const gridSize = Math.sqrt(initialPieces.length);
  const pieceSize = BOARD_SIZE / gridSize;

  const isCorrectPosition = (piece) => {
    return piece.correctPosition.x === piece.currentPosition.x &&
           piece.correctPosition.y === piece.currentPosition.y;
  };

  const playConnectSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/sounds/connect.wav')
    );
    setConnectSound(sound);
    await sound.playAsync();
  };

  const playPageSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/sounds/page-forward.wav')
    );
    setPageSound(sound);
    await sound.playAsync();
  };

  const handleNextPuzzleWithSound = async () => {
    await playPageSound();
    onNextPuzzle();
  };

  const handlePieceMove = (pieceId, newPosition) => {
    setPieces(currentPieces => {
      console.log('Starting move:', { pieceId, newPosition });

      const movingPiece = currentPieces.find(p => p.id === pieceId);
      const originalPosition = { ...movingPiece.currentPosition };

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

      const newPieces = currentPieces.map(piece => {
        if (piece.id === pieceId) {
          const newPiece = {
            ...piece,
            currentPosition: { ...newPosition }
          };
          
          if (isCorrectPosition(newPiece) && !solvedPieces.has(pieceId)) {
            playConnectSound();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setScore(prev => prev + 100);
            setSolvedPieces(prev => new Set([...prev, pieceId]));
          }
          
          return newPiece;
        } 
        else if (pieceInTargetPosition && piece.id === pieceInTargetPosition.id) {
          return {
            ...piece,
            currentPosition: { ...originalPosition }
          };
        }
        return piece;
      });

      console.log('After swap:', newPieces.map(p => ({
        id: p.id,
        position: p.currentPosition
      })));

      const allCorrect = newPieces.every(isCorrectPosition);
      if (allCorrect && !isSolved) {
        setScore(prev => prev + 1000);
        setIsSolved(true);
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
      }

      return newPieces;
    });
  };

  const handleColorChangeWithHaptics = (color) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onColorChange(color);
  };

  return (
    <View style={styles.container}>
      <View style={styles.levelContainer}>
        <Text style={styles.levelText}>
          Level {level === 'easy' ? '1' : '2'}
        </Text>
      </View>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>Score: {score}</Text>
      </View>

      <Image 
        source={FULL_IMAGES[currentCategory]}
        style={styles.previewImage}
        resizeMode="contain"
      />

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
            isPuzzleSolved={isSolved}
          />
        ))}

        {isSolved && (
          <Image
            source={FULL_IMAGES[currentCategory]}
            style={styles.solvedOverlay}
            resizeMode="contain"
          />
        )}
      </View>

      {isSolved && (
        <View style={styles.solvedContainer}>
          <Text style={styles.solvedText}>
            {level === 'easy' && currentCategoryIndex === CATEGORIES.length - 1 
              ? 'Level 1 Complete! Moving to Level 2'
              : level === 'medium' && currentCategoryIndex === CATEGORIES.length - 1
                ? 'All Puzzles Complete! Starting Over'
                : 'Puzzle Solved! +1000 points'}
          </Text>
          <TouchableOpacity 
            style={styles.nextButton}
            onPress={handleNextPuzzleWithSound}
          >
            <Text style={styles.nextButtonText}>Next Puzzle</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.colorPickerContainer}>
        {bgColors.map((color, index) => (
          <TouchableOpacity 
            key={index} 
            style={[
              styles.colorButton, 
              { backgroundColor: color },
              color === currentBgColor && styles.selectedColorButton
            ]} 
            onPress={() => handleColorChangeWithHaptics(color)} 
          />
        ))}
      </View>
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
    // backgroundColor: '#8338ec',
    borderRadius: 8,
    position: 'relative',
    marginTop: 16,
  },
  solvedBoard: {
    shadowColor: 'gold',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
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
    top: 120,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 1000,
  },
  solvedText: {
    color: 'gold',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 8,
  },
  nextButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  levelContainer: {
    position: 'absolute',
    top: 60,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    marginTop: 8,
  },
  levelText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  colorPickerContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
    padding: 10,
    backgroundColor: 'white',
    // opacity: 0.5,
    borderRadius: 8,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  selectedColorButton: {
    borderColor: 'white',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  previewImage: {
    width: BOARD_SIZE * 0.4,
    height: BOARD_SIZE * 0.4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    marginTop: 0,
  },
  solvedOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 1000,
    borderRadius: 8,  
  },
});

export default PuzzleBoard;