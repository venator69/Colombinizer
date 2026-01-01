import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }
      }}
    >

      <Tabs.Screen
        name="home" 
        options={{
          title: 'Home',
        }}
      />
      
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
        }}
      />

      <Tabs.Screen
        name="lab"
        options={{
          title: 'Virtual Lab',
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
        }}
      />
    </Tabs>
  );
}