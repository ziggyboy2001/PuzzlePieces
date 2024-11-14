import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PuzzleBoard from './src/components/PuzzleBoard';
import { createPuzzlePieces } from './src/utils/puzzleUtils';

const category = 'bear';

export default function App() {
  const [currentPuzzle, setCurrentPuzzle] = useState({
    id: '1',
    name: 'Bear Puzzle',
    difficulty: 'easy',
    pieces: createPuzzlePieces(category, 'easy'),
    completed: false,
    points: 100,
  });

  const handlePieceConnect = (piece1, piece2) => {
    // Handle piece connection logic
    // Update points and check for puzzle completion
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <PuzzleBoard
          pieces={currentPuzzle.pieces}
          difficulty={currentPuzzle.difficulty}
          onPieceConnect={handlePieceConnect}
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
