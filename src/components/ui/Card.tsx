import React from 'react';
import { View, StyleSheet, ViewStyle, } from 'react-native';
import { Theme, getTheme } from '../../types/themes';

/**
 * Card 组件属性
 */
export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  theme?: Theme;
  padding?: number;
  borderRadius?: number;
}

/**
 * Card 组件
 */
export const Card: React.FC<CardProps> = ({
  children,
  style,
  theme,
  padding = 16,
  borderRadius = 12,
}) => {
  const currentTheme = theme || getTheme('neon');

  const cardStyle: ViewStyle = {
    backgroundColor: currentTheme.colors.board,
    borderRadius,
    padding,
    borderWidth: 1,
    borderColor: currentTheme.colors.grid,
    ...style,
  };

  return <View style={cardStyle}>{children}</View>;
};
