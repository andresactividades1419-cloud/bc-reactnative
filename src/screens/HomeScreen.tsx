// ============================================================
// SCREEN: HomeScreen
// Dominio: Productora de Eventos (Semana 02)
// ============================================================

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  RefreshControl,
  Alert,
  ListRenderItemInfo,
} from 'react-native';
import { EventItem, EventCategory } from '../types';
import { MOCK_EVENTS } from '../data/mockData';
import { ItemCard } from '../components/ItemCard';
import { SearchBar } from '../components/SearchBar';
import { CategoryFilter } from '../components/CategoryFilter';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';

export function HomeScreen(): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('Todos');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // 1. Filtrado en tiempo real con useMemo
  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter((event) => {
      const matchesSearch =
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'Todos' || event.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // 2. Callback para selección de item
  const handleEventPress = useCallback((event: EventItem) => {
    Keyboard.dismiss();
    Alert.alert(
      `🎉 ${event.name}`,
      `Cliente: ${event.client}\nCategoría: ${event.category}\nFecha: ${event.date}\nLugar: ${event.location}\nPresupuesto: ${event.budget}`,
      [{ text: 'Entendido', style: 'default' }]
    );
  }, []);

  // 3. Callback renderItem optimizado para FlatList
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<EventItem>) => (
      <ItemCard item={item} onPress={handleEventPress} />
    ),
    [handleEventPress]
  );

  // 4. KeyExtractor por ID
  const keyExtractor = useCallback((item: EventItem) => item.id, []);

  // 5. Separador entre items
  const renderSeparator = useCallback(
    () => <View style={styles.separator} />,
    []
  );

  // 6. Callback ListEmptyComponent
  const renderEmptyComponent = useCallback(() => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🔍</Text>
        <Text style={styles.emptyTitle}>No se encontraron eventos</Text>
        <Text style={styles.emptySubtitle}>
          Intenta buscar con otro nombre, cliente o selecciona otra categoría.
        </Text>
      </View>
    );
  }, []);

  // 7. Pull to Refresh handler
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={TYPOGRAPHY.headerTitle}>Productora de Eventos</Text>
            <Text style={TYPOGRAPHY.headerSubtitle}>
              Búsqueda y gestión de producciones en tiempo real
            </Text>
          </View>

          {/* Contenido principal */}
          <View style={styles.content}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Buscar evento, cliente o lugar..."
            />

            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* Contador de resultados */}
            <View style={styles.resultsBar}>
              <Text style={TYPOGRAPHY.caption}>
                Mostrando {filteredEvents.length} de {MOCK_EVENTS.length} eventos
              </Text>
              {searchQuery.length > 0 && (
                <Text style={styles.activeFilterBadge}>Filtro activo</Text>
              )}
            </View>

            {/* FlatList con virtualización */}
            <FlatList
              data={filteredEvents}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              ItemSeparatorComponent={renderSeparator}
              ListEmptyComponent={renderEmptyComponent}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor={COLORS.primaryLight}
                  colors={[COLORS.primaryLight]}
                />
              }
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  badge: {
    color: COLORS.successLight,
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  activeFilterBadge: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '600',
  },
  separator: {
    height: SPACING.md,
  },
  listContent: {
    paddingBottom: SPACING.xxl,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl * 1.5,
    paddingHorizontal: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 42,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
});
