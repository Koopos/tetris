import { Board } from '../core/Board';
import { Tetromino, Position } from './blocks';
import { PowerUpType } from './blocks';

/**
 * 游戏棋盘
 */
export interface GameBoard {
  width: number;
  height: number;
  grid: Cell[][];
}

// 导入 Cell 类型
import { Cell } from './blocks';

/**
 * 活跃道具效果
 */
export interface ActivePowerUp {
  type: PowerUpType;
  endTime: number;
  effect: PowerUpEffect;
}

/**
 * 道具效果
 */
export interface PowerUpEffect {
  type: 'freeze' | 'clear_area' | 'fill_gaps' | 'clear_line' | 'slow_time';
  duration?: number;
  affectedRows?: number[];
  affectedArea?: Position[];
}

/**
 * 游戏状态
 */
export interface GameState {
  // 棋盘状态
  board: GameBoard;

  // 方块状态
  currentPiece: Tetromino;
  nextPieces: Tetromino[]; // 预览队列（最多 3 个）
  holdPiece: Tetromino | null;
  canHold: boolean;

  // 游戏进度
  score: number;
  level: number;
  lines: number;
  combo: number;
  maxCombo: number;

  // 道具状态
  activePowerUps: ActivePowerUp[];
  availablePowerUps: PowerUpType[];

  // 游戏状态
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  isFrozen: boolean; // 时间冻结效果

  // 统计数据
  piecesPlaced: number;
  totalLinesCleared: number;
  powerUpsUsed: number;

  // 时间戳
  gameStartTime: number;
  lastDropTime: number;
}

/**
 * 游戏配置
 */
export interface GameConfig {
  boardWidth: number;
  boardHeight: number;
  initialLevel: number;
  dropInterval: number; // 毫秒
  lockDelay: number; // 毫秒
}

/**
 * 默认游戏配置
 */
export const DEFAULT_GAME_CONFIG: GameConfig = {
  boardWidth: 10,
  boardHeight: 20,
  initialLevel: 1,
  dropInterval: 1000,
  lockDelay: 500,
};
