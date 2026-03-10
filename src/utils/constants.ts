/**
 * 游戏常量定义
 */

/**
 * 棋盘尺寸
 */
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

/**
 * 方块尺寸（用于渲染）
 */
export const CELL_SIZE = 30;

/**
 * 游戏难度配置
 */
export const LEVEL_CONFIG = {
  // 每级减少的下落间隔（毫秒）
  dropIntervalDecrease: 100,
  // 最小下落间隔（毫秒）
  minDropInterval: 100,
  // 初始下落间隔（毫秒）
  initialDropInterval: 1000,
  // 升级所需消除行数
  linesPerLevel: 10,
} as const;

/**
 * 计分系统（基于官方 Tetris 计分）
 */
export const SCORING = {
  // 软降：每格 1 分
  softDrop: 1,
  // 硬降：每格 2 分
  hardDrop: 2,
  // 消除行数得分
  lineClear: {
    1: 100,
    2: 300,
    3: 500,
    4: 800, // Tetris!
  },
  // 连击倍数
  comboMultiplier: {
    2: 1.2, // 2 行
    3: 1.3, // 3 行
    4: 1.5, // Tetris
  },
} as const;

/**
 * 道具系统配置
 */
export const POWERUP_CONFIG = {
  // 生成道具的最小连击数
  minComboForSpawn: 3,
  // 连击 3+ 的道具生成概率
  spawnProbability3Combo: 0.3,
  // 连击 5+ 的道具生成概率
  spawnProbability5Combo: 0.5,
  // Tetris 的道具生成概率
  spawnProbabilityTetris: 1.0,
} as const;

/**
 * 旋转系统配置（SRS）
 */
export const SRS_CONFIG = {
  // 墙踢测试偏移量数量
  maxKickTests: 5,
} as const;

/**
 * 动画配置
 */
export const ANIMATION_CONFIG = {
  // 方块移动动画时长（毫秒）
  blockMoveDuration: 150,
  // 消行动画时长（毫秒）
  lineClearDuration: 300,
  // 粒子动画时长（毫秒）
  particleDuration: 500,
  // 屏幕震动时长（毫秒）
  screenShakeDuration: 200,
  // 屏幕震动强度
  screenShakeIntensity: 10,
} as const;

/**
 * 存储键名
 */
export const STORAGE_KEYS = {
  GAME_STATE: 'tetris_plus_game_state',
  UI_STATE: 'tetris_plus_ui_state',
  ACHIEVEMENTS: 'tetris_plus_achievements',
  CHALLENGES: 'tetris_plus_challenges',
  STATS: 'tetris_plus_stats',
  SETTINGS: 'tetris_plus_settings',
} as const;
