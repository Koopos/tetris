import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Tetromino } from '../../types/blocks';
import { TetrominoBlock } from './TetrominoBlock';
import { Theme } from '../../types/themes';

/**
 * 俄罗斯方块组件属性
 */
export interface TetrominoPieceProps {
  /**
   * 方块数据
   */
  piece: Tetromino;

  /**
   * 单个格子大小
   */
  blockSize?: number;

  /**
   * 是否为幽灵方块（预览）
   */
  isGhost?: boolean;

  /**
   * 主题
   */
  theme?: Theme;
}

/**
 * 俄罗斯方块组件
 * 渲染完整的俄罗斯方块（由4个小格子组成）
 */
export const TetrominoPiece: React.FC<TetrominoPieceProps> = ({
  piece,
  blockSize = 30,
  isGhost = false,
  theme,
}) => {
  const { shape, color, powerUpType } = piece;

  // 计算方块的边界框
  const getBounds = () => {
    let minRow = Infinity,
      minCol = Infinity,
      maxRow = -Infinity,
      maxCol = -Infinity;

    shape.forEach((cell) => {
      minRow = Math.min(minRow, cell.row);
      minCol = Math.min(minCol, cell.col);
      maxRow = Math.max(maxRow, cell.row);
      maxCol = Math.max(maxCol, cell.col);
    });

    return {
      width: maxCol - minCol + 1,
      height: maxRow - minRow + 1,
      minRow,
      minCol,
    };
  };

  const bounds = getBounds();

  return (
    <View
      style={[
        styles.container,
        {
          width: bounds.width * blockSize,
          height: bounds.height * blockSize,
        },
      ]}
    >
      {shape.map((cell, index) => {
        const row = cell.row - bounds.minRow;
        const col = cell.col - bounds.minCol;

        return (
          <View
            key={index}
            style={[
              styles.cellWrapper,
              {
                top: row * blockSize,
                left: col * blockSize,
              },
            ]}
          >
            <TetrominoBlock
              color={color}
              isGhost={isGhost}
              hasPowerUp={!!powerUpType}
              size={blockSize}
              theme={theme}
            />
          </View>
        );
      })}
    </View>
  );
};

/**
 * 下一个方块预览组件
 */
export interface NextPiecePreviewProps {
  pieces: Tetromino[];
  blockSize?: number;
  theme?: Theme;
}

export const NextPiecePreview: React.FC<NextPiecePreviewProps> = ({
  pieces,
  blockSize = 25,
  theme,
}) => {
  return (
    <View style={styles.previewContainer}>
      {pieces.slice(0, 3).map((piece, index) => (
        <View key={index} style={styles.previewItem}>
          <TetrominoPiece piece={piece} blockSize={blockSize} theme={theme} />
          <Text style={styles.previewLabel}>
            {index === 0 ? '下一个' : index === 1 ? '第二个' : '第三个'}
          </Text>
        </View>
      ))}
    </View>
  );
};

/**
 * 暂存方块组件
 */
export interface HoldPiecePreviewProps {
  piece: Tetromino | null;
  canHold: boolean;
  blockSize?: number;
  theme?: Theme;
}

export const HoldPiecePreview: React.FC<HoldPiecePreviewProps> = ({
  piece,
  canHold,
  blockSize = 25,
  theme,
}) => {
  return (
    <View style={styles.holdContainer}>
      {piece ? (
        <TetrominoPiece
          piece={piece}
          blockSize={blockSize}
          theme={theme}
        />
      ) : (
        <View style={styles.emptySlot}>
          <Text style={styles.emptyText}>暂存</Text>
        </View>
      )}
      {!canHold && (
        <View style={styles.disabledIndicator} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },

  cellWrapper: {
    position: 'absolute',
  },

  previewContainer: {
    gap: 10,
    padding: 10,
  },

  previewItem: {
    alignItems: 'center',
    marginBottom: 10,
  },

  previewLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },

  holdContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },

  emptySlot: {
    width: 75,
    height: 75,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderStyle: 'dashed',
  },

  emptyText: {
    fontSize: 12,
    color: '#999',
  },

  disabledIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
  },
});
