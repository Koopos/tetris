import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameBoard } from '../game/GameBoard';
import { NextPiecePreview, HoldPiecePreview } from '../blocks/TetrominoPiece';
import { useGameState } from '../../state/useGameState';
import { Theme, NEON_THEME } from '../../types/themes';

/**
 * 游戏屏幕属性
 */
export interface GameScreenProps {
  /**
   * 主题
   */
  theme?: Theme;
}

/**
 * 游戏控制按钮组件
 */
interface ControlButtonProps {
  title: string;
  onPress: () => void;
  theme?: Theme;
  size?: number;
  disabled?: boolean;
}

const ControlButton: React.FC<ControlButtonProps> = ({
  title,
  onPress,
  theme,
  size = 60,
  disabled = false,
}) => {
  const buttonStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: disabled
      ? '#ccc'
      : theme?.colors.ui.button || '#4CAF50',
  };

  return (
    <TouchableOpacity
      style={[styles.controlButton, buttonStyle]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={styles.controlButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

/**
 * 游戏屏幕组件
 * 整合游戏棋盘、控制面板、信息显示等
 */
export const GameScreen: React.FC<GameScreenProps> = ({ theme }) => {
  const {
    gameState,
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    moveLeft,
    moveRight,
    rotate,
    softDrop,
    hardDrop,
    holdPiece,
    ui,
  } = useGameState();

  const {
    board,
    currentPiece,
    nextPieces,
    holdPiece: holdPieceData,
    canHold,
    score,
    level,
    lines,
    combo,
    isPlaying,
    isPaused,
    isGameOver,
  } = gameState;

  // 提供默认值以处理可选属性
  const safeHoldPiece = holdPieceData ?? null;
  const safeCanHold = canHold ?? true;
  const safeCombo = combo ?? 0;

  // 使用提供的主题或默认主题
  const currentTheme = theme || NEON_THEME;

  // 游戏未开始
  if (!isPlaying && !isGameOver) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.centerContainer}>
            <Text style={[styles.title, { color: currentTheme.colors.text }]}>
              Tetris+
            </Text>

            <View style={styles.menu}>
              <TouchableOpacity
                style={[styles.menuButton, { backgroundColor: currentTheme.colors.ui.primary }]}
                onPress={startGame}
              >
                <Text style={styles.menuButtonText}>开始游戏</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuButton, { backgroundColor: currentTheme.colors.ui.warning }]}
                onPress={() => {
                  /* TODO: 打开设置 */
                }}
              >
                <Text style={styles.menuButtonText}>游戏设置</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.stats}>
              <Text style={[styles.statsText, { color: currentTheme.colors.textSecondary }]}>
                最高分: {gameState.score}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // 游戏结束
  if (isGameOver) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.centerContainer}>
            <Text style={[styles.title, { color: currentTheme.colors.ui.error }]}>
              游戏结束
            </Text>

            <View style={styles.finalScore}>
              <Text style={[styles.finalScoreLabel, { color: currentTheme.colors.textSecondary }]}>
                最终得分
              </Text>
              <Text style={[styles.finalScoreValue, { color: currentTheme.colors.text }]}>
                {score}
              </Text>
            </View>

            <View style={styles.menu}>
              <TouchableOpacity
                style={[styles.menuButton, { backgroundColor: currentTheme.colors.ui.primary }]}
                onPress={restartGame}
              >
                <Text style={styles.menuButtonText}>再来一局</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuButton, { backgroundColor: currentTheme.colors.ui.warning }]}
                onPress={() => {
                  /* TODO: 返回主菜单 */
                }}
              >
                <Text style={styles.menuButtonText}>主菜单</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // 游戏进行中
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 顶部信息栏 */}
        <View style={styles.topBar}>
          <View style={styles.scoreBar}>
            <Text style={[styles.scoreText, { color: currentTheme.colors.text }]}>
              分数: {score}
            </Text>
            <Text style={[styles.scoreText, { color: currentTheme.colors.textSecondary }]}>
              等级: {level} | 行: {lines}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.pauseButton, { backgroundColor: currentTheme.colors.ui.warning }]}
            onPress={isPaused ? resumeGame : pauseGame}
          >
            <Text style={styles.pauseButtonText}>{isPaused ? '继续' : '暂停'}</Text>
          </TouchableOpacity>
        </View>

        {/* 主游戏区域 */}
        <View style={styles.gameArea}>
          {/* 左侧面板 - 暂存方块 */}
          {ui.showHoldPiece && (
            <View style={[styles.sidePanel, { backgroundColor: currentTheme.colors.surface }]}>
              <Text style={[styles.panelTitle, { color: currentTheme.colors.text }]}>暂存</Text>
              <HoldPiecePreview
                piece={safeHoldPiece}
                canHold={safeCanHold}
                theme={currentTheme}
              />
              <TouchableOpacity
                style={[
                  styles.holdButton,
                  { backgroundColor: safeCanHold ? currentTheme.colors.ui.primary : '#ccc' },
                ]}
                onPress={holdPiece}
                disabled={!safeCanHold}
              >
                <Text style={styles.holdButtonText}>暂存 (H)</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 中央 - 游戏棋盘 */}
          <View style={styles.boardContainer}>
            {isPaused ? (
              <View style={styles.pauseOverlay}>
                <Text style={[styles.pauseText, { color: currentTheme.colors.text }]}>
                  已暂停
                </Text>
              </View>
            ) : null}
            <GameBoard
              board={board!}
              currentPiece={currentPiece!}
              showGhost={ui.showGhostPiece}
              theme={currentTheme}
            />
          </View>

          {/* 右侧面板 - 下一个方块 */}
          {ui.showNextPiece && (
            <View style={[styles.sidePanel, { backgroundColor: currentTheme.colors.surface }]}>
              <Text style={[styles.panelTitle, { color: currentTheme.colors.text }]}>预览</Text>
              <NextPiecePreview pieces={nextPieces!} theme={currentTheme} />
            </View>
          )}
        </View>

        {/* 游戏控制区域 */}
        <View style={styles.controlsArea}>
          {/* 方向控制 */}
          <View style={styles.directionControls}>
            <View style={styles.controlRow}>
              <ControlButton
                title="↑"
                onPress={rotate}
                theme={currentTheme}
                disabled={isPaused}
              />
            </View>
            <View style={styles.controlRow}>
              <ControlButton
                title="←"
                onPress={moveLeft}
                theme={currentTheme}
                disabled={isPaused}
              />
              <ControlButton
                title="↓"
                onPress={softDrop}
                theme={currentTheme}
                disabled={isPaused}
              />
              <ControlButton
                title="→"
                onPress={moveRight}
                theme={currentTheme}
                disabled={isPaused}
              />
            </View>
          </View>

          {/* 快捷操作 */}
          <View style={styles.actionControls}>
            <ControlButton
              title="⤓"
              onPress={hardDrop}
              theme={currentTheme}
              size={50}
              disabled={isPaused}
            />
          </View>
        </View>

        {/* 连击提示 */}
        {safeCombo > 1 && ui.showCombo && (
          <View style={styles.comboContainer}>
            <Text style={[styles.comboText, { color: currentTheme.colors.ui.success }]}>
              {safeCombo} 连击!
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    padding: 10,
  },

  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },

  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 40,
  },

  menu: {
    width: '100%',
    gap: 15,
    paddingHorizontal: 40,
  },

  menuButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },

  menuButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  stats: {
    marginTop: 40,
  },

  statsText: {
    fontSize: 16,
  },

  finalScore: {
    marginVertical: 40,
    alignItems: 'center',
  },

  finalScoreLabel: {
    fontSize: 18,
    marginBottom: 10,
  },

  finalScoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },

  scoreBar: {
    flex: 1,
  },

  scoreText: {
    fontSize: 16,
    fontWeight: '600',
  },

  pauseButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },

  pauseButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  gameArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginVertical: 10,
  },

  sidePanel: {
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
    minWidth: 90,
  },

  panelTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  holdButton: {
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },

  holdButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  boardContainer: {
    position: 'relative',
  },

  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    zIndex: 10,
  },

  pauseText: {
    fontSize: 32,
    fontWeight: 'bold',
  },

  controlsArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 15,
    paddingHorizontal: 20,
  },

  directionControls: {
    alignItems: 'center',
  },

  controlRow: {
    flexDirection: 'row',
    gap: 10,
  },

  actionControls: {
    marginLeft: 20,
  },

  controlButton: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  controlButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  comboContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -60,
    marginTop: -30,
    width: 120,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
  },

  comboText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});
