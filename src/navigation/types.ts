// ============================================================
// NAVIGATION TYPES — src/navigation/types.ts
// React Navigation 7 (Semana 04 - Estado Global Zustand)
// ============================================================

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

export type HomeStackParamList = {
  HomeList: undefined;
  DetailScreen: {
    id: string;
    name: string;
  };
  CreateScreen: undefined;
};

export type RootTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  SavedTab: undefined;
};

export type HomeListScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'HomeList'>,
  BottomTabScreenProps<RootTabParamList>
>;

export type DetailScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'DetailScreen'>,
  BottomTabScreenProps<RootTabParamList>
>;

export type CreateScreenProps = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'CreateScreen'>,
  BottomTabScreenProps<RootTabParamList>
>;

export type SavedScreenProps = BottomTabScreenProps<RootTabParamList, 'SavedTab'>;
