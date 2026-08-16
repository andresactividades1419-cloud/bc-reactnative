// ============================================================
// SCREEN: FavoritesScreen (SavedScreen)
// Dominio: Productora de Eventos (Semana 04 - Zustand)
// ============================================================

import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ListRenderItemInfo,
} from 'react-native';
import { EventItem } from '../types';
import { ItemCard } from '../components/ItemCard';
import { useEventStore } from '../stores/useEventStore';
import { SavedScreenProps } from '../navigation/types';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';

export function SavedScreen({ navigation }: SavedScreenProps): React.JSX.Element {
  // Selectores y Acciones directamente desde el Store Zustand (sin prop drilling)
  const savedEvents = useEventStore((state) => state.savedEvents);
  const clearSavedEvents = useEventStore((state) => state.clearSavedEvents);

  const handleEventPress = useCallback(
    (item: EventItem) => {
      navigation.navigate('HomeTab', {
        screen: 'DetailScreen',
        params: {
          id: item.id,
          name: item.name,
        },
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

  const renderEmptyState = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>⭐</Text>
        <Text style={styles.emptyTitle}>No tienes eventos guardados</Text>
        <Text style={styles.emptySubtitle}>
          Explora el catálogo general y presiona el botón "☆ Guardar" para hacerle seguimiento en tiempo real.
        </Text>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.flexOne}>
            <Text style={styles.badge}>BC-REACTNATIVE • ESTADO GLOBAL ZUSTAND</Text>
            <Text style={TYPOGRAPHY.headerTitle}>Eventos Destacados ⭐</Text>
          </View>
          {savedEvents.length > 0 && (
            <Pressable style={styles.clearButton} onPress={clearSavedEvents}>
              <Text style={styles.clearButtonText}>Limpiar Todo 🗑️</Text>
            </Pressable>
          )}
        </View>
        <Text style={TYPOGRAPHY.headerSubtitle}>
          {savedEvents.length} producciones marcadas en tu estado global
        </Text>
      </View>

      <FlatList
        data={savedEvents}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

// Exportación alternativa para mantener compatibilidad
export { SavedScreen as FavoritesScreen };

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
    color: COLORS.warningLight,
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  clearButton: {
    backgroundColor: COLORS.dangerBg,
    borderColor: COLORS.danger,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: 6,
  },
  clearButtonText: {
    color: COLORS.danger,
    fontSize: 12,
    fontWeight: 'bold',
  },
  separator: {
    height: SPACING.md,
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
