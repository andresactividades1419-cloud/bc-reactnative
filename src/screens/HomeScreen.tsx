// ============================================================
// SCREEN: HomeScreen (HomeList)
// Dominio: Productora de Eventos (Semana 04 - Zustand)
// ============================================================

import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ListRenderItemInfo,
} from 'react-native';
import { EventItem } from '../types';
import { MOCK_EVENTS } from '../data/mockData';
import { ItemCard } from '../components/ItemCard';
import { useEventStore } from '../stores/useEventStore';
import { HomeListScreenProps } from '../navigation/types';
import { COLORS, SPACING, TYPOGRAPHY } from '../theme';

export function HomeScreen({ navigation }: HomeListScreenProps): React.JSX.Element {
  // Selector Zustand para obtener la cantidad de guardados en tiempo real
  const savedCount = useEventStore((state) => state.savedEvents.length);

  const handleEventPress = useCallback(
    (item: EventItem) => {
      navigation.navigate('DetailScreen', {
        id: item.id,
        name: item.name,
      });
    },
    [navigation]
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<EventItem>) => (
      <ItemCard item={item} onPress={handleEventPress} />
    ),
    [handleEventPress]
  );

  const keyExtractor = useCallback((item: EventItem) => item.id, []);

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.flexOne}>
            <Text style={TYPOGRAPHY.headerTitle}>Productora de Eventos</Text>
          </View>
          <View style={styles.savedChip}>
            <Text style={styles.savedChipText}>⭐ {savedCount} Guardados</Text>
          </View>
        </View>
        <Text style={TYPOGRAPHY.headerSubtitle}>
          Catálogo General de Producciones & Eventos
        </Text>
      </View>

      <FlatList
        data={MOCK_EVENTS}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  flexOne: {
    flex: 1,
  },
  badge: {
    color: COLORS.successLight,
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  savedChip: {
    backgroundColor: COLORS.warningBg,
    borderColor: COLORS.warning,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
  },
  savedChipText: {
    color: COLORS.warningLight,
    fontSize: 12,
    fontWeight: 'bold',
  },
  separator: {
    height: SPACING.md,
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
});
