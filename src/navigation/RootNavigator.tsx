// ============================================================
// ROOT NAVIGATOR — src/navigation/RootNavigator.tsx
// React Navigation 7 (Tab + Stack Anidado)
// ============================================================

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootTabParamList, HomeStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { COLORS } from '../theme';

const Stack = createNativeStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

// Stack Navigator de la pestaña Home
function HomeStackNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.surface,
        },
        headerTintColor: COLORS.textPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="HomeList"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetailScreen"
        component={DetailScreen}
        options={({ route }) => ({
          title: route.params.name,
          headerShown: false,
        })}
      />
    </Stack.Navigator>
  );
}

// Tab Navigator Principal
export function RootNavigator(): React.JSX.Element {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: COLORS.primaryLight,
        tabBarInactiveTintColor: COLORS.textSecondary,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Eventos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="FavoritesTab"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favoritos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
