import { PowerUpType } from '../types/blocks';
import { GameState } from '../types/game';
import { Board } from './Board';
import { POWERUP_CONFIG } from '../utils/constants';
import { POWER_UP_CONFIGS } from '../types/powerups';

/**
 * 道具系统类
 */
export class PowerUpSystem {
  /**
   * 根据连击数决定是否生成道具
   * @param combo 当前连击数
   * @returns 应该生成的道具类型（或不生成）
   */
  static generatePowerUp(combo: number): PowerUpType | null {
    // Tetris (4行): 100% 生成道具
    if (combo === 4) {
      return this.getRandomPowerUp();
    }

    // 连击 5+: 50% 概率生成道具
    if (combo >= 5 && Math.random() < POWERUP_CONFIG.spawnProbability5Combo) {
      return this.getRandomPowerUp();
    }

    // 连击 3+: 30% 概率生成道具
    if (combo >= 3 && Math.random() < POWERUP_CONFIG.spawnProbability3Combo) {
      return this.getRandomPowerUp();
    }

    return null;
  }

  /**
   * 随机获取道具（基于权重）
   */
  private static getRandomPowerUp(): PowerUpType {
    const types: PowerUpType[] = ['bomb', 'freeze', 'rainbow', 'lightning', 'time'];
    const weights = types.map(type => POWER_UP_CONFIGS[type].weight);

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < types.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return types[i];
      }
    }

    return 'bomb'; // 默认
  }

  /**
   * 应用道具效果
   * @param powerUp 道具类型
   * @param game 游戏状态
   * @returns 应用后的游戏状态
   */
  static applyPowerUp(powerUp: PowerUpType, game: GameState): GameState {
    const now = Date.now();

    switch (powerUp) {
      case 'freeze':
        // 时间冻结 5 秒
        return {
          ...game,
          isFrozen: true,
          activePowerUps: [
            ...game.activePowerUps,
            {
              type: 'freeze',
              endTime: now + (POWER_UP_CONFIGS.freeze.duration || 5000),
              effect: {
                type: 'freeze',
                duration: POWER_UP_CONFIGS.freeze.duration || 5000,
              },
            },
          ],
          availablePowerUps: game.availablePowerUps.filter(p => p !== powerUp),
        };

      case 'bomb':
        // 炸弹：清除当前方块周围 3x3 区域
        const bombBoard = new Board(game.board.width, game.board.height);
        bombBoard.grid = game.board.grid.map(row => row.map(cell => ({ ...cell })));

        const bombArea = bombBoard.clearArea(
          game.currentPiece.position.row,
          game.currentPiece.position.col
        );

        return {
          ...game,
          board: {
            ...game.board,
            grid: bombBoard.grid,
          },
          score: game.score + 200,
          availablePowerUps: game.availablePowerUps.filter(p => p !== powerUp),
        };

      case 'lightning':
        // 闪电：消除底部 3 行
        const lightningBoard = new Board(game.board.width, game.board.height);
        lightningBoard.grid = game.board.grid.map(row => row.map(cell => ({ ...cell })));

        const rowsToClear = [
          game.board.height - 1,
          game.board.height - 2,
          game.board.height - 3,
        ].filter(row => row >= 0);

        lightningBoard.clearRows(rowsToClear);

        return {
          ...game,
          board: {
            ...game.board,
            grid: lightningBoard.grid,
          },
          score: game.score + 150 * rowsToClear.length,
          lines: game.lines + rowsToClear.length,
          availablePowerUps: game.availablePowerUps.filter(p => p !== powerUp),
        };

      case 'rainbow':
        // 彩虹：填充当前方块下方的空缺
        const rainbowBoard = new Board(game.board.width, game.board.height);
        rainbowBoard.grid = game.board.grid.map(row => row.map(cell => ({ ...cell })));

        this.fillGapsBelowPiece(rainbowBoard, game.currentPiece);

        return {
          ...game,
          board: {
            ...game.board,
            grid: rainbowBoard.grid,
          },
          score: game.score + 100,
          availablePowerUps: game.availablePowerUps.filter(p => p !== powerUp),
        };

      case 'time':
        // 时间倒流：减缓下落速度 50%，持续 10 秒
        return {
          ...game,
          activePowerUps: [
            ...game.activePowerUps,
            {
              type: 'time',
              endTime: now + (POWER_UP_CONFIGS.time.duration || 10000),
              effect: {
                type: 'slow_time',
                duration: POWER_UP_CONFIGS.time.duration || 10000,
              },
            },
          ],
          availablePowerUps: game.availablePowerUps.filter(p => p !== powerUp),
        };

      default:
        return game;
    }
  }

  /**
   * 填充方块下方的空缺（彩虹道具）
   */
  private static fillGapsBelowPiece(board: Board, piece: import('../types/blocks').Tetromino): void {
    // 找到方块的最底行
    const pieceRows = piece.shape.map(cell => piece.position.row + cell.row);
    const maxPieceRow = Math.max(...pieceRows);

    // 从方块位置向下填充空缺
    for (let row = maxPieceRow + 1; row < board.height; row++) {
      for (let col = 0; col < board.width; col++) {
        const cell = board.getCell(row, col);
        // 只填充空格子，并且上方有格子支撑
        if (cell && !cell.occupied) {
          const aboveCell = board.getCell(row - 1, col);
          if (aboveCell && aboveCell.occupied) {
            board.lockCell(row, col, piece.type, piece.color, null);
          }
        }
      }
    }
  }

  /**
   * 检查并更新过期道具
   */
  static updateExpiredPowerUps(game: GameState): GameState {
    const now = Date.now();
    const activePowerUps = game.activePowerUps.filter(p => p.endTime > now);
    const isFrozen = activePowerUps.some(p => p.type === 'freeze');
    const isTimeSlowed = activePowerUps.some(p => p.type === 'time');

    return {
      ...game,
      activePowerUps,
      isFrozen,
      // 如果有时间减缓效果，可以在这里应用速度变化
      // 但实际速度变化在 GravitySystem 中处理
    };
  }

  /**
   * 为方块添加道具效果
   */
  static addPowerUpToPiece(
    piece: import('../types/blocks').Tetromino,
    powerUpType: PowerUpType
  ): import('../types/blocks').Tetromino {
    return {
      ...piece,
      hasPowerUp: true,
      powerUpType,
      color: POWER_UP_CONFIGS[powerUpType].color,
    };
  }

  /**
   * 获取道具配置
   */
  static getPowerUpConfig(type: PowerUpType) {
    return POWER_UP_CONFIGS[type];
  }

  /**
   * 获取所有道具配置
   */
  static getAllPowerUpConfigs() {
    return POWER_UP_CONFIGS;
  }
}
