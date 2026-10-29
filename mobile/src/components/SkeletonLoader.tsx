import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  isDark?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = 6,
  style,
  isDark = false
}) => {
  return (
    <View
      style={[
        styles.skeleton,
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: isDark ? '#1F2937' : '#E5E7EB'
        },
        style
      ]}
    />
  );
};

export const ChatItemSkeleton: React.FC<{ isDark?: boolean }> = ({ isDark = false }) => {
  return (
    <View style={styles.chatRow}>
      <Skeleton width={48} height={48} borderRadius={10} isDark={isDark} />
      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Skeleton width="45%" height={15} isDark={isDark} />
          <Skeleton width="18%" height={11} isDark={isDark} />
        </View>
        <Skeleton width="75%" height={13} style={{ marginTop: 6 }} isDark={isDark} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden'
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12
  },
  chatInfo: {
    flex: 1
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
