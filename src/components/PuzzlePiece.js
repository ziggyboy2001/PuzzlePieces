import React, { useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS
} from 'react-native-reanimated';

const PuzzlePiece = ({ piece, pieceSize, onPieceMove }) => {
  const translateX = useSharedValue(piece.currentPosition.x);
  const translateY = useSharedValue(piece.currentPosition.y);
  const zIndex = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(piece.currentPosition.x);
    translateY.value = withSpring(piece.currentPosition.y);
  }, [piece.currentPosition.x, piece.currentPosition.y]);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
      zIndex.value = 1;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
      translateY.value = context.startY + event.translationY;
    },
    onEnd: () => {
      const snapX = Math.round(translateX.value / pieceSize) * pieceSize;
      const snapY = Math.round(translateY.value / pieceSize) * pieceSize;
      
      runOnJS(onPieceMove)(piece.id, { x: snapX, y: snapY });
      zIndex.value = 0;
    }
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value }
    ],
    zIndex: zIndex.value,
    position: 'absolute',
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.piece, animatedStyle, { width: pieceSize, height: pieceSize }]}>
        <Image
          source={piece.imageUrl}
          style={styles.pieceImage}
          resizeMode="contain"
        />
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieceImage: {
    width: '100%',
    height: '100%',
  }
});

export default PuzzlePiece; 