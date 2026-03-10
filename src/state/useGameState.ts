import { useGameStore } from './store/gameStore';
import { useUIStore } from './store/uiStore';
import { useCallback, useEffect } from 'react';
import { PowerUpType } from '../types/blocks';

/**
 * 游戏状态 Hook
 * 整合游戏状态和 UI 状态
 */
export function useGameState() {
  const gameStore = useGameStore();
  const uiStore = useUIStore();

  /**
   * 启动游戏
   */
  const startGame = useCallback(() => {
    gameStore.startGame();
  }, [gameStore]);

  /**
   * 暂停游戏
   */
  const pauseGame = useCallback(() => {
    gameStore.pauseGame();
  }, [gameStore]);

  /**
   * 恢复游戏
   */
  const resumeGame = useCallback(() => {
    gameStore.resumeGame();
  }, [gameStore]);

  /**
   * 重新开始游戏
   */
  const restartGame = useCallback(() => {
    gameStore.restartGame();
  }, [gameStore]);

  /**
   * 移动方块
   */
  const moveLeft = useCallback(() => {
    gameStore.moveLeft();
  }, [gameStore]);

  const moveRight = useCallback(() => {
    gameStore.moveRight();
  }, [gameStore]);

  /**
   * 旋转方块
   */
  const rotate = useCallback(
    (direction?: 1 | -1) => {
      gameStore.rotate(direction);
    },
    [gameStore]
  );

  /**
   * 软降
   */
  const softDrop = useCallback(() => {
    gameStore.softDrop();
  }, [gameStore]);

  /**
   * 硬降
   */
  const hardDrop = useCallback(() => {
    gameStore.hardDrop();
  }, [gameStore]);

  /**
   * 暂存方块
   */
  const holdPiece = useCallback(() => {
    gameStore.holdCurrentPiece();
  }, [gameStore]);

  /**
   * 使用道具
   */
  const usePowerUp = useCallback(
    (powerUp: PowerUpType) => {
      gameStore.usePowerUp(powerUp);
    },
    [gameStore]
  );

  /**
   * 组件卸载时清理
   */
  useEffect(() => {
    return () => {
      if (gameStore.engine) {
        gameStore.engine.destroy();
      }
    };
  }, [gameStore.engine]);

  return {
    // 游戏状态
    gameState: {
      board: gameStore.board,
      currentPiece: gameStore.currentPiece,
      nextPieces: gameStore.nextPieces,
      holdPiece: gameStore.holdPiece,
      canHold: gameStore.canHold,
      score: gameStore.score,
      level: gameStore.level,
      lines: gameStore.lines,
      combo: gameStore.combo,
      maxCombo: gameStore.maxCombo,
      activePowerUps: gameStore.activePowerUps,
      availablePowerUps: gameStore.availablePowerUps,
      isPlaying: gameStore.isPlaying,
      isPaused: gameStore.isPaused,
      isGameOver: gameStore.isGameOver,
      isFrozen: gameStore.isFrozen,
      piecesPlaced: gameStore.piecesPlaced,
      totalLinesCleared: gameStore.totalLinesCleared,
      powerUpsUsed: gameStore.powerUpsUsed,
      gameStartTime: gameStore.gameStartTime,
      lastDropTime: gameStore.lastDropTime,
    },

    // 游戏操作
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    moveLeft,
    moveRight,
    rotate,
    softDrop,
    hardDrop,
    holdPiece,
    usePowerUp,

    // 游戏统计
    stats: {
      totalGamesPlayed: gameStore.totalGamesPlayed,
      highScore: gameStore.highScore,
      totalLinesCleared: gameStore.totalLinesCleared,
      totalPiecesPlaced: gameStore.totalPiecesPlaced,
    },

    // UI 状态
    ui: {
      theme: uiStore.theme,
      soundEnabled: uiStore.soundEnabled,
      vibrationEnabled: uiStore.vibrationEnabled,
      showGhostPiece: uiStore.showGhostPiece,
      showNextPiece: uiStore.showNextPiece,
      showHoldPiece: uiStore.showHoldPiece,
      showCombo: uiStore.showCombo,
      startLevel: uiStore.startLevel,
    },

    // UI 操作
    setTheme: uiStore.setTheme,
    setSoundEnabled: uiStore.setSoundEnabled,
    setVibrationEnabled: uiStore.setVibrationEnabled,
    setShowGhostPiece: uiStore.setShowGhostPiece,
    setShowNextPiece: uiStore.setShowNextPiece,
    setShowHoldPiece: uiStore.setShowHoldPiece,
    setShowCombo: uiStore.setShowCombo,
    setStartLevel: uiStore.setStartLevel,
    resetSettings: uiStore.resetSettings,
  };
}
