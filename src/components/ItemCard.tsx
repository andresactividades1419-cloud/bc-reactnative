// ============================================================
// COMPONENT: ItemCard (EventCard)
// Dominio: Productora de Eventos
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
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';

interface ItemCardProps {
  item: EventItem;
  onPress: (item: EventItem) => void;
}

export const ItemCard = React.memo(function ItemCard({
  item,
  onPress,
}: ItemCardProps): React.JSX.Element {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.cardContainer,
        pressed && styles.cardPressed,
      ]}
      onPress={() => onPress(item)}
    >
      <Image
        source={{ uri: item.imageUri }}
        style={styles.cardImage}
        resizeMode="cover"
      />

      <View style={styles.cardContent}>
        {/* Header Badges */}
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
                : item.status === 'Planificación'
                ? styles.statusPlanning
                : styles.statusFinished,
            ]}
          >
            <Text style={styles.statusBadgeText}>{item.status}</Text>
          </View>
        </View>

        {/* Title & Client */}
        <Text style={TYPOGRAPHY.cardTitle}>{item.name}</Text>
        <Text style={TYPOGRAPHY.cardSubtitle}>Cliente: {item.client}</Text>

        {/* Metadata section */}
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

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{item.capacity.toLocaleString()}</Text>
            <Text style={TYPOGRAPHY.caption}>Aforo max</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{item.vendorsCount}</Text>
            <Text style={TYPOGRAPHY.caption}>Proveedores</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{item.staffCount}</Text>
            <Text style={TYPOGRAPHY.caption}>Personal</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerRow}>
          <View>
            <Text style={TYPOGRAPHY.caption}>Presupuesto</Text>
            <Text style={styles.budgetValue}>{item.budget}</Text>
          </View>
          <View style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Gestionar Evento →</Text>
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
  cardPressed: {
    opacity: 0.88,
    borderColor: COLORS.primaryLight,
  },
  cardImage: {
    width: '100%',
    height: 160,
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
  statusFinished: {
    backgroundColor: COLORS.dangerBg,
    borderColor: COLORS.danger,
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: COLORS.primaryLight,
    fontSize: 14,
    fontWeight: 'bold',
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: COLORS.border,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: COLORS.success,
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
