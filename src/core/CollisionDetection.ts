import { Tetromino } from '../types/blocks';
import { Board } from './Board';
import { GameBoard } from '../types/game';

/**
 * 碰撞检测类
 */
export class CollisionDetection {
  /**
   * 检查坐标是否在棋盘内
   */
  private static isInBounds(row: number, col: number, board: GameBoard): boolean {
    return row >= 0 && row < board.height && col >= 0 && col < board.width;
  }

  /**
   * 获取指定位置的格子
   */
  private static getCell(row: number, col: number, board: GameBoard) {
    if (!this.isInBounds(row, col, board)) {
      return null;
    }
    return board.grid[row]?.[col];
  }

  /**
   * 检查方块是否与棋盘碰撞（使用 GameBoard 接口）
   * @param piece 要检查的方块
   * @param board 游戏棋盘数据
   * @returns 是否碰撞
   */
  static checkCollisionWithBoard(piece: Tetromino, board: GameBoard): boolean {
    for (const cell of piece.shape) {
      const absoluteRow = piece.position.row + cell.row;
      const absoluteCol = piece.position.col + cell.col;

      // 边界检查
      if (!this.isInBounds(absoluteRow, absoluteCol, board)) {
        return true;
      }

      // 方块碰撞检查（只检查已锁定的格子）
      const boardCell = this.getCell(absoluteRow, absoluteCol, board);
      if (boardCell && boardCell.locked) {
        return true;
      }
    }

    return false;
  }

  /**
   * 检查方块是否与棋盘碰撞
   * @param piece 要检查的方块
   * @param board 游戏棋盘
   * @returns 是否碰撞
   */
  static checkCollision(piece: Tetromino, board: Board): boolean {
    for (const cell of piece.shape) {
      const absoluteRow = piece.position.row + cell.row;
      const absoluteCol = piece.position.col + cell.col;

      // 边界检查
      if (!board.isInBounds(absoluteRow, absoluteCol)) {
        return true;
      }

      // 方块碰撞检查（只检查已锁定的格子）
      const boardCell = board.getCell(absoluteRow, absoluteCol);
      if (boardCell && boardCell.locked) {
        return true;
      }
    }

    return false;
  }

  /**
   * 检查方块是否在地面（底部或其他方块上）
   * @param piece 要检查的方块
   * @param board 游戏棋盘
   * @returns 是否在地面
   */
  static isOnGround(piece: Tetromino, board: Board): boolean {
    // 检查方块下方一格是否碰撞
    const testPiece = {
      ...piece,
      position: {
        ...piece.position,
        row: piece.position.row + 1,
      },
    };

    return this.checkCollision(testPiece, board);
  }

  /**
   * 检查是否游戏结束（使用 GameBoard 接口）
   * @param board 游戏棋盘数据
   * @returns 是否游戏结束
   */
  static checkGameOverWithBoard(board: GameBoard): boolean {
    // 检查顶部两行是否有锁定方块
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < board.width; col++) {
        const cell = this.getCell(row, col, board);
        if (cell && cell.locked) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 检查是否游戏结束
   * @param board 游戏棋盘
   * @returns 是否游戏结束
   */
  static checkGameOver(board: Board): boolean {
    // 检查顶部两行是否有锁定方块
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < board.width; col++) {
        const cell = board.getCell(row, col);
        if (cell && cell.locked) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 检查方块是否可以移动到指定位置
   * @param piece 当前方块
   * @param board 游戏棋盘
   * @param dRow 行偏移
   * @param dCol 列偏移
   * @returns 是否可以移动
   */
  static canMove(
    piece: Tetromino,
    board: Board,
    dRow: number,
    dCol: number
  ): boolean {
    const testPiece = {
      ...piece,
      position: {
        row: piece.position.row + dRow,
        col: piece.position.col + dCol,
      },
    };

    return !this.checkCollision(testPiece, board);
  }

  /**
   * 获取方块可以硬降的最大距离（使用 GameBoard 接口）
   * @param piece 当前方块
   * @param board 游戏棋盘数据
   * @returns 可以下落的格数
   */
  static getHardDropDistanceWithBoard(piece: Tetromino, board: GameBoard): number {
    let distance = 0;
    let testPiece = { ...piece };

    while (true) {
      testPiece = {
        ...testPiece,
        position: {
          ...testPiece.position,
          row: testPiece.position.row + 1,
        },
      };

      if (this.checkCollisionWithBoard(testPiece, board)) {
        break;
      }

      distance++;
    }

    return distance;
  }

  /**
   * 获取方块可以硬降的最大距离
   * @param piece 当前方块
   * @param board 游戏棋盘
   * @returns 可以下落的格数
   */
  static getHardDropDistance(piece: Tetromino, board: Board): number {
    let distance = 0;
    let testPiece = { ...piece };

    while (true) {
      testPiece = {
        ...testPiece,
        position: {
          ...testPiece.position,
          row: testPiece.position.row + 1,
        },
      };

      if (this.checkCollision(testPiece, board)) {
        break;
      }

      distance++;
    }

    return distance;
  }

  /**
   * 获取方块的幽灵位置（落地预览）
   * @param piece 当前方块
   * @param board 游戏棋盘
   * @returns 幽灵方块的行位置
   */
  static getGhostPosition(piece: Tetromino, board: Board): number {
    const dropDistance = this.getHardDropDistance(piece, board);
    return piece.position.row + dropDistance;
  }

  /**
   * 检查指定区域是否有锁定方块
   * @param board 游戏棋盘
   * @param centerRow 中心行
   * @param centerCol 中心列
   * @param radius 半径
   * @returns 是否有锁定方块
   */
  static hasLockedCellsInArea(
    board: Board,
    centerRow: number,
    centerCol: number,
    radius: number
  ): boolean {
    for (let dRow = -radius; dRow <= radius; dRow++) {
      for (let dCol = -radius; dCol <= radius; dCol++) {
        const row = centerRow + dRow;
        const col = centerCol + dCol;

        const cell = board.getCell(row, col);
        if (cell && cell.locked) {
          return true;
        }
      }
    }
    return false;
  }
}
