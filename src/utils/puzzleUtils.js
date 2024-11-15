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
  },
  compilation: {
    easy: [
      require('../../assets/images/compilation/compilation_4/compilation_001.jpg'),
      require('../../assets/images/compilation/compilation_4/compilation_002.jpg'),
      require('../../assets/images/compilation/compilation_4/compilation_003.jpg'),
      require('../../assets/images/compilation/compilation_4/compilation_004.jpg'),
    ],
    medium: [
      require('../../assets/images/compilation/compilation_9/compilation_001.jpg'),
      require('../../assets/images/compilation/compilation_9/compilation_002.jpg'),
      require('../../assets/images/compilation/compilation_9/compilation_003.jpg'),
      require('../../assets/images/compilation/compilation_9/compilation_004.jpg'),
      require('../../assets/images/compilation/compilation_9/compilation_005.jpg'),
      require('../../assets/images/compilation/compilation_9/compilation_006.jpg'),
      require('../../assets/images/compilation/compilation_9/compilation_007.jpg'),
      require('../../assets/images/compilation/compilation_9/compilation_008.jpg'),
      require('../../assets/images/compilation/compilation_9/compilation_009.jpg'),
    ]
  },
  giraffe: {
    easy: [
      require('../../assets/images/giraffe/giraffe_4/giraffe_001.jpg'),
      require('../../assets/images/giraffe/giraffe_4/giraffe_002.jpg'),
      require('../../assets/images/giraffe/giraffe_4/giraffe_003.jpg'),
      require('../../assets/images/giraffe/giraffe_4/giraffe_004.jpg'),
    ],
    medium: [
      require('../../assets/images/giraffe/giraffe_9/giraffe_001.jpg'),
      require('../../assets/images/giraffe/giraffe_9/giraffe_002.jpg'),
      require('../../assets/images/giraffe/giraffe_9/giraffe_003.jpg'),
      require('../../assets/images/giraffe/giraffe_9/giraffe_004.jpg'),
      require('../../assets/images/giraffe/giraffe_9/giraffe_005.jpg'),
      require('../../assets/images/giraffe/giraffe_9/giraffe_006.jpg'),
      require('../../assets/images/giraffe/giraffe_9/giraffe_007.jpg'),
      require('../../assets/images/giraffe/giraffe_9/giraffe_008.jpg'),
      require('../../assets/images/giraffe/giraffe_9/giraffe_009.jpg'),
    ]
  },
  puppy: {
    easy: [
      require('../../assets/images/puppy/puppy_4/puppy_001.jpg'),
      require('../../assets/images/puppy/puppy_4/puppy_002.jpg'),
      require('../../assets/images/puppy/puppy_4/puppy_003.jpg'),
      require('../../assets/images/puppy/puppy_4/puppy_004.jpg'),
    ],
    medium: [
      require('../../assets/images/puppy/puppy_9/puppy_001.jpg'),
      require('../../assets/images/puppy/puppy_9/puppy_002.jpg'),
      require('../../assets/images/puppy/puppy_9/puppy_003.jpg'),
      require('../../assets/images/puppy/puppy_9/puppy_004.jpg'),
      require('../../assets/images/puppy/puppy_9/puppy_005.jpg'),
      require('../../assets/images/puppy/puppy_9/puppy_006.jpg'),
      require('../../assets/images/puppy/puppy_9/puppy_007.jpg'),
      require('../../assets/images/puppy/puppy_9/puppy_008.jpg'),
      require('../../assets/images/puppy/puppy_9/puppy_009.jpg'),
    ]
  },
  pig: {
    easy: [
      require('../../assets/images/pig/pig_4/pig_001.jpg'),
      require('../../assets/images/pig/pig_4/pig_002.jpg'),
      require('../../assets/images/pig/pig_4/pig_003.jpg'),
      require('../../assets/images/pig/pig_4/pig_004.jpg'),
    ],
    medium: [
      require('../../assets/images/pig/pig_9/pig_001.jpg'),
      require('../../assets/images/pig/pig_9/pig_002.jpg'),
      require('../../assets/images/pig/pig_9/pig_003.jpg'),
      require('../../assets/images/pig/pig_9/pig_004.jpg'),
      require('../../assets/images/pig/pig_9/pig_005.jpg'),
      require('../../assets/images/pig/pig_9/pig_006.jpg'),
      require('../../assets/images/pig/pig_9/pig_007.jpg'),
      require('../../assets/images/pig/pig_9/pig_008.jpg'),
      require('../../assets/images/pig/pig_9/pig_009.jpg'),
    ]
  },
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