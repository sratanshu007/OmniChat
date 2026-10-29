import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldCheck, Check } from 'lucide-react-native';
import { Colors } from '../theme/tokens';

interface UnreadBadgeProps {
  count: number;
  max?: number;
}

export const UnreadBadge: React.FC<UnreadBadgeProps> = ({ count, max = 99 }) => {
  if (count <= 0) return null;
  const display = count > max ? `${max}+` : count;

  return (
    <View style={styles.unreadBadge}>
      <Text style={styles.unreadText}>{display}</Text>
    </View>
  );
};

export const OnlineDot: React.FC<{ isOnline?: boolean }> = ({ isOnline = true }) => {
  if (!isOnline) return null;
  return <View style={styles.onlineDot} />;
};

export const VerifiedBadge: React.FC<{ text?: string }> = ({ text = 'Verified' }) => {
  return (
    <View style={styles.verifiedContainer}>
      <ShieldCheck size={12} color="#07C160" />
      <Text style={styles.verifiedText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  unreadBadge: {
    backgroundColor: Colors.light.badgeRed,
    borderRadius: 999,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800'
  },
  onlineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    position: 'absolute',
    bottom: 0,
    right: 0
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#E8F8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857'
  }
});
