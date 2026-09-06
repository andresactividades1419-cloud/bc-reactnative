// ============================================================
// SCREEN: HomeScreen (HomeList) — src/screens/HomeScreen.tsx
// Dominio: Productora de Eventos (Pesos Colombianos COP)
// Semana 05: Networking & TanStack Query v5 (useQuery + Pull-to-refresh)
// ============================================================

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Pressable,
  ListRenderItemInfo,
} from 'react-native';
import { EventItem, EventCategory } from '../types';
import { ItemCard } from '../components/ItemCard';
import { useEvents } from '../hooks/useEvents';
import { usePreferences } from '../hooks/usePreferences';
import { useEventStore } from '../stores/useEventStore';
import { HomeListScreenProps } from '../navigation/types';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';

const CATEGORIES: EventCategory[] = [
  'Todos',
  'Concierto',
  'Boda',
  'Conferencia',
  'Corporativo',
  'Festival',
];

export function HomeScreen({ navigation }: HomeListScreenProps): React.JSX.Element {
  // Estado local para filtro por categoría
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('Todos');

  // Preferencias síncronas de MMKV (sortOrder, compactMode, itemsPerPage)
  const { sortOrder, compactMode, itemsPerPage } = usePreferences();

  // TanStack Query v5 + Caché AsyncStorage
  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
    error,
  } = useEvents();

  const events = data?.events ?? [];
  const isOffline = data?.source === 'cache';

  // Selector Zustand para estado de UI del cliente (favoritos/guardados)
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

  const handleCreatePress = useCallback(() => {
    navigation.navigate('CreateScreen');
  }, [navigation]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<EventItem>) => (
      <ItemCard item={item} onPress={handleEventPress} compact={compactMode} />
    ),
    [handleEventPress, compactMode]
  );

  const keyExtractor = useCallback((item: EventItem) => item.id, []);

  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    []
  );

  // 1. Lista ordenada y filtrada completa
  const sortedAndFilteredEvents = React.useMemo(() => {
    let list =
      selectedCategory === 'Todos'
        ? [...events]
        : events.filter((e) => e.category === selectedCategory);

    // Ordenamiento según preferencia MMKV
    list.sort((a, b) => {
      const cmp = a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
      return sortOrder === 'desc' ? -cmp : cmp;
    });

    return list;
  }, [events, selectedCategory, sortOrder]);

  // Estado para expandir y ver todas las producciones si hay límite activo en MMKV
  const [showAllOverride, setShowAllOverride] = React.useState(false);

  // Lista visible respetando preferencia de MMKV o mostrando todas si se expande
  const visibleEvents = React.useMemo(() => {
    if (showAllOverride || itemsPerPage >= sortedAndFilteredEvents.length) {
      return sortedAndFilteredEvents;
    }
    return sortedAndFilteredEvents.slice(0, itemsPerPage);
  }, [sortedAndFilteredEvents, itemsPerPage, showAllOverride]);

  const renderFooter = useCallback(() => {
    if (visibleEvents.length < sortedAndFilteredEvents.length) {
      const remaining = sortedAndFilteredEvents.length - visibleEvents.length;
      return (
        <Pressable
          style={styles.loadMoreButton}
          onPress={() => setShowAllOverride(true)}
        >
          <Text style={styles.loadMoreButtonText}>
            Ver todas las producciones (+{remaining} restantes) 👇
          </Text>
        </Pressable>
      );
    }
    if (showAllOverride && sortedAndFilteredEvents.length > itemsPerPage) {
      return (
        <Pressable
          style={styles.loadMoreButton}
          onPress={() => setShowAllOverride(false)}
        >
          <Text style={styles.loadMoreButtonText}>
            Restablecer límite de vista ({itemsPerPage} eventos) 👆
          </Text>
        </Pressable>
      );
    }
    return null;
  }, [visibleEvents.length, sortedAndFilteredEvents.length, showAllOverride, itemsPerPage]);

  // ── ESTADO 1: CARGA INICIAL (Loading State) ────────────────
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primaryLight} />
          <Text style={styles.loadingTitle}>Consultando API REST...</Text>
          <Text style={styles.loadingSubtitle}>
            Cargando producciones y eventos en Pesos Colombianos (COP)
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── ESTADO 2: ERROR DE RED (Error State) ───────────────────
  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.centered}>
          <View style={styles.errorIconCircle}>
            <Text style={styles.errorIconText}>⚠️</Text>
          </View>
          <Text style={styles.errorTitle}>Error al sincronizar producciones</Text>
          <Text style={styles.errorMessage}>
            {error?.message || 'No fue posible conectar con el servidor de la API.'}
          </Text>
          <Pressable style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>🔄 Reintentar conexión</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // ── ESTADO 3: ÉXITO (Renderizado de Lista con Pull-to-Refresh) ──
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Cabecera Principal */}
      <View style={styles.header}>
        {/* Banner de modo sin conexión */}
        {isOffline && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineBannerText}>
              ⚠️ Modo sin conexión: Mostrando producciones guardadas localmente
            </Text>
          </View>
        )}

        <View style={styles.headerTitleRow}>
          <View style={styles.flexOne}>
            <Text style={TYPOGRAPHY.headerTitle}>Productora de Eventos</Text>
          </View>
          <View style={styles.savedChip}>
            <Text style={styles.savedChipText}>⭐ {savedCount} Guardados</Text>
          </View>
        </View>

        <View style={styles.headerActionsRow}>
          <Text style={TYPOGRAPHY.headerSubtitle}>
            Gestión Integral de Producciones & Eventos
          </Text>
          {/* Botón para abrir modal de creación */}
          <Pressable style={styles.createButton} onPress={handleCreatePress}>
            <Text style={styles.createButtonText}>+ Nuevo Evento</Text>
          </Pressable>
        </View>

        {/* Barra de Filtros por Categoría */}
        <View style={styles.filtersScroll}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    isSelected && styles.filterChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Indicador de items y estado de red en segundo plano */}
        <View style={styles.metaStatusBar}>
          <Pressable
            style={styles.metaStatusPressable}
            onPress={() => {
              if (visibleEvents.length < sortedAndFilteredEvents.length) {
                setShowAllOverride(true);
              } else if (showAllOverride && sortedAndFilteredEvents.length > itemsPerPage) {
                setShowAllOverride(false);
              }
            }}
          >
            <Text style={styles.metaStatusText}>
              Mostrando {visibleEvents.length} de {sortedAndFilteredEvents.length} producciones
              {visibleEvents.length < sortedAndFilteredEvents.length && (
                <Text style={styles.metaStatusAction}> • Toca para ver todas</Text>
              )}
            </Text>
          </Pressable>
          {isFetching && !isLoading && (
            <View style={styles.syncIndicator}>
              <ActivityIndicator size="small" color={COLORS.primaryLight} />
              <Text style={styles.syncText}>Sincronizando...</Text>
            </View>
          )}
        </View>
      </View>

      {/* FlatList con Pull-to-Refresh y Empty State */}
      <FlatList
        data={visibleEvents}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        // Pull to refresh de TanStack Query
        onRefresh={refetch}
        refreshing={isFetching && !isLoading}
        // Empty State cuando no hay producciones
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎪</Text>
            <Text style={styles.emptyTitle}>No hay producciones disponibles</Text>
            <Text style={styles.emptySubtitle}>
              {selectedCategory === 'Todos'
                ? 'No se encontraron eventos en el servidor.'
                : `No hay eventos registrados en la categoría "${selectedCategory}".`}
            </Text>
            <Pressable style={styles.emptyAction} onPress={handleCreatePress}>
              <Text style={styles.emptyActionText}>Crear Primer Evento</Text>
            </Pressable>
          </View>
        }
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
    paddingBottom: SPACING.sm,
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
  headerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  createButton: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: 5,
    borderRadius: RADIUS.md,
  },
  createButtonText: {
    color: COLORS.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  flexOne: {
    flex: 1,
  },
  badge: {
    color: COLORS.successLight,
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
    letterSpacing: 0.5,
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
  filtersScroll: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  filterChip: {
    backgroundColor: COLORS.surfaceLight,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 3,
  },
  filterChipActive: {
    backgroundColor: COLORS.primaryBg,
    borderColor: COLORS.primaryLight,
  },
  filterChipText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: COLORS.primaryLight,
    fontWeight: 'bold',
  },
  metaStatusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 4,
  },
  metaStatusPressable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaStatusText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  metaStatusAction: {
    color: COLORS.primaryLight,
    fontWeight: 'bold',
  },
  loadMoreButton: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  loadMoreButtonText: {
    color: COLORS.primaryLight,
    fontSize: 13,
    fontWeight: 'bold',
  },
  syncIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  syncText: {
    color: COLORS.primaryLight,
    fontSize: 11,
  },
  separator: {
    height: SPACING.md,
  },
  listContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    gap: SPACING.sm,
  },
  loadingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  loadingSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  errorIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.dangerBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  errorIconText: {
    fontSize: 28,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.danger,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  retryButton: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.md,
  },
  retryButtonText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl,
    gap: SPACING.sm,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: SPACING.xs,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
  },
  emptyAction: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  emptyActionText: {
    color: COLORS.background,
    fontSize: 13,
    fontWeight: 'bold',
  },
  offlineBanner: {
    backgroundColor: COLORS.warningBg,
    borderColor: COLORS.warning,
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    marginBottom: SPACING.sm,
  },
  offlineBannerText: {
    color: COLORS.warningLight,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
