import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.OS === 'web' 
          ? { display: 'none' } 
          : { 
              backgroundColor: '#001D47', 
              height: 65, 
              paddingBottom: 10,
              borderTopWidth: 0 
            },
        tabBarActiveTintColor: '#FFD700', 
        tabBarInactiveTintColor: '#ffffff', 
      }}
    >
      <Tabs.Screen
        name="home" 
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color }) => <Ionicons name="book" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="lab"
        options={{
          title: 'Lab',
          tabBarIcon: ({ color }) => <Ionicons name="flask" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <Ionicons name="time" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}