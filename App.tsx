import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GameScreen } from './src/components/screens/GameScreen';
import { NEON_THEME } from './src/types/themes';

/**
 * Tetris+ 主应用
 */
export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <GameScreen theme={NEON_THEME} />
    </>
  );
}
