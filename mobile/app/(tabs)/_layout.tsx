import React from 'react';
import { Tabs } from 'expo-router';
import { Colors } from '../../src/theme/tokens';
import { MessageSquare, Users, Compass, Layers, User } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.textSecondary,
        tabBarStyle: {
          backgroundColor: '#F9FAFB',
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600'
        }
      }}
    >
      <Tabs.Screen
        name="chats/index"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, size }) => <MessageSquare size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="contacts/index"
        options={{
          title: 'Contacts',
          tabBarIcon: ({ color, size }) => <Users size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="discover/index"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, size }) => <Compass size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="services/index"
        options={{
          title: 'Services',
          tabBarIcon: ({ color, size }) => <Layers size={size} color={color} />
        }}
      />
      <Tabs.Screen
        name="me/index"
        options={{
          title: 'Me',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />
        }}
      />
    </Tabs>
  );
}
