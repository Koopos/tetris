import { Board } from './Board';
import { Cell } from '../types/blocks';
import { SCORING } from '../utils/constants';

/**
 * 消行结果
 */
export interface LineClearResult {
  linesCleared: number;
  score: number;
  combo: number;
  clearedRows: number[];
  specialEffects: SpecialEffect[];
  newGrid?: Cell[][];
}

/**
 * 特殊效果
 */
export interface SpecialEffect {
  type: 'clear_area' | 'clear_line' | 'fill_gaps';
  area?: { row: number; col: number }[];
  rows?: number[];
  bonusScore: number;
}

/**
 * 消行系统类
 */
export class LineClearing {
  /**
   * 检测并清除完整的行
   * @param board 游戏棋盘
   * @returns 消除结果
   */
  static clearLines(board: Board): LineClearResult {
    const linesToClear = board.getFullRows();

    if (linesToClear.length === 0) {
      return {
        linesCleared: 0,
        score: 0,
        combo: 0,
        clearedRows: [],
        specialEffects: [],
      };
    }

    // 处理特殊方块效果
    const specialEffects = this.processSpecialPowerUps(board, linesToClear);

    // 执行消行
    const clearedCells = board.clearRows(linesToClear);

    // 计算得分
    const baseScore = this.calculateScore(linesToClear.length);
    const comboMultiplier = this.calculateComboMultiplier(linesToClear.length);
    const specialBonusScore = specialEffects.reduce((sum, effect) => sum + effect.bonusScore, 0);
    const totalScore = Math.floor(baseScore * comboMultiplier) + specialBonusScore;

    return {
      linesCleared: linesToClear.length,
      score: totalScore,
      combo: linesToClear.length,
      clearedRows: linesToClear,
      specialEffects,
      newGrid: board.grid,
    };
  }

  /**
   * 计算得分（基于官方 Tetris 计分系统）
   * @param lines 消除行数
   * @returns 基础得分
   */
  private static calculateScore(lines: number): number {
    const scoreTable = SCORING.lineClear;
    return scoreTable[lines as keyof typeof scoreTable] || 0;
  }

  /**
   * 计算连击倍数
   * @param lines 消除行数
   * @returns 连击倍数
   */
  private static calculateComboMultiplier(lines: number): number {
    const multipliers = SCORING.comboMultiplier;
    if (lines === 4) return 1.5; // Tetris 奖励
    if (lines === 3) return multipliers[3];
    if (lines === 2) return multipliers[2];
    return 1;
  }

  /**
   * 处理特殊方块效果
   * @param board 游戏棋盘
   * @param linesToClear 要清除的行
   * @returns 特殊效果数组
   */
  private static processSpecialPowerUps(
    board: Board,
    linesToClear: number[]
  ): SpecialEffect[] {
    const effects: SpecialEffect[] = [];

    for (const row of linesToClear) {
      for (let col = 0; col < board.width; col++) {
        const cell = board.getCell(row, col);

        if (cell && cell.powerUp) {
          const effect = this.triggerPowerUp(cell.powerUp, board, row, col);
          if (effect) {
            effects.push(effect);
          }
        }
      }
    }

    return effects;
  }

  /**
   * 触发道具效果
   * @param powerUp 道具类型
   * @param board 游戏棋盘
   * @param row 行位置
   * @param col 列位置
   * @returns 特殊效果或 null
   */
  private static triggerPowerUp(
    powerUp: Cell['powerUp'],
    board: Board,
    row: number,
    col: number
  ): SpecialEffect | null {
    switch (powerUp) {
      case 'bomb':
        // 炸弹：清除周围 3x3 区域
        const bombArea = this.getSurroundingArea(row, col, board, 1);
        board.clearArea(row, col);
        return {
          type: 'clear_area',
          area: bombArea,
          bonusScore: 200,
        };

      case 'lightning':
        // 闪电：额外消除相邻行
        const adjacentRows = [row - 1, row + 1].filter(
          r => r >= 0 && r < board.height && board.isRowFull(r)
        );
        board.clearRows(adjacentRows);
        return {
          type: 'clear_line',
          rows: adjacentRows,
          bonusScore: 150,
        };

      case 'rainbow':
        // 彩虹：填补空缺（在消行逻辑中已处理，这里只加分）
        return {
          type: 'fill_gaps',
          bonusScore: 100,
        };

      default:
        return null;
    }
  }

  /**
   * 获取周围区域的坐标
   * @param centerRow 中心行
   * @param centerCol 中心列
   * @param board 游戏棋盘
   * @param radius 半径
   * @returns 坐标数组
   */
  private static getSurroundingArea(
    centerRow: number,
    centerCol: number,
    board: Board,
    radius: number
  ): { row: number; col: number }[] {
    const area: { row: number; col: number }[] = [];

    for (let dRow = -radius; dRow <= radius; dRow++) {
      for (let dCol = -radius; dCol <= radius; dCol++) {
        const row = centerRow + dRow;
        const col = centerCol + dCol;

        if (board.isInBounds(row, col)) {
          area.push({ row, col });
        }
      }
    }

    return area;
  }

  /**
   * 检查是否有任何一行可以被清除
   * @param board 游戏棋盘
   * @returns 是否有可清除的行
   */
  static hasClearableLines(board: Board): boolean {
    return board.getFullRows().length > 0;
  }

  /**
   * 获取消除统计信息
   * @param result 消除结果
   * @returns 格式化的统计信息
   */
  static getClearStats(result: LineClearResult): {
    type: string;
    message: string;
    bonus: number;
  } {
    const { linesCleared, score } = result;

    let type = '';
    let message = '';
    let bonus = 0;

    switch (linesCleared) {
      case 0:
        type = 'none';
        message = '';
        bonus = 0;
        break;
      case 1:
        type = 'single';
        message = 'Single!';
        bonus = 0;
        break;
      case 2:
        type = 'double';
        message = 'Double!';
        bonus = Math.floor(score * 0.2);
        break;
      case 3:
        type = 'triple';
        message = 'Triple!';
        bonus = Math.floor(score * 0.3);
        break;
      case 4:
        type = 'tetris';
        message = 'TETRIS!';
        bonus = Math.floor(score * 0.5);
        break;
      default:
        type = 'amazing';
        message = 'AMAZING!';
        bonus = Math.floor(score * 0.7);
    }

    return { type, message, bonus };
  }
}
