import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.OS === 'web' 
          ? { display: 'none' } 
          : { 
              backgroundColor: '#001D47', 
              height: 65 + insets.bottom, 
              paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
              paddingTop: 10,
              borderTopWidth: 0,
              elevation: 10, 
            },
        tabBarActiveTintColor: '#FFD700', 
        tabBarInactiveTintColor: '#ffffff',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: insets.bottom > 0 ? 0 : 5,
        }
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