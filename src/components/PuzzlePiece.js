import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';

const PuzzlePiece = ({ piece, pieceSize, onPieceMove, pieces }) => {
  const translateX = useSharedValue(piece?.currentPosition?.x || 0);
  const translateY = useSharedValue(piece?.currentPosition?.y || 0);
  const zIndex = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
      context.startY = translateY.value;
      zIndex.value = 1;
    },
    onActive: (event, context) => {
      if (event && context) {
        translateX.value = context.startX + event.translationX;
        translateY.value = context.startY + event.translationY;
      }
    },
    onEnd: () => {
      try {
        const snapX = Math.round(translateX.value / pieceSize) * pieceSize;
        const snapY = Math.round(translateY.value / pieceSize) * pieceSize;

        const isOccupied = Array.isArray(pieces) && pieces.some(
          p => p?.id !== piece?.id && 
          p?.currentPosition?.x === snapX && 
          p?.currentPosition?.y === snapY
        );

        if (!isOccupied) {
          translateX.value = withSpring(snapX);
          translateY.value = withSpring(snapY);
          onPieceMove?.(piece?.id, { x: snapX, y: snapY });
        } else {
          translateX.value = withSpring(piece?.currentPosition?.x || 0);
          translateY.value = withSpring(piece?.currentPosition?.y || 0);
        }
        
        zIndex.value = 0;
      } catch (error) {
        console.warn('Error in gesture handler:', error);
      }
    },
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