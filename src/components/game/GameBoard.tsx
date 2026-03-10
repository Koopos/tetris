import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { GameBoard as GameBoardType } from '../../types/game';
import { Tetromino } from '../../types/blocks';
import { GridCell } from '../blocks/TetrominoBlock';
import { TetrominoPiece } from '../blocks/TetrominoPiece';
import { Theme } from '../../types/themes';
import { CollisionDetection } from '../../core/CollisionDetection';

/**
 * 游戏棋盘组件属性
 */
export interface GameBoardProps {
  /**
   * 棋盘数据
   */
  board: GameBoardType;

  /**
   * 当前方块
   */
  currentPiece: Tetromino;

  /**
   * 是否显示幽灵方块
   */
  showGhost?: boolean;

  /**
   * 单个格子大小
   */
  cellSize?: number;

  /**
   * 主题
   */
  theme?: Theme;
}

/**
 * 游戏棋盘组件
 * 渲染游戏棋盘、锁定方块、当前方块和幽灵方块
 */
export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  currentPiece,
  showGhost = true,
  cellSize = 28,
  theme,
}) => {
  const { grid, width, height } = board;

  // 计算幽灵方块位置
  const getGhostPosition = (piece: Tetromino): number => {
    const dropDistance = CollisionDetection.getHardDropDistanceWithBoard(piece, board);
    return piece.position.row + dropDistance;
  };

  const ghostRow = showGhost ? getGhostPosition(currentPiece) : null;

  // 渲染棋盘背景网格
  const renderGrid = () => {
    const cells = [];

    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const cellKey = `cell-${row}-${col}`;
        cells.push(
          <View
            key={cellKey}
            style={[
              styles.gridCell,
              {
                width: cellSize,
                height: cellSize,
                left: col * cellSize,
                top: row * cellSize,
              },
            ]}
          >
            <GridCell cell={grid[row]?.[col] || null} size={cellSize} theme={theme} />
          </View>
        );
      }
    }

    return cells;
  };

  // 渲染幽灵方块
  const renderGhostPiece = () => {
    if (!showGhost || ghostRow === null) return null;

    const ghostPiece: Tetromino = {
      ...currentPiece,
      position: {
        ...currentPiece.position,
        row: ghostRow,
      },
    };

    return (
      <View style={styles.pieceLayer} pointerEvents="none">
        <TetrominoPiece
          piece={ghostPiece}
          blockSize={cellSize}
          isGhost={true}
          theme={theme}
        />
      </View>
    );
  };

  // 渲染当前方块
  const renderCurrentPiece = () => {
    return (
      <View style={styles.pieceLayer} pointerEvents="none">
        <TetrominoPiece
          piece={currentPiece}
          blockSize={cellSize}
          theme={theme}
        />
      </View>
    );
  };

  const boardWidth = width * cellSize;
  const boardHeight = height * cellSize;

  return (
    <View style={[styles.container, theme && { backgroundColor: theme.colors.background }]}>
      <View
        style={[
          styles.boardWrapper,
          {
            width: boardWidth,
            height: boardHeight,
          },
        ]}
      >
        {/* 棋盘背景网格 */}
        <View style={styles.gridLayer}>{renderGrid()}</View>

        {/* 幽灵方块层 */}
        {renderGhostPiece()}

        {/* 当前方块层 */}
        {renderCurrentPiece()}

        {/* 棋盘边框 */}
        <View style={[styles.border, { width: boardWidth + 4, height: boardHeight + 4 }]} />
      </View>
    </View>
  );
};

/**
 * 游戏信息面板组件
 */
export interface GameInfoPanelProps {
  score: number;
  level: number;
  lines: number;
  combo?: number;
  theme?: Theme;
}

export const GameInfoPanel: React.FC<GameInfoPanelProps> = ({
  score,
  level,
  lines,
  combo = 0,
  theme,
}) => {
  const labelColor = theme?.colors.textSecondary || '#666';
  const valueColor = theme?.colors.text || '#000';

  return (
    <View style={[styles.infoPanel, theme && { backgroundColor: theme.colors.surface }]}>
      <InfoItem label="分数" value={score.toString()} labelColor={labelColor} valueColor={valueColor} />
      <InfoItem label="等级" value={level.toString()} labelColor={labelColor} valueColor={valueColor} />
      <InfoItem label="行数" value={lines.toString()} labelColor={labelColor} valueColor={valueColor} />
      {combo > 1 && (
        <InfoItem label="连击" value={`${combo}x`} labelColor={labelColor} valueColor="#FF6B6B" />
      )}
    </View>
  );
};

interface InfoItemProps {
  label: string;
  value: string;
  labelColor?: string;
  valueColor?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, labelColor, valueColor }) => {
  return (
    <View style={styles.infoItem}>
      <View style={styles.infoLabel}>
        <Text style={[styles.infoLabelText, { color: labelColor }]}>{label}</Text>
      </View>
      <View style={styles.infoValue}>
        <Text style={[styles.infoValueText, { color: valueColor }]}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  boardWrapper: {
    position: 'relative',
  },

  gridLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  gridCell: {
    position: 'absolute',
  },

  pieceLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  border: {
    position: 'absolute',
    top: -2,
    left: -2,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 4,
    pointerEvents: 'none',
  },

  infoPanel: {
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    gap: 8,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  infoLabel: {
    flex: 1,
  },

  infoLabelText: {
    fontSize: 14,
    fontWeight: '500',
  },

  infoValue: {
    flex: 1,
    alignItems: 'flex-end',
  },

  infoValueText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
