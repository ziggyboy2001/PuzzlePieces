import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PuzzleBoard from './src/components/PuzzleBoard';
import { createPuzzlePieces } from './src/utils/puzzleUtils';

const CATEGORIES = ['bear', 'giraffe', 'puppy', 'pig', 'compilation', 'cherub', 'penguin', 'mermaid'];
const BG_COLOR = ['#bd24d1', '#8338ec', '#d12438', '#d1b724', '#24d1bd', '#2438d1', '#6cf542'];

export default function App() {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentLevel, setCurrentLevel] = useState('easy');
  const [bgColor, setBgColor] = useState(BG_COLOR[currentCategoryIndex]);
  const [currentPuzzle, setCurrentPuzzle] = useState({
    id: '1',
    name: 'Bear Puzzle',
    difficulty: 'easy',
    pieces: createPuzzlePieces(CATEGORIES[0], 'easy'),
    completed: false,
  });

  const handleNextPuzzle = () => {
    const nextCategoryIndex = (currentCategoryIndex + 1) % CATEGORIES.length;
    const nextCategory = CATEGORIES[nextCategoryIndex];
    
    if (nextCategoryIndex === 0 && currentLevel === 'easy') {
      setCurrentLevel('medium');
      setCurrentCategoryIndex(0);
      setBgColor(BG_COLOR[0]);
      setCurrentPuzzle({
        id: '1',
        name: `${CATEGORIES[0].charAt(0).toUpperCase() + CATEGORIES[0].slice(1)} Puzzle - Level 2`,
        difficulty: 'medium',
        pieces: createPuzzlePieces(CATEGORIES[0], 'medium'),
        completed: false,
      });
    } else if (nextCategoryIndex === 0 && currentLevel === 'medium') {
      setCurrentLevel('easy');
      setCurrentCategoryIndex(0);
      setBgColor(BG_COLOR[0]);
      setCurrentPuzzle({
        id: '1',
        name: `${CATEGORIES[0].charAt(0).toUpperCase() + CATEGORIES[0].slice(1)} Puzzle`,
        difficulty: 'easy',
        pieces: createPuzzlePieces(CATEGORIES[0], 'easy'),
        completed: false,
      });
    } else {
      setCurrentCategoryIndex(nextCategoryIndex);
      setBgColor(BG_COLOR[nextCategoryIndex]);
      setCurrentPuzzle({
        id: String(nextCategoryIndex + 1),
        name: `${nextCategory.charAt(0).toUpperCase() + nextCategory.slice(1)} Puzzle${currentLevel === 'medium' ? ' - Level 2' : ''}`,
        difficulty: currentLevel,
        pieces: createPuzzlePieces(nextCategory, currentLevel),
        completed: false,
      });
    }
  };

  const handleColorChange = (newColor) => {
    setBgColor(newColor);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
        <PuzzleBoard
          pieces={currentPuzzle.pieces}
          difficulty={currentPuzzle.difficulty}
          onNextPuzzle={handleNextPuzzle}
          level={currentLevel}
          currentCategoryIndex={currentCategoryIndex}
          bgColors={BG_COLOR}
          currentBgColor={bgColor}
          onColorChange={handleColorChange}
          currentCategory={CATEGORIES[currentCategoryIndex]}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
