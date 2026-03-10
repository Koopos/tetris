import { GameState, DEFAULT_GAME_CONFIG } from '../types/game';
import { Tetromino } from '../types/blocks';
import { Board } from './Board';
import { CollisionDetection } from './CollisionDetection';
import { RotationSystem } from './RotationSystem';
import { GravitySystem } from './GravitySystem';
import { createTetromino, RandomGenerator } from '../utils/blockDefinitions';
import { PowerUpSystem } from './PowerUpSystem';

/**
 * 游戏引擎类
 * 整合所有核心游戏逻辑
 */
export class GameEngine {
  private state: GameState;
  private randomGenerator: RandomGenerator;
  private gameLoopInterval?: NodeJS.Timeout;
  private lastTime: number = 0;

  constructor() {
    this.randomGenerator = new RandomGenerator();
    this.state = this.createInitialState();
  }

  /**
   * 创建初始游戏状态
   */
  private createInitialState(): GameState {
    const board = new Board();
    const firstPiece = this.createNextPiece();
    const nextPieces = this.randomGenerator.peekNext(3).map(type =>
      this.createPieceByType(type)
    );

    return {
      board: {
        width: board.width,
        height: board.height,
        grid: board.grid,
      },
      currentPiece: firstPiece,
      nextPieces,
      holdPiece: null,
      canHold: true,
      score: 0,
      level: 1,
      lines: 0,
      combo: 0,
      maxCombo: 0,
      activePowerUps: [],
      availablePowerUps: [],
      isPlaying: false,
      isPaused: false,
      isGameOver: false,
      isFrozen: false,
      piecesPlaced: 0,
      totalLinesCleared: 0,
      powerUpsUsed: 0,
      gameStartTime: 0,
      lastDropTime: 0,
    };
  }

  /**
   * 创建下一个方块
   */
  private createNextPiece(): Tetromino {
    const type = this.randomGenerator.getNext();
    return this.createPieceByType(type);
  }

  /**
   * 根据类型创建方块
   */
  private createPieceByType(type: import('../types/blocks').BlockType): Tetromino {
    return createTetromino(type, { row: 0, col: 4 }, 0);
  }

  /**
   * 启动游戏
   */
  start(): void {
    this.state = this.createInitialState();
    this.state.isPlaying = true;
    this.state.gameStartTime = Date.now();
    this.state.lastDropTime = Date.now();
    this.startGameLoop();
  }

  /**
   * 暂停游戏
   */
  pause(): void {
    this.state.isPaused = true;
    this.stopGameLoop();
  }

  /**
   * 恢复游戏
   */
  resume(): void {
    this.state.isPaused = false;
    this.state.lastDropTime = Date.now();
    this.startGameLoop();
  }

  /**
   * 重新开始游戏
   */
  restart(): void {
    this.stopGameLoop();
    this.start();
  }

  /**
   * 游戏循环
   */
  private startGameLoop(): void {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
    }

    const update = () => {
      const now = Date.now();
      const dropInterval = GravitySystem.getDropInterval(this.state.level);

      // 检查道具过期
      this.state = this.updateExpiredPowerUps();

      // 如果没有冻结效果，执行自动下落
      if (!this.state.isFrozen && now - this.state.lastDropTime >= dropInterval) {
        this.state = GravitySystem.autoDrop(this.state);
        this.state.lastDropTime = now;

        // 检查是否需要生成新方块
        if (CollisionDetection.isOnGround(this.state.currentPiece, this.getBoard())) {
          this.state = GravitySystem.spawnNewPiece(this.state);
          this.checkPowerUpSpawn();
        }
      }
    };

