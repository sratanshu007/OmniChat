import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { MessageSquare, Users, Compass, Layers, User } from 'lucide-react-native';
import { Colors } from '../../src/theme/tokens';
import { useApp } from '../../src/context/AppContext';

export default function TabsLayout() {
  const { t, isDarkMode, conversations, friendRequests } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const totalUnreadChats = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const totalRequests = friendRequests.length;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2
        }
      }}
    >
      <Tabs.Screen
        name="chats/index"
        options={{
          title: t.tabs.chats,
          tabBarBadge: totalUnreadChats > 0 ? (totalUnreadChats > 99 ? '99+' : totalUnreadChats) : undefined,
          tabBarBadgeStyle: {
            backgroundColor: theme.badgeRed,
            fontSize: 10,
            fontWeight: '800',
            minWidth: 18,
            height: 18
          },
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconBox}>
              <MessageSquare size={22} color={color} strokeWidth={focused ? 2.4 : 1.8} />
              {focused && <View style={[styles.activeIndicator, { backgroundColor: theme.primary }]} />}
            </View>
          )
        }}
      />
      <Tabs.Screen
        name="contacts/index"
        options={{
          title: t.tabs.contacts,
          tabBarBadge: totalRequests > 0 ? totalRequests : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#FA9D3B',
            fontSize: 10,
            fontWeight: '800'
          },
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconBox}>
              <Users size={22} color={color} strokeWidth={focused ? 2.4 : 1.8} />
              {focused && <View style={[styles.activeIndicator, { backgroundColor: theme.primary }]} />}
            </View>
          )
        }}
      />
      <Tabs.Screen
        name="discover/index"
        options={{
          title: t.tabs.discover,
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconBox}>
              <Compass size={22} color={color} strokeWidth={focused ? 2.4 : 1.8} />
              {focused && <View style={[styles.activeIndicator, { backgroundColor: theme.primary }]} />}
            </View>
          )
        }}
      />
      <Tabs.Screen
        name="services/index"
        options={{
          title: t.tabs.services,
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconBox}>
              <Layers size={22} color={color} strokeWidth={focused ? 2.4 : 1.8} />
              {focused && <View style={[styles.activeIndicator, { backgroundColor: theme.primary }]} />}
            </View>
          )
        }}
      />
      <Tabs.Screen
        name="me/index"
        options={{
          title: t.tabs.me,
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconBox}>
              <User size={22} color={color} strokeWidth={focused ? 2.4 : 1.8} />
              {focused && <View style={[styles.activeIndicator, { backgroundColor: theme.primary }]} />}
            </View>
          )
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    alignItems: 'center',
    position: 'relative',
    height: 28,
    justifyContent: 'center'
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 14,
    height: 3,
    borderRadius: 1.5
  }
});
