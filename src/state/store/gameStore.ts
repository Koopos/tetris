import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, GameBoard, ActivePowerUp } from '../../types/game';
import { PowerUpType, Tetromino } from '../../types/blocks';
import { GameEngine } from '../../core/GameEngine';
import { STORAGE_KEYS } from '../../utils/constants';

/**
 * 游戏状态 Store 接口
 */
interface GameStore {
  // 游戏状态
  board?: GameBoard;
  currentPiece?: Tetromino;
  nextPieces?: Tetromino[];
  holdPiece?: Tetromino | null;
  canHold?: boolean;
  score?: number;
  level?: number;
  lines?: number;
  combo?: number;
  maxCombo?: number;
  activePowerUps?: ActivePowerUp[];
  availablePowerUps?: PowerUpType[];
  isPlaying?: boolean;
  isPaused?: boolean;
  isGameOver?: boolean;
  isFrozen?: boolean;
  piecesPlaced?: number;
  powerUpsUsed?: number;
  gameStartTime?: number;
  lastDropTime?: number;

  // 游戏引擎
  engine: GameEngine | null;

  // 操作方法
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  rotate: (direction?: 1 | -1) => void;
  softDrop: () => void;
  hardDrop: () => void;
  holdCurrentPiece: () => void;
  usePowerUp: (powerUp: PowerUpType) => void;

  // 状态更新
  updateState: (newState: Partial<GameState>) => void;

  // 游戏统计（持久化）
  totalGamesPlayed: number;
  highScore: number;
  totalLinesCleared: number;
  totalPiecesPlaced: number;

  // 更新统计
  updateStats: (lines: number, score: number, pieces: number) => void;

  // 重置
  reset: () => void;
}

/**
 * 初始状态
 */
const initialState: Partial<GameState> = {
  board: {
    width: 10,
    height: 20,
    grid: [],
  },
  currentPiece: null as any,
  nextPieces: [],
  holdPiece: null,
  canHold: true,
  score: 0,
  level: 1,
  lines: 0,
  combo: 0,
  maxCombo: 0,
  activePowerUps: [],
  availablePowerUps: [],
  isPlaying: false,
  isPaused: false,
  isGameOver: false,
  isFrozen: false,
  piecesPlaced: 0,
  totalLinesCleared: 0,
  powerUpsUsed: 0,
  gameStartTime: 0,
  lastDropTime: 0,
};

/**
 * 创建游戏状态 Store
 */
export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      ...initialState,

      // 游戏引擎
      engine: null,

      // 统计数据
      totalGamesPlayed: 0,
      highScore: 0,
      totalLinesCleared: 0,
      totalPiecesPlaced: 0,

      /**
       * 启动游戏
       */
      startGame: () => {
        const engine = new GameEngine();
        engine.start();

        set({
          engine,
          ...engine.getState(),
          totalGamesPlayed: get().totalGamesPlayed + 1,
        });
      },

      /**
       * 暂停游戏
       */
      pauseGame: () => {
        const { engine } = get();
        if (engine) {
          engine.pause();
          set({
            isPaused: true,
          });
        }
      },

      /**
       * 恢复游戏
       */
      resumeGame: () => {
        const { engine } = get();
        if (engine) {
          engine.resume();
          set({
            isPaused: false,
          });
        }
      },

      /**
       * 重新开始游戏
       */
      restartGame: () => {
        const { engine } = get();
        if (engine) {
          engine.restart();
          set({
            ...engine.getState(),
          });
        }
      },

      /**
       * 移动方块
       */
      moveLeft: () => {
        const { engine } = get();
        if (engine) {
          engine.moveLeft();
          set({
            ...engine.getState(),
          });
        }
      },

      /**
       * 移动方块
       */
      moveRight: () => {
        const { engine } = get();
        if (engine) {
          engine.moveRight();
          set({
            ...engine.getState(),
          });
        }
      },

      /**
       * 旋转方块
       */
      rotate: (direction) => {
        const { engine } = get();
        if (engine) {
          engine.rotate(direction);
          set({
            ...engine.getState(),
          });
        }
      },

      /**
       * 软降
       */
      softDrop: () => {
        const { engine } = get();
        if (engine) {
          engine.softDrop();
          set({
            ...engine.getState(),
          });
        }
      },

      /**
       * 硬降
       */
      hardDrop: () => {
        const { engine } = get();
        if (engine) {
          engine.hardDrop();
          const newState = engine.getState();

          // 更新统计
          if (newState.score > get().highScore) {
            set({ highScore: newState.score });
          }

          set({
            ...newState,
          });
        }
      },

      /**
       * 暂存方块
       */
      holdCurrentPiece: () => {
        const { engine } = get();
        if (engine) {
          engine.hold();
          set({
            ...engine.getState(),
          });
        }
      },

      /**
       * 使用道具
       */
      usePowerUp: (powerUp) => {
        const { engine } = get();
        if (engine) {
          engine.usePowerUp(powerUp);
          set({
            ...engine.getState(),
          });
        }
      },

      /**
       * 更新状态
       */
      updateState: (newState) => {
        set(newState);
      },

      /**
       * 更新统计
       */
      updateStats: (lines, score, pieces) => {
        set({
          totalLinesCleared: get().totalLinesCleared + lines,
          totalPiecesPlaced: get().totalPiecesPlaced + pieces,
          highScore: Math.max(get().highScore, score),
        });
      },

      /**
       * 重置
       */
      reset: () => {
        const { engine } = get();
        if (engine) {
          engine.destroy();
        }

        set({
          ...initialState,
          engine: null,
        });
      },
    }),
    {
      name: STORAGE_KEYS.GAME_STATE,
      storage: createJSONStorage(() => AsyncStorage),
      // 只持久化统计数据，不持久化实时游戏状态
      partialize: (state) => ({
        totalGamesPlayed: state.totalGamesPlayed,
        highScore: state.highScore,
        totalLinesCleared: state.totalLinesCleared,
        totalPiecesPlaced: state.totalPiecesPlaced,
      }),
    }
  )
);
