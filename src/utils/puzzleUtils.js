import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const BOARD_SIZE = width * 0.9;

const DIFFICULTY_SETTINGS = {
  easy: 4,    // 2x2 grid
  medium: 9,  // 3x3 grid
};

// Calculate grid positions for snapping
export const calculateGridPositions = (difficulty) => {
  const gridSize = Math.sqrt(DIFFICULTY_SETTINGS[difficulty]);
  const pieceSize = BOARD_SIZE / gridSize;
  const positions = [];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      positions.push({
        x: col * pieceSize,
        y: row * pieceSize,
        occupied: false,
        index: row * gridSize + col
      });
    }
  }
  return positions;
};

// Find nearest snap point
export const findNearestSnapPoint = (x, y, gridPositions, pieceSize) => {
  const snapDistance = pieceSize / 2; // Maximum distance for snapping
  
  for (const position of gridPositions) {
    const distance = Math.sqrt(
      Math.pow(position.x - x, 2) + 
      Math.pow(position.y - y, 2)
    );
    
    if (distance < snapDistance && !position.occupied) {
      return position;
    }
  }
  return null;
};

// Define all possible image paths
const PUZZLE_IMAGES = {
  bear: {
    easy: [
      require('../../assets/images/bear/bear_4/bear_001.jpg'),
      require('../../assets/images/bear/bear_4/bear_002.jpg'),
      require('../../assets/images/bear/bear_4/bear_003.jpg'),
      require('../../assets/images/bear/bear_4/bear_004.jpg'),
    ],
    medium: [
      require('../../assets/images/bear/bear_9/bear_001.jpg'),
      require('../../assets/images/bear/bear_9/bear_002.jpg'),
      require('../../assets/images/bear/bear_9/bear_003.jpg'),
      require('../../assets/images/bear/bear_9/bear_004.jpg'),
      require('../../assets/images/bear/bear_9/bear_005.jpg'),
      require('../../assets/images/bear/bear_9/bear_006.jpg'),
      require('../../assets/images/bear/bear_9/bear_007.jpg'),
      require('../../assets/images/bear/bear_9/bear_008.jpg'),
      require('../../assets/images/bear/bear_9/bear_009.jpg'),
    ]
  }
  // Add other categories as needed
};

export const createPuzzlePieces = (category, difficulty) => {
  const numPieces = DIFFICULTY_SETTINGS[difficulty];
  const gridSize = Math.sqrt(numPieces);
  const pieceSize = BOARD_SIZE / gridSize;
  const images = PUZZLE_IMAGES[category][difficulty];
  const gridPositions = calculateGridPositions(difficulty);
  
  const pieces = images.map((imageSource, i) => {
    // Randomly select an available grid position
    const availablePositions = gridPositions.filter(pos => !pos.occupied);
    const randomPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    randomPosition.occupied = true;

    return {
      id: `piece-${i}`,
      imageUrl: imageSource,
      currentPosition: {
        x: randomPosition.x,
        y: randomPosition.y
      },
      correctPosition: {
        x: (i % gridSize) * pieceSize,
        y: Math.floor(i / gridSize) * pieceSize
      },
      correctIndex: i,
      gridIndex: randomPosition.index
    };
  });

  return pieces;
}; 