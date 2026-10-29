import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextInputProps
} from 'react-native';
import { X } from 'lucide-react-native';
import { Colors } from '../theme/tokens';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  prefix?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
  containerStyle?: ViewStyle;
  isDark?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  prefix,
  leftIcon,
  rightIcon,
  value,
  onClear,
  containerStyle,
  isDark = false,
  ...rest
}) => {
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.surface,
            borderColor: error ? theme.badgeRed : theme.border
          }
        ]}
      >
        {prefix && (
          <View style={[styles.prefixBox, { borderRightColor: theme.border }]}>
            <Text style={[styles.prefixText, { color: theme.textPrimary }]}>{prefix}</Text>
          </View>
        )}

        {leftIcon && <View style={styles.iconBox}>{leftIcon}</View>}

        <TextInput
          style={[styles.input, { color: theme.textPrimary }]}
          placeholderTextColor={theme.textMuted}
          value={value}
          {...rest}
        />

        {value && onClear && (
          <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
            <X size={16} color={theme.textMuted} />
          </TouchableOpacity>
        )}

        {rightIcon && <View style={styles.iconBox}>{rightIcon}</View>}
      </View>

      {error && <Text style={[styles.errorText, { color: theme.badgeRed }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    height: 48,
    paddingHorizontal: 12
  },
  prefixBox: {
    paddingRight: 10,
    marginRight: 8,
    borderRightWidth: 1
  },
  prefixText: {
    fontSize: 14.5,
    fontWeight: '700'
  },
  iconBox: {
    marginRight: 8
  },
  input: {
    flex: 1,
    fontSize: 14.5,
    paddingVertical: 8
  },
  clearBtn: {
    padding: 4
  },
  errorText: {
    fontSize: 11.5,
    marginTop: 4,
    fontWeight: '500'
  }
});