    this.gameLoopInterval = setInterval(update, 16); // ~60 FPS
  }

  /**
   * 停止游戏循环
   */
  private stopGameLoop(): void {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = undefined;
    }
  }

  /**
   * 移动方块
   */
  moveLeft(): void {
    if (!this.state.isPlaying || this.state.isPaused || this.state.isGameOver) {
      return;
    }

    if (CollisionDetection.canMove(this.state.currentPiece, this.getBoard(), 0, -1)) {
      this.state.currentPiece = {
        ...this.state.currentPiece,
        position: {
          ...this.state.currentPiece.position,
          col: this.state.currentPiece.position.col - 1,
        },
      };
    }
  }

  /**
   * 移动方块
   */
  moveRight(): void {
    if (!this.state.isPlaying || this.state.isPaused || this.state.isGameOver) {
      return;
    }

    if (CollisionDetection.canMove(this.state.currentPiece, this.getBoard(), 0, 1)) {
      this.state.currentPiece = {
        ...this.state.currentPiece,
        position: {
          ...this.state.currentPiece.position,
          col: this.state.currentPiece.position.col + 1,
        },
      };
    }
  }

  /**
   * 旋转方块
   */
  rotate(direction: 1 | -1 = 1): void {
    if (!this.state.isPlaying || this.state.isPaused || this.state.isGameOver) {
      return;
    }

    this.state.currentPiece = RotationSystem.rotate(
      this.state.currentPiece,
      direction,
      this.getBoard()
    );
  }

  /**
   * 软降
   */
  softDrop(): void {
    if (!this.state.isPlaying || this.state.isPaused || this.state.isGameOver) {
      return;
    }

    this.state = GravitySystem.softDrop(this.state);
  }

  /**
   * 硬降
   */
  hardDrop(): void {
    if (!this.state.isPlaying || this.state.isPaused || this.state.isGameOver) {
      return;
    }

    this.state = GravitySystem.hardDrop(this.state);
    this.state = GravitySystem.spawnNewPiece(this.state);
    this.checkPowerUpSpawn();
  }

  /**
   * 暂存方块
   */
  hold(): void {
    if (!this.state.isPlaying || this.state.isPaused || this.state.isGameOver) {
      return;
    }

    this.state = GravitySystem.holdPiece(this.state);
  }

  /**
   * 使用道具
   */
  usePowerUp(powerUpType: import('../types/blocks').PowerUpType): void {
    if (!this.state.isPlaying || this.state.isPaused || this.state.isGameOver) {
      return;
    }

    if (!this.state.availablePowerUps.includes(powerUpType)) {
      return;
    }

    this.state = PowerUpSystem.applyPowerUp(powerUpType, this.state);
    this.state.powerUpsUsed++;
  }

  /**
   * 检查是否生成道具
   */
  private checkPowerUpSpawn(): void {
    if (this.state.combo >= 3) {
      const powerUp = PowerUpSystem.generatePowerUp(this.state.combo);
      if (powerUp && !this.state.availablePowerUps.includes(powerUp)) {
        this.state.availablePowerUps.push(powerUp);
      }
    }
  }

  /**
   * 更新过期道具
   */
  private updateExpiredPowerUps(): GameState {
    const now = Date.now();
    const activePowerUps = this.state.activePowerUps.filter(p => p.endTime > now);
    const isFrozen = activePowerUps.some(p => p.type === 'freeze');

    return {
      ...this.state,
      activePowerUps,
      isFrozen,
    };
  }

  /**
   * 获取棋盘对象
   */
  private getBoard(): Board {
    const board = new Board(this.state.board.width, this.state.board.height);
    board.grid = this.state.board.grid;
    return board;
  }

  /**
   * 获取当前游戏状态
   */
  getState(): Readonly<GameState> {
    return { ...this.state };
  }

  /**
   * 导出游戏状态（用于保存）
   */
  exportState(): string {
    return JSON.stringify(this.state);
  }

  /**
   * 导入游戏状态（用于恢复）
   */
  importState(stateJson: string): void {
    try {
      const importedState = JSON.parse(stateJson) as GameState;
      this.state = { ...importedState };

      if (this.state.isPlaying && !this.state.isPaused) {
        this.startGameLoop();
      }
    } catch (error) {
      console.error('Failed to import game state:', error);
    }
  }

  /**
   * 销毁游戏引擎
   */
  destroy(): void {
    this.stopGameLoop();
  }
}
