import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Immediate redirect to Screen 01: Splash Screen
    const timer = setTimeout(() => {
      router.replace('/splash');
    }, 50);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#07C160" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#054B2A',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

