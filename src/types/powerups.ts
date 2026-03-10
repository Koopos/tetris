import { PowerUpType } from './blocks';
import { Position } from './blocks';

/**
 * 道具配置
 */
export interface PowerUpConfig {
  type: PowerUpType;
  name: string;
  description: string;
  icon: string;
  color: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  weight: number; // 生成权重（越高越容易生成）
  duration?: number; // 持续时间（毫秒）
}

/**
 * 道具效果结果
 */
export interface PowerUpResult {
  success: boolean;
  scoreBonus: number;
  affectedCells?: Position[];
  message?: string;
}

/**
 * 道具生成条件
 */
export interface PowerUpSpawnCondition {
  minCombo: number;
  probability: number; // 0-1
}

/**
 * 默认道具配置
 */
export const POWER_UP_CONFIGS: Record<PowerUpType, PowerUpConfig> = {
  bomb: {
    type: 'bomb',
    name: '炸弹方块',
    description: '消除后清除周围 3x3 区域',
    icon: '💣',
    color: '#FF4444',
    rarity: 'rare',
    weight: 30,
  },
  freeze: {
    type: 'freeze',
    name: '时间冻结',
    description: '暂停下落 5 秒',
    icon: '❄️',
    color: '#44AAFF',
    rarity: 'common',
    weight: 25,
    duration: 5000,
  },
  rainbow: {
    type: 'rainbow',
    name: '彩虹方块',
    description: '可以填充任何空缺',
    icon: '🌈',
    color: '#FF00FF',
    rarity: 'epic',
    weight: 20,
  },
  lightning: {
    type: 'lightning',
    name: '闪电方块',
    description: '消除整行',
    icon: '⚡',
    color: '#FFFF00',
    rarity: 'rare',
    weight: 15,
  },
  time: {
    type: 'time',
    name: '时间倒流',
    description: '减缓下落速度 50%，持续 10 秒',
    icon: '⏰',
    color: '#00FF00',
    rarity: 'legendary',
    weight: 10,
    duration: 10000,
  },
};
