import { Cell } from '../types/blocks';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../utils/constants';

/**
 * 游戏棋盘类
 */
export class Board {
  public readonly width: number;
  public readonly height: number;
  public grid: Cell[][];

  constructor(width: number = BOARD_WIDTH, height: number = BOARD_HEIGHT) {
    this.width = width;
    this.height = height;
    this.grid = this.createEmptyGrid();
  }

  /**
   * 创建空棋盘
   */
  private createEmptyGrid(): Cell[][] {
    const grid: Cell[][] = [];
    for (let row = 0; row < this.height; row++) {
      grid[row] = [];
      for (let col = 0; col < this.width; col++) {
        grid[row][col] = {
          occupied: false,
          type: null,
          powerUp: null,
          color: '',
          locked: false,
        };
      }
    }
    return grid;
  }

  /**
   * 检查坐标是否在棋盘内
   */
  isInBounds(row: number, col: number): boolean {
    return row >= 0 && row < this.height && col >= 0 && col < this.width;
  }

  /**
   * 获取指定位置的格子
   */
  getCell(row: number, col: number): Cell | null {
    if (!this.isInBounds(row, col)) {
      return null;
    }
    return this.grid[row][col];
  }

  /**
   * 设置指定位置的格子
   */
  setCell(row: number, col: number, cell: Cell): boolean {
    if (!this.isInBounds(row, col)) {
      return false;
    }
    this.grid[row][col] = { ...cell };
    return true;
  }

  /**
   * 锁定格子（标记为已占用）
   */
  lockCell(row: number, col: number, type: Cell['type'], color: string, powerUp: Cell['powerUp'] = null): boolean {
    if (!this.isInBounds(row, col)) {
      return false;
    }
    this.grid[row][col] = {
      occupied: true,
      type,
      powerUp,
      color,
      locked: true,
    };
    return true;
  }

  /**
   * 解除格子占用
   */
  unlockCell(row: number, col: number): boolean {
    if (!this.isInBounds(row, col)) {
      return false;
    }
    this.grid[row][col] = {
      occupied: false,
      type: null,
      powerUp: null,
      color: '',
      locked: false,
    };
    return true;
  }

  /**
   * 清除指定行
   */
  clearRow(row: number): Cell[] {
    if (row < 0 || row >= this.height) {
      return [];
    }
    const clearedRow = [...this.grid[row]];
    this.grid.splice(row, 1);
    // 在顶部添加新空行
    this.grid.unshift(
      Array(this.width).fill(null).map(() => ({
        occupied: false,
        type: null,
        powerUp: null,
        color: '',
        locked: false,
      }))
    );
    return clearedRow;
  }

  /**
   * 清除多行
   */
  clearRows(rows: number[]): Cell[][] {
    // 从下往上清除，避免索引混乱
    const sortedRows = [...rows].sort((a, b) => b - a);
    const clearedCells: Cell[][] = [];

    for (const row of sortedRows) {
      clearedCells.push(this.clearRow(row));
    }

    return clearedCells;
  }

  /**
   * 检查行是否已满
   */
  isRowFull(row: number): boolean {
    if (row < 0 || row >= this.height) {
      return false;
    }
    return this.grid[row].every(cell => cell.occupied);
  }

  /**
   * 获取所有满行
   */
  getFullRows(): number[] {
    const fullRows: number[] = [];
    for (let row = 0; row < this.height; row++) {
      if (this.isRowFull(row)) {
        fullRows.push(row);
      }
    }
    return fullRows;
  }

  /**
   * 清除 3x3 区域（炸弹道具）
   */
  clearArea(centerRow: number, centerCol: number): Cell[] {
    const clearedCells: Cell[] = [];
    const radius = 1; // 3x3 区域半径为 1

    for (let dRow = -radius; dRow <= radius; dRow++) {
      for (let dCol = -radius; dCol <= radius; dCol++) {
        const row = centerRow + dRow;
        const col = centerCol + dCol;

        if (this.isInBounds(row, col) && this.grid[row][col].occupied) {
          clearedCells.push({ ...this.grid[row][col] });
          this.unlockCell(row, col);
        }
      }
    }

    return clearedCells;
  }

  /**
   * 克隆棋盘
   */
  clone(): Board {
    const newBoard = new Board(this.width, this.height);
    newBoard.grid = this.grid.map(row =>
      row.map(cell => ({ ...cell }))
    );
    return newBoard;
  }

  /**
   * 重置棋盘
   */
  reset(): void {
    this.grid = this.createEmptyGrid();
  }

  /**
   * 获取棋盘统计信息
   */
  getStats() {
    let occupiedCells = 0;
    let powerUpCells = 0;

    for (let row = 0; row < this.height; row++) {
      for (let col = 0; col < this.width; col++) {
        if (this.grid[row][col].occupied) {
          occupiedCells++;
          if (this.grid[row][col].powerUp) {
            powerUpCells++;
          }
        }
      }
    }

    return {
      totalCells: this.width * this.height,
      occupiedCells,
      emptyCells: this.width * this.height - occupiedCells,
      powerUpCells,
      fillPercentage: (occupiedCells / (this.width * this.height)) * 100,
    };
  }
}

/**
 * 创建空棋盘的辅助函数
 */
export function createEmptyBoard(width: number = BOARD_WIDTH, height: number = BOARD_HEIGHT): Board {
  return new Board(width, height);
}
