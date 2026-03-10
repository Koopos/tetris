import { BlockColors } from './blocks';

/**
 * 主题 ID
 */
export type ThemeId = 'neon' | 'retro' | 'minimal' | 'nature' | 'cyberpunk';

/**
 * 主题颜色接口
 */
export interface ThemeColors {
  // 背景颜色
  background: string;
  surface: string;
  board: string;
  grid: string;
  text: string;
  textSecondary: string;

  // 方块颜色
  blocks: BlockColors;

  // 特殊方块颜色
  powerUps: {
    bomb: string;
    freeze: string;
    rainbow: string;
    lightning: string;
    time: string;
  };

  // UI 颜色
  ui: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    button: string;
  };
}

/**
 * 主题配置
 */
export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  colors: ThemeColors;
  isLocked: boolean;
  unlockCondition?: string;
}

/**
 * 霓虹主题（默认）
 */
export const NEON_THEME: Theme = {
  id: 'neon',
  name: '霓虹夜城',
  description: '炫酷的霓虹灯光效果',
  colors: {
    background: '#0a0e27',
    surface: '#1a1f3a',
    board: '#1a1f3a',
    grid: 'rgba(255, 255, 255, 0.1)',
    text: '#ffffff',
    textSecondary: '#aaaaaa',
    blocks: {
      I: '#00F5FF', // 青色
      O: '#FFDD00', // 黄色
      T: '#FF00FF', // 品红
      S: '#00FF00', // 绿色
      Z: '#FF0000', // 红色
      J: '#0066FF', // 蓝色
      L: '#FF9900', // 橙色
    },
    powerUps: {
      bomb: '#FF4444',
      freeze: '#44AAFF',
      rainbow: '#FF00FF',
      lightning: '#FFFF00',
      time: '#00FF00',
    },
    ui: {
      primary: '#00F5FF',
      secondary: '#FF00FF',
      accent: '#FFDD00',
      success: '#00FF00',
      warning: '#FF9900',
      error: '#FF0000',
      button: '#4CAF50',
    },
  },
  isLocked: false,
};

/**
 * 复古主题
 */
export const RETRO_THEME: Theme = {
  id: 'retro',
  name: '像素复古',
  description: '经典 GameBoy 风格',
  colors: {
    background: '#9bbc0f',
    surface: '#8bac0f',
    board: '#8bac0f',
    grid: '#306230',
    text: '#0f380f',
    textSecondary: '#306230',
    blocks: {
      I: '#0f380f',
      O: '#306230',
      T: '#0f380f',
      S: '#306230',
      Z: '#0f380f',
      J: '#306230',
      L: '#0f380f',
    },
    powerUps: {
      bomb: '#0f380f',
      freeze: '#306230',
      rainbow: '#0f380f',
      lightning: '#306230',
      time: '#0f380f',
    },
    ui: {
      primary: '#0f380f',
      secondary: '#306230',
      accent: '#9bbc0f',
      success: '#306230',
      warning: '#0f380f',
      error: '#0f380f',
      button: '#306230',
    },
  },
  isLocked: false,
};

/**
 * 极简主题
 */
export const MINIMAL_THEME: Theme = {
  id: 'minimal',
  name: '极简黑白',
  description: '纯净的黑白设计',
  colors: {
    background: '#ffffff',
    surface: '#f0f0f0',
    board: '#f0f0f0',
    grid: '#e0e0e0',
    text: '#000000',
    textSecondary: '#666666',
    blocks: {
      I: '#000000',
      O: '#333333',
      T: '#000000',
      S: '#333333',
      Z: '#000000',
      J: '#333333',
      L: '#000000',
    },
    powerUps: {
      bomb: '#000000',
      freeze: '#333333',
      rainbow: '#000000',
      lightning: '#333333',
      time: '#000000',
    },
    ui: {
      primary: '#000000',
      secondary: '#333333',
      accent: '#666666',
      success: '#000000',
      warning: '#333333',
      error: '#000000',
      button: '#000000',
    },
  },
  isLocked: false,
};

/**
 * 自然主题
 */
export const NATURE_THEME: Theme = {
  id: 'nature',
  name: '自然森林',
  description: '清新的自然风格',
  colors: {
    background: '#1a3a1a',
    surface: '#2d5a2d',
    board: '#2d5a2d',
    grid: 'rgba(255, 255, 255, 0.1)',
    text: '#90EE90',
    textSecondary: '#66CD66',
    blocks: {
      I: '#87CEEB', // 天空蓝
      O: '#FFD700', // 金色
      T: '#9370DB', // 紫色
      S: '#32CD32', // 酸橙绿
      Z: '#DC143C', // 猩红
      J: '#4169E1', // 皇家蓝
      L: '#FF8C00', // 深橙
    },
    powerUps: {
      bomb: '#DC143C',
      freeze: '#87CEEB',
      rainbow: '#9370DB',
      lightning: '#FFD700',
      time: '#32CD32',
    },
    ui: {
      primary: '#90EE90',
      secondary: '#32CD32',
      accent: '#FFD700',
      success: '#32CD32',
      warning: '#FF8C00',
      error: '#DC143C',
      button: '#32CD32',
    },
  },
  isLocked: true,
  unlockCondition: '累计消除 1000 行解锁',
};

/**
 * 赛博朋克主题
 */
export const CYBERPUNK_THEME: Theme = {
  id: 'cyberpunk',
  name: '赛博朋克',
  description: '未来科技风格',
  colors: {
    background: '#0d0221',
    surface: '#1a0a2e',
    board: '#1a0a2e',
    grid: 'rgba(255, 0, 255, 0.2)',
    text: '#ff00ff',
    textSecondary: '#00ffff',
    blocks: {
      I: '#00ffff', // 青色
      O: '#ff00ff', // 品红
      T: '#ffff00', // 黄色
      S: '#00ff00', // 绿色
      Z: '#ff0066', // 粉红
      J: '#0066ff', // 蓝色
      L: '#ff6600', // 橙色
    },
    powerUps: {
      bomb: '#ff0066',
      freeze: '#00ffff',
      rainbow: '#ff00ff',
      lightning: '#ffff00',
      time: '#00ff00',
    },
    ui: {
      primary: '#ff00ff',
      secondary: '#00ffff',
      accent: '#ffff00',
      success: '#00ff00',
      warning: '#ff6600',
      error: '#ff0066',
      button: '#ff00ff',
    },
  },
  isLocked: true,
  unlockCondition: '累计获得 50000 分解锁',
};

/**
 * 所有主题
 */
export const THEMES: Record<ThemeId, Theme> = {
  neon: NEON_THEME,
  retro: RETRO_THEME,
  minimal: MINIMAL_THEME,
  nature: NATURE_THEME,
  cyberpunk: CYBERPUNK_THEME,
};

/**
 * 获取主题
 */
export function getTheme(themeId: ThemeId): Theme {
  return THEMES[themeId] || NEON_THEME;
}

/**
 * 获取所有未锁定的主题
 */
export function getUnlockedThemes(): Theme[] {
  return Object.values(THEMES).filter(theme => !theme.isLocked);
}
