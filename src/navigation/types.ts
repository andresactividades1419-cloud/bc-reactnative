// ============================================================
// NAVIGATION TYPES — src/navigation/types.ts
// React Navigation 7
// ============================================================

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

// Param List para el Stack Navigator de Home (HomeList -> DetailScreen)
export type HomeStackParamList = {
  HomeList: undefined;
  DetailScreen: {
    id: string;
    name: string;
  };
};

// Param List para el Tab Navigator Principal (HomeTab -> FavoritesTab)
export type RootTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  FavoritesTab: undefined;
};

// Screen Props Helpers
export type HomeListScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'HomeList'>,
  BottomTabScreenProps<RootTabParamList>
>;

export type DetailScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'DetailScreen'>,
  BottomTabScreenProps<RootTabParamList>
>;

export type FavoritesScreenProps = BottomTabScreenProps<RootTabParamList, 'FavoritesTab'>;
