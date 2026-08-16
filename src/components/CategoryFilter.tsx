// ============================================================
// COMPONENT: CategoryFilter
// Dominio: Productora de Eventos
// ============================================================

import React from 'react';
import {
  ScrollView,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { EventCategory } from '../types';
import { COLORS, SPACING, RADIUS } from '../theme';

const CATEGORIES: EventCategory[] = [
  'Todos',
  'Concierto',
  'Boda',
  'Conferencia',
  'Corporativo',
  'Festival',
];

interface CategoryFilterProps {
  selectedCategory: EventCategory;
  onSelectCategory: (category: EventCategory) => void;
}

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps): React.JSX.Element {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollContainer}
      contentContainerStyle={styles.contentContainer}
    >
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <Pressable
            key={cat}
            style={[
              styles.pill,
              isSelected ? styles.pillSelected : styles.pillUnselected,
            ]}
            onPress={() => onSelectCategory(cat)}
          >
            <Text
              style={[
                styles.pillText,
                isSelected ? styles.pillTextSelected : styles.pillTextUnselected,
              ]}
            >
              {cat}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    maxHeight: 40,
    marginBottom: SPACING.md,
  },
  contentContainer: {
    paddingRight: SPACING.lg,
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.full,
    marginRight: SPACING.sm,
    borderWidth: 1,
  },
  pillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryLight,
  },
  pillUnselected: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  pillTextSelected: {
    color: COLORS.white,
  },
  pillTextUnselected: {
    color: COLORS.textSecondary,
  },
});
