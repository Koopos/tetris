import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BlockColors } from '../../types/blocks';
import { Theme } from '../../types/themes';

/**
 * 单个方块组件
 */
export interface TetrominoBlockProps {
  /**
   * 方块颜色
   */
  color: string;

  /**
   * 是否为幽灵方块（预览）
   */
  isGhost?: boolean;

  /**
   * 是否为锁定方块
   */
  isLocked?: boolean;

  /**
   * 方块大小
   */
  size?: number;

  /**
   * 是否有道具效果
   */
  hasPowerUp?: boolean;

  /**
   * 主题
   */
  theme?: Theme;
}

/**
 * 单个方块组件
 */
export const TetrominoBlock: React.FC<TetrominoBlockProps> = ({
  color,
  isGhost = false,
  isLocked = false,
  size = 30,
  hasPowerUp = false,
  theme,
}) => {
  const blockSize = size;

  return (
    <View
      style={[
        styles.block,
        {
          width: blockSize,
          height: blockSize,
          backgroundColor: isGhost ? 'transparent' : color,
          borderColor: color,
        },
        isGhost && styles.ghost,
        isLocked && styles.locked,
        hasPowerUp && styles.powerUp,
      ]}
    >
      {/* 内部高光效果 */}
      {!isGhost && (
        <>
          <View
            style={[
              styles.highlight,
              {
                backgroundColor: `${color}33`,
              },
            ]}
          />
          <View
            style={[
              styles.shadow,
              {
                backgroundColor: `${color}66`,
              },
            ]}
          />
        </>
      )}

      {/* 道具效果指示器 */}
      {hasPowerUp && (
        <View style={styles.powerUpIndicator} />
      )}
    </View>
  );
};

/**
 * 渲染网格中的方块
 */
export interface GridCellProps {
  cell: {
    occupied: boolean;
    type: string | null;
    color: string;
    locked: boolean;
    powerUp: string | null;
  } | null;
  size: number;
  theme?: Theme;
}

export const GridCell: React.FC<GridCellProps> = ({ cell, size, theme }) => {
  if (!cell || !cell.occupied) {
    return <View style={[{ width: size, height: size }, styles.empty]} />;
  }

  return (
    <TetrominoBlock
      color={cell.color}
      isLocked={cell.locked}
      hasPowerUp={!!cell.powerUp}
      size={size}
      theme={theme}
    />
  );
};

const styles = StyleSheet.create({
  block: {
    borderWidth: 1,
    borderRadius: 3,
    position: 'relative',
    overflow: 'hidden',
  },

  empty: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 2,
  },

  ghost: {
    borderWidth: 2,
    borderStyle: 'dashed',
    backgroundColor: 'transparent',
    opacity: 0.5,
  },

  locked: {
    opacity: 1,
  },

  highlight: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: '30%',
    height: '30%',
    borderRadius: 2,
  },

  shadow: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: '30%',
    height: '30%',
    borderRadius: 2,
  },

  powerUp: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },

  powerUpIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -4,
    marginLeft: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 3,
  },
});
