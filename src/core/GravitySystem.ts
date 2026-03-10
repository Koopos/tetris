import { Tetromino } from '../types/blocks';
import { Board } from './Board';
import { CollisionDetection } from './CollisionDetection';
import { LineClearing } from './LineClearing';
import { LEVEL_CONFIG, SCORING } from '../utils/constants';
import { GameState } from '../types/game';

/**
 * 重力系统类
 */
export class GravitySystem {
  /**
   * 根据等级计算下落间隔（毫秒）
   * @param level 等级
   * @returns 下落间隔
   */
  static getDropInterval(level: number): number {
    if (level <= 0) return LEVEL_CONFIG.initialDropInterval;
    if (level >= 10) return LEVEL_CONFIG.minDropInterval;

    const decrease = (level - 1) * LEVEL_CONFIG.dropIntervalDecrease;
    return Math.max(
      LEVEL_CONFIG.initialDropInterval - decrease,
      LEVEL_CONFIG.minDropInterval
    );
  }

  /**
   * 计算当前等级
   * @param lines 消除行数
   * @returns 等级
   */
  static calculateLevel(lines: number): number {
    return Math.floor(lines / LEVEL_CONFIG.linesPerLevel) + 1;
  }

  /**
   * 自动下落（重力）
   * @param game 当前游戏状态
   * @returns 更新后的游戏状态
   */
  static autoDrop(game: GameState): GameState {
    const newPiece = {
      ...game.currentPiece,
      position: {
        ...game.currentPiece.position,
        row: game.currentPiece.position.row + 1,
      },
    };

    // 检查碰撞
    if (CollisionDetection.checkCollisionWithBoard(newPiece, game.board)) {
      // 锁定方块
      return this.lockPiece(game);
    }

    return {
      ...game,
      currentPiece: newPiece,
    };
  }

  /**
   * 软降：加速下落一格
   * @param game 当前游戏状态
   * @returns 更新后的游戏状态
   */
  static softDrop(game: GameState): GameState {
    const newPiece = {
      ...game.currentPiece,
      position: {
        ...game.currentPiece.position,
        row: game.currentPiece.position.row + 1,
      },
    };

    // 检查碰撞
    if (CollisionDetection.checkCollisionWithBoard(newPiece, game.board)) {
      // 锁定方块
      return this.lockPiece(game);
    }

    return {
      ...game,
      currentPiece: newPiece,
      score: game.score + SCORING.softDrop,
    };
  }

  /**
   * 硬降：直接落地
   * @param game 当前游戏状态
   * @returns 更新后的游戏状态
   */
  static hardDrop(game: GameState): GameState {
    const dropDistance = CollisionDetection.getHardDropDistanceWithBoard(
      game.currentPiece,
      game.board
    );

    const newPiece = {
      ...game.currentPiece,
      position: {
        ...game.currentPiece.position,
        row: game.currentPiece.position.row + dropDistance,
      },
    };

    // 计算硬降得分
    const dropScore = dropDistance * SCORING.hardDrop;

    // 锁定方块
    const updatedGame = {
      ...game,
      currentPiece: newPiece,
      score: game.score + dropScore,
    };

    return this.lockPiece(updatedGame);
  }

  /**
   * 锁定方块到棋盘
   * @param game 当前游戏状态
   * @returns 更新后的游戏状态
   */
  private static lockPiece(game: GameState): GameState {
    const board = new Board(game.board.width, game.board.height);
    board.grid = game.board.grid.map(row => row.map(cell => ({ ...cell })));

    // 将方块锁定到网格
    for (const cell of game.currentPiece.shape) {
      const row = game.currentPiece.position.row + cell.row;
      const col = game.currentPiece.position.col + cell.col;

      if (board.isInBounds(row, col)) {
        board.lockCell(
          row,
          col,
          game.currentPiece.type,
          game.currentPiece.color,
          game.currentPiece.powerUpType || null
        );
      }
    }

    // 检查消行
    const clearResult = LineClearing.clearLines(board);

    // 检查游戏结束
    const isGameOver = CollisionDetection.checkGameOver(board);

    // 更新游戏状态
    const newLines = game.lines + clearResult.linesCleared;
    const newLevel = this.calculateLevel(newLines);

    return {
      ...game,
      board: {
        ...game.board,
        grid: clearResult.newGrid || board.grid,
      },
      score: game.score + clearResult.score,
      lines: newLines,
      level: newLevel,
      combo: clearResult.combo,
      maxCombo: Math.max(game.maxCombo, clearResult.combo),
      isGameOver,
      piecesPlaced: game.piecesPlaced + 1,
      totalLinesCleared: game.totalLinesCleared + clearResult.linesCleared,
    };
  }

  /**
   * 生成新方块
   * @param game 当前游戏状态
   * @returns 更新后的游戏状态
   */
  static spawnNewPiece(game: GameState): GameState {
    // 从队列中取出下一个方块
    const nextPieces = [...game.nextPieces];
    const currentPiece = nextPieces.shift()!;

    // 确保队列中有足够的方块
    while (nextPieces.length < 3) {
      // 这里应该从 RandomGenerator 获取新方块
      // 暂时使用随机生成
      const types: import('../types/blocks').BlockType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const newPiece = this.createRandomPiece(randomType);
      nextPieces.push(newPiece);
    }

    // 检查是否游戏结束（新方块生成时即碰撞）
    const isGameOver = CollisionDetection.checkCollisionWithBoard(currentPiece, game.board);

    return {
      ...game,
      currentPiece,
      nextPieces,
      isGameOver,
      canHold: true,
    };
  }

  /**
   * 创建随机方块（辅助函数）
   */
  private static createRandomPiece(type: import('../types/blocks').BlockType): Tetromino {
    // 从 blockDefinitions 导入
    const { createTetromino } = require('../utils/blockDefinitions');

    return createTetromino(type, { row: 0, col: 4 }, 0);
  }

  /**
   * 暂存方块
   * @param game 当前游戏状态
   * @returns 更新后的游戏状态
   */
  static holdPiece(game: GameState): GameState {
    if (!game.canHold) {
      return game;
    }

    const currentType = game.currentPiece.type;

    // 如果没有暂存方块，将当前方块暂存
    if (!game.holdPiece) {
      const { createTetromino } = require('../utils/blockDefinitions');
      const heldPiece = createTetromino(currentType, { row: 0, col: 4 }, 0);
      heldPiece.hasPowerUp = false;
      heldPiece.powerUpType = undefined;

      return {
        ...game,
        holdPiece: heldPiece,
        currentPiece: game.nextPieces[0],
        nextPieces: game.nextPieces.slice(1),
        canHold: false,
      };
    }

    // 交换当前方块和暂存方块
    const { createTetromino } = require('../utils/blockDefinitions');
    const newHoldPiece = createTetromino(currentType, { row: 0, col: 4 }, 0);
    newHoldPiece.hasPowerUp = false;
    newHoldPiece.powerUpType = undefined;

    const currentPiece = createTetromino(
      game.holdPiece.type,
      { row: 0, col: 4 },
      0
    );
    currentPiece.hasPowerUp = false;
    currentPiece.powerUpType = undefined;

    return {
      ...game,
      holdPiece: newHoldPiece,
      currentPiece,
      canHold: false,
    };
  }
}
