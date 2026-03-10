import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeId } from '../../types/themes';
import { STORAGE_KEYS } from '../../utils/constants';

/**
 * UI 状态 Store 接口
 */
interface UIStore {
  // 主题
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;

  // 音效
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;

  // 震动
  vibrationEnabled: boolean;
  setVibrationEnabled: (enabled: boolean) => void;

  // 设置
  showGhostPiece: boolean;
  setShowGhostPiece: (show: boolean) => void;

  showNextPiece: boolean;
  setShowNextPiece: (show: boolean) => void;

  showHoldPiece: boolean;
  setShowHoldPiece: (show: boolean) => void;

  showCombo: boolean;
  setShowCombo: (show: boolean) => void;

  // 难度
  startLevel: number;
  setStartLevel: (level: number) => void;

  // 重置设置
  resetSettings: () => void;
}

/**
 * 默认设置
 */
const defaultSettings = {
  theme: 'neon' as ThemeId,
  soundEnabled: true,
  vibrationEnabled: true,
  showGhostPiece: true,
  showNextPiece: true,
  showHoldPiece: true,
  showCombo: true,
  startLevel: 1,
};

/**
 * 创建 UI 状态 Store
 */
export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      // 默认设置
      ...defaultSettings,

      /**
       * 设置主题
       */
      setTheme: (theme) => {
        set({ theme });
      },

      /**
       * 设置音效开关
       */
      setSoundEnabled: (enabled) => {
        set({ soundEnabled: enabled });
      },

      /**
       * 设置震动开关
       */
      setVibrationEnabled: (enabled) => {
        set({ vibrationEnabled: enabled });
      },

      /**
       * 设置幽灵方块显示
       */
      setShowGhostPiece: (show) => {
        set({ showGhostPiece: show });
      },

      /**
       * 设置下一个方块显示
       */
      setShowNextPiece: (show) => {
        set({ showNextPiece: show });
      },

      /**
       * 设置暂存方块显示
       */
      setShowHoldPiece: (show) => {
        set({ showHoldPiece: show });
      },

      /**
       * 设置连击显示
       */
      setShowCombo: (show) => {
        set({ showCombo: show });
      },

      /**
       * 设置起始等级
       */
      setStartLevel: (level) => {
        set({ startLevel: Math.max(1, Math.min(10, level)) });
      },

      /**
       * 重置设置
       */
      resetSettings: () => {
        set(defaultSettings);
      },
    }),
    {
      name: STORAGE_KEYS.UI_STATE,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
