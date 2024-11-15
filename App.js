import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PuzzleBoard from './src/components/PuzzleBoard';
import { createPuzzlePieces } from './src/utils/puzzleUtils';

// Define the puzzle progression
const CATEGORIES = ['bear', 'giraffe', 'puppy', 'pig', 'compilation'];

export default function App() {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState({
    id: '1',
    name: 'Bear Puzzle',
    difficulty: 'easy',
    pieces: createPuzzlePieces(CATEGORIES[0], 'easy'),
    completed: false,
  });

  const handleNextPuzzle = () => {
    // Move to next category
    const nextCategoryIndex = (currentCategoryIndex + 1) % CATEGORIES.length;
    const nextCategory = CATEGORIES[nextCategoryIndex];
    
    console.log('Moving to next puzzle:', {
      fromCategory: CATEGORIES[currentCategoryIndex],
      toCategory: nextCategory,
      nextIndex: nextCategoryIndex
    });
    
    setCurrentCategoryIndex(nextCategoryIndex);
    setCurrentPuzzle(prevPuzzle => {
      const newPuzzle = {
        id: String(nextCategoryIndex + 1),
        name: `${nextCategory.charAt(0).toUpperCase() + nextCategory.slice(1)} Puzzle`,
        difficulty: 'easy',
        pieces: createPuzzlePieces(nextCategory, 'easy'),
        completed: false,
      };
      console.log('Created new puzzle:', {
        category: nextCategory,
        pieceCount: newPuzzle.pieces.length
      });
      return newPuzzle;
    });
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <PuzzleBoard
          pieces={currentPuzzle.pieces}
          difficulty={currentPuzzle.difficulty}
          onNextPuzzle={handleNextPuzzle}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
