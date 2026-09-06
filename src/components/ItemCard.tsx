// ============================================================
// COMPONENT: ItemCard (EventCard)
// Dominio: Productora de Eventos (Semana 04 - Zustand)
// ============================================================

import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import { EventItem } from '../types';
import { useEventStore } from '../stores/useEventStore';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';

interface ItemCardProps {
  item: EventItem;
  onPress: (item: EventItem) => void;
  compact?: boolean;
}

export const ItemCard = React.memo(function ItemCard({
  item,
  onPress,
  compact = false,
}: ItemCardProps): React.JSX.Element {
  // Selector Zustand para verificar si está en la lista de destacados
  const isSaved = useEventStore((state) =>
    state.savedEvents.some((evt) => evt.id === item.id)
  );
  const toggleSaveEvent = useEventStore((state) => state.toggleSaveEvent);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.cardContainer,
        compact && styles.cardContainerCompact,
        pressed && styles.cardPressed,
      ]}
      onPress={() => onPress(item)}
    >
      {!compact && (
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: item.imageUri }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          {/* Botón rápido de Zustand sobre la imagen */}
          <Pressable
            style={[styles.bookmarkBadge, isSaved && styles.bookmarkBadgeActive]}
            onPress={(e) => {
              e.stopPropagation();
              toggleSaveEvent(item);
            }}
          >
            <Text style={styles.bookmarkBadgeText}>
              {isSaved ? '⭐ Guardado' : '☆ Guardar'}
            </Text>
          </Pressable>
        </View>
      )}

      <View style={styles.cardContent}>
        <View style={styles.badgesRow}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.category}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              item.status === 'En Producción'
                ? styles.statusInProduction
                : item.status === 'Confirmado'
                ? styles.statusConfirmed
                : styles.statusPlanning,
            ]}
          >
            <Text style={styles.statusBadgeText}>{item.status}</Text>
          </View>
        </View>

        <Text style={TYPOGRAPHY.cardTitle}>{item.name}</Text>
        <Text style={TYPOGRAPHY.cardSubtitle}>Cliente: {item.client}</Text>

        <View style={styles.metadataContainer}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>📅 Fecha:</Text>
            <Text style={TYPOGRAPHY.body}>{item.date}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>📍 Lugar:</Text>
            <Text style={[TYPOGRAPHY.body, styles.flexOne]} numberOfLines={1}>
              {item.location}
            </Text>
          </View>
        </View>

        <View style={styles.footerRow}>
          <View>
            <Text style={TYPOGRAPHY.caption}>Presupuesto (COP)</Text>
            <Text style={styles.budgetValue}>{item.budget}</Text>
          </View>
          <View style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Ver Ficha →</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderColor: COLORS.border,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardContainerCompact: {
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.md,
  },
  cardPressed: {
    opacity: 0.88,
    borderColor: COLORS.primaryLight,
  },
  imageWrapper: {
    width: '100%',
    height: 160,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  bookmarkBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(13, 17, 23, 0.85)',
    borderColor: COLORS.border,
    borderWidth: 1,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  bookmarkBadgeActive: {
    backgroundColor: COLORS.warningBg,
    borderColor: COLORS.warning,
  },
  bookmarkBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: SPACING.lg,
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryBadge: {
    backgroundColor: COLORS.primaryBg,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  categoryBadgeText: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusBadge: {
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderWidth: 1,
  },
  statusInProduction: {
    backgroundColor: COLORS.warningBg,
    borderColor: COLORS.warning,
  },
  statusConfirmed: {
    backgroundColor: COLORS.successBg,
    borderColor: COLORS.success,
  },
  statusPlanning: {
    backgroundColor: COLORS.surfaceLight,
    borderColor: COLORS.borderLight,
  },
  statusBadgeText: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '600',
  },
  metadataContainer: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.sm + 2,
    marginVertical: SPACING.md,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  metaLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    width: 75,
    fontWeight: '600',
  },
  flexOne: {
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.surfaceLight,
  },
  budgetValue: {
    color: COLORS.successLight,
    fontSize: 15,
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
});
