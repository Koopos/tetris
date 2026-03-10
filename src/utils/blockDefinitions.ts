import { BlockType, Position, BlockColors } from '../types/blocks';

/**
 * 方块形状定义（基于 SRS 系统）
 * 每个方块的形状定义为相对坐标数组
 */
export const TETROMINO_SHAPES: Record<BlockType, Position[][]> = {
  I: [
    [{ row: 0, col: -1 }, { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }], // 水平
    [{ row: -1, col: 0 }, { row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }], // 垂直
    [{ row: 0, col: -1 }, { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }], // 水平（与 0 相同）
    [{ row: -1, col: 0 }, { row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }], // 垂直（与 1 相同）
  ],
  O: [
    [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 }],
    [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 }],
    [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 }],
    [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 }],
  ],
  T: [
    [{ row: 0, col: -1 }, { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }], // T 上
    [{ row: -1, col: 0 }, { row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: 1 }], // T 右
    [{ row: -1, col: 0 }, { row: 0, col: -1 }, { row: 0, col: 0 }, { row: 0, col: 1 }], // T 下
    [{ row: -1, col: 0 }, { row: 0, col: 0 }, { row: 1, col: 0 }, { row: 0, col: -1 }], // T 左
  ],
  S: [
    [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: -1 }, { row: 1, col: 0 }], // S 水平
    [{ row: -1, col: 0 }, { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 1 }], // S 垂直
    [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: -1 }, { row: 1, col: 0 }], // S 水平（重复）
    [{ row: -1, col: 0 }, { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 1 }], // S 垂直（重复）
  ],
  Z: [
    [{ row: 0, col: -1 }, { row: 0, col: 0 }, { row: 1, col: 0 }, { row: 1, col: 1 }], // Z 水平
    [{ row: -1, col: 1 }, { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }], // Z 垂直
    [{ row: 0, col: -1 }, { row: 0, col: 0 }, { row: 1, col: 0 }, { row: 1, col: 1 }], // Z 水平（重复）
    [{ row: -1, col: 1 }, { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 0 }], // Z 垂直（重复）
  ],
  J: [
    [{ row: -1, col: -1 }, { row: 0, col: -1 }, { row: 0, col: 0 }, { row: 0, col: 1 }], // J 左
    [{ row: -1, col: 0 }, { row: -1, col: 1 }, { row: 0, col: 0 }, { row: 1, col: 0 }], // J 下
    [{ row: 0, col: -1 }, { row: 0, col: 0 }, { row: 1, col: 0 }, { row: 1, col: 1 }], // J 右
    [{ row: -1, col: 0 }, { row: 0, col: 0 }, { row: 1, col: -1 }, { row: 1, col: 0 }], // J 上
  ],
  L: [
    [{ row: -1, col: 1 }, { row: 0, col: -1 }, { row: 0, col: 0 }, { row: 0, col: 1 }], // L 右
    [{ row: -1, col: 0 }, { row: 0, col: 0 }, { row: 1, col: 0 }, { row: 1, col: 1 }], // L 下
    [{ row: 0, col: -1 }, { row: 0, col: 0 }, { row: 1, col: -1 }, { row: 1, col: 0 }], // L 左
    [{ row: -1, col: -1 }, { row: -1, col: 0 }, { row: 0, col: 0 }, { row: 1, col: 0 }], // L 上
  ],
};

/**
 * 方块颜色方案（霓虹主题）
 */
export const NEON_BLOCK_COLORS: BlockColors = {
  I: '#00F5FF', // 青色
  O: '#FFDD00', // 黄色
  T: '#FF00FF', // 品红
  S: '#00FF00', // 绿色
  Z: '#FF0000', // 红色
  J: '#0066FF', // 蓝色
  L: '#FF9900', // 橙色
};

/**
 * 获取方块形状
 */
export function getTetrominoShape(type: BlockType, rotation: 0 | 1 | 2 | 3): Position[] {
  return TETROMINO_SHAPES[type][rotation];
}

/**
 * 获取方块颜色
 */
export function getTetrominoColor(type: BlockType, colorScheme: BlockColors = NEON_BLOCK_COLORS): string {
  return colorScheme[type];
}

/**
 * 创建俄罗斯方块
 */
export function createTetromino(
  type: BlockType,
  position: { row: number; col: number },
  rotation: 0 | 1 | 2 | 3 = 0,
  hasPowerUp: boolean = false,
  powerUpType?: import('../types/blocks').PowerUpType
): import('../types/blocks').Tetromino {
  return {
    type,
    shape: getTetrominoShape(type, rotation),
    position: { ...position },
    rotation,
    color: getTetrominoColor(type),
    hasPowerUp,
    powerUpType,
  };
}

/**
 * 随机获取方块类型（7-bag 随机系统）
 */
export class RandomGenerator {
  private bag: BlockType[] = [];

  getNext(): BlockType {
    if (this.bag.length === 0) {
      this.bag = this.generateBag();
    }
    return this.bag.pop()!;
  }

  private generateBag(): BlockType[] {
    const types: BlockType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    // Fisher-Yates 洗牌算法
    for (let i = types.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [types[i], types[j]] = [types[j], types[i]];
    }
    return types;
  }

  // 预览接下来的几个方块
  peekNext(count: number): BlockType[] {
    while (this.bag.length < count) {
      this.bag = [...this.bag, ...this.generateBag()];
    }
    return this.bag.slice(-count);
  }
}
