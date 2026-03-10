/**
 * 方块类型定义
 * 标准 Tetris 方块：I, O, T, S, Z, J, L
 */
export type BlockType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

/**
 * 道具类型定义
 */
export type PowerUpType = 'bomb' | 'freeze' | 'rainbow' | 'lightning' | 'time';

/**
 * 位置坐标
 */
export interface Position {
  row: number;
  col: number;
}

/**
 * 单个格子单元
 */
export interface Cell {
  occupied: boolean;
  type: BlockType | null;
  powerUp: PowerUpType | null;
  color: string;
  locked: boolean; // 是否已锁定在棋盘
}

/**
 * 俄罗斯方块
 */
export interface Tetromino {
  type: BlockType;
  shape: Position[]; // 相对坐标数组
  position: Position; // 当前在棋盘上的位置
  rotation: 0 | 1 | 2 | 3; // 旋转状态（0°, 90°, 180°, 270°）
  color: string;
  hasPowerUp: boolean;
  powerUpType?: PowerUpType;
}

/**
 * 方块颜色配置
 */
export interface BlockColors {
  I: string;
  O: string;
  T: string;
  S: string;
  Z: string;
  J: string;
  L: string;
}
