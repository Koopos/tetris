import { BlockType, Tetromino } from '../types/blocks';
import { Board } from './Board';
import { CollisionDetection } from './CollisionDetection';
import { getTetrominoShape } from '../utils/blockDefinitions';

/**
 * SRS（Super Rotation System）墙踢数据
 * 每个方块在不同旋转状态下的墙踢偏移量
 */
interface KickData {
  0: [number, number][]; // 0->1
  1: [number, number][]; // 1->2
  2: [number, number][]; // 2->3
  3: [number, number][]; // 3->0
}

/**
 * SRS 墙踢表（基于标准 Tetris Guideline）
 */
const SRS_KICK_TABLE: Record<BlockType, KickData> = {
  I: {
    0: [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
    1: [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
    2: [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
    3: [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
  },
  O: {
    0: [[0, 0]],
    1: [[0, 0]],
    2: [[0, 0]],
    3: [[0, 0]],
  },
  T: {
    0: [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    1: [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    2: [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
    3: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  },
  S: {
    0: [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    1: [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    2: [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
    3: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  },
  Z: {
    0: [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    1: [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    2: [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
    3: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  },
  J: {
    0: [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    1: [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    2: [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
    3: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  },
  L: {
    0: [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
    1: [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
    2: [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
    3: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
  },
};

/**
 * SRS 旋转系统类
 */
export class RotationSystem {
  /**
   * 旋转方块（使用 SRS 系统）
   * @param piece 要旋转的方块
   * @param direction 旋转方向 (1: 顺时针, -1: 逆时针)
   * @param board 游戏棋盘
   * @returns 旋转后的方块
   */
  static rotate(
    piece: Tetromino,
    direction: 1 | -1,
    board: Board
  ): Tetromino {
    // 计算新的旋转状态
    const newRotation = ((piece.rotation + direction + 4) % 4) as 0 | 1 | 2 | 3;

    // 获取新形状
    const newShape = getTetrominoShape(piece.type, newRotation);

    // 创建测试方块
    let testPiece = {
      ...piece,
      rotation: newRotation,
      shape: newShape,
    };

    // 如果是 O 方块，不需要墙踢
    if (piece.type === 'O') {
      return testPiece;
    }

    // 获取墙踢测试偏移量
    const kickTests = this.getKickTests(piece.type, piece.rotation, newRotation);

    // 尝试墙踢
    for (const [dCol, dRow] of kickTests) {
      const kickedPiece = {
        ...testPiece,
        position: {
          row: piece.position.row + dRow,
          col: piece.position.col + dCol,
        },
      };

      // 检查墙踢后的位置是否碰撞
      if (!CollisionDetection.checkCollision(kickedPiece, board)) {
        return kickedPiece;
      }
    }

    // 所有墙踢都失败，返回原方块
    return piece;
  }

  /**
   * 获取墙踢测试偏移量
   * @param type 方块类型
   * @param fromRotation 当前旋转状态
   * @param toRotation 目标旋转状态
   * @returns 墙踢偏移量数组
   */
  private static getKickTests(
    type: BlockType,
    fromRotation: number,
    toRotation: number
  ): [number, number][] {
    const kickData = SRS_KICK_TABLE[type];
    const kickTests = kickData[fromRotation as keyof KickData];

    // SRS 墙踢表格式转换：[col, row] -> [dCol, dRow]
    return kickTests.map(([col, row]) => [col, row] as [number, number]);
  }

  /**
   * 180度旋转（T-spin 专用）
   * @param piece 要旋转的方块
   * @param board 游戏棋盘
   * @returns 旋转后的方块
   */
  static rotate180(piece: Tetromino, board: Board): Tetromino {
    // 两次90度旋转
    const rotatedOnce = this.rotate(piece, 1, board);
    const rotatedTwice = this.rotate(rotatedOnce, 1, board);

    return rotatedTwice;
  }

  /**
   * 检查是否为 T-spin（简化版）
   * @param piece 当前方块
   * @param board 游戏棋盘
   * @param lastMove 最后一次移动方向
   * @returns 是否为 T-spin
   */
  static isTSpin(
    piece: Tetromino,
    board: Board,
    lastMove: 'rotate' | 'move'
  ): boolean {
    // 只检查 T 方块
    if (piece.type !== 'T') {
      return false;
    }

    // 必须是旋转操作
    if (lastMove !== 'rotate') {
      return false;
    }

    // 检查 T 方块的四个角是否有障碍物
    const { row, col } = piece.position;
    const corners = [
      { r: row - 1, c: col - 1 }, // 左上
      { r: row - 1, c: col + 1 }, // 右上
      { r: row + 1, c: col - 1 }, // 左下
      { r: row + 1, c: col + 1 }, // 右下
    ];

    let filledCorners = 0;
    for (const corner of corners) {
      if (!board.isInBounds(corner.r, corner.c)) {
        filledCorners++;
      } else {
        const cell = board.getCell(corner.r, corner.c);
        if (cell && cell.locked) {
          filledCorners++;
        }
      }
    }

    // 至少3个角被填充才算 T-spin
    return filledCorners >= 3;
  }
}
