import { StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * AsyncStorage 适配器
 * 用于 Zustand 的持久化中间件
 */
const asyncStorageAdapter: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await AsyncStorage.getItem(name);
      return value;
    } catch (error) {
      console.error(`Error reading ${name} from AsyncStorage:`, error);
      return null;
    }
  },

  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch (error) {
      console.error(`Error writing ${name} to AsyncStorage:`, error);
    }
  },

  removeItem: async (name: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (error) {
      console.error(`Error removing ${name} from AsyncStorage:`, error);
    }
  },
};

/**
 * 持久化配置
 */
export const persistConfig = {
  name: 'tetris-plus-storage',
  storage: asyncStorageAdapter,

  // 部分持久化（只持久化指定的字段）
  partialize: (state: any) => ({
    // UI 设置
    theme: state.theme,
    soundEnabled: state.soundEnabled,
    vibrationEnabled: state.vibrationEnabled,

    // 游戏统计
    totalGamesPlayed: state.totalGamesPlayed,
    highScore: state.highScore,
    totalLinesCleared: state.totalLinesCleared,
    totalPiecesPlaced: state.totalPiecesPlaced,

    // 成就进度
    achievements: state.achievements,

    // 设置
    settings: state.settings,
  }),

  // 版本管理（用于数据迁移）
  version: 1,
};
