import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '../src/context/AppContext';
import { CallOverlayModal } from '../src/components/CallOverlayModal';

export default function RootLayout() {
  return (
    <AppProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="moments/index" options={{ headerShown: false }} />
        <Stack.Screen name="wallet/index" options={{ headerShown: false }} />
        <Stack.Screen name="contact/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="mini-app/[key]" options={{ headerShown: false }} />
      </Stack>
      <CallOverlayModal />
    </AppProvider>
  );
}
