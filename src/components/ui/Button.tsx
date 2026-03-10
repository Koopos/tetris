import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import { Theme, getTheme } from '../../types/themes';

/**
 * Button 组件属性
 */
export interface ButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  theme?: Theme;
}

/**
 * Button 组件
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  style,
  textStyle,
  theme,
}) => {
  const currentTheme = theme || getTheme('neon');

  const getButtonColor = (): string => {
    if (disabled) return currentTheme.colors.ui.secondary;
    switch (variant) {
      case 'primary':
        return currentTheme.colors.ui.primary;
      case 'secondary':
        return currentTheme.colors.ui.secondary;
      case 'accent':
        return currentTheme.colors.ui.accent;
      case 'success':
        return currentTheme.colors.ui.success;
      case 'warning':
        return currentTheme.colors.ui.warning;
      case 'error':
        return currentTheme.colors.ui.error;
      default:
        return currentTheme.colors.ui.primary;
    }
  };

  const getSize = (): number => {
    switch (size) {
      case 'small':
        return 12;
      case 'medium':
        return 16;
      case 'large':
        return 20;
      default:
        return 16;
    }
  };

  const buttonStyle: ViewStyle = {
    backgroundColor: getButtonColor(),
    opacity: disabled ? 0.5 : 1,
    paddingVertical: size === 'small' ? 8 : size === 'large' ? 16 : 12,
    paddingHorizontal: size === 'small' ? 16 : size === 'large' ? 32 : 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    ...style,
  };

  const textStyles: TextStyle = {
    color: currentTheme.colors.background,
    fontSize: getSize(),
    fontWeight: 'bold',
    ...textStyle,
  };

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
};
