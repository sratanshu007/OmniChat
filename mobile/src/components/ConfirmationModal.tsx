import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { Colors } from '../theme/tokens';
import { Button } from './Button';

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDark?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
  isDark = false
}) => {
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={[styles.dialog, { backgroundColor: theme.surface }]}>
          <View style={[styles.iconBox, { backgroundColor: isDestructive ? '#FEE2E2' : '#E8F8F0' }]}>
            <AlertTriangle size={24} color={isDestructive ? '#EF4444' : '#07C160'} />
          </View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
          <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>

          <View style={styles.actions}>
            <Button
              title={cancelText}
              variant="outline"
              size="md"
              onPress={onCancel}
              style={{ flex: 1 }}
              isDark={isDark}
            />
            <Button
              title={confirmText}
              variant={isDestructive ? 'danger' : 'primary'}
              size="md"
              onPress={onConfirm}
              style={{ flex: 1 }}
              isDark={isDark}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  dialog: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center'
  },
  message: {
    fontSize: 13.5,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 20
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    width: '100%'
  }
});
