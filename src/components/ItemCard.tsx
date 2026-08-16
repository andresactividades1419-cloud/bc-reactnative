import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import { EventItem } from '../types';

interface ItemCardProps {
  item: EventItem;
  onPress: (item: EventItem) => void;
}

export function ItemCard({ item, onPress }: ItemCardProps): React.JSX.Element {
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

        <Text style={styles.titleText}>{item.name}</Text>
        <Text style={styles.clientText}>Cliente: {item.client}</Text>

        <View style={styles.metadataContainer}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>📅 Fecha:</Text>
            <Text style={styles.metaValue}>{item.date}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>📍 LUGAR:</Text>
            <Text style={styles.metaValue}>{item.location}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{item.capacity.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Aforo max</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{item.vendorsCount}</Text>
            <Text style={styles.statLabel}>Proveedores</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{item.staffCount}</Text>
            <Text style={styles.statLabel}>Personal</Text>
          </View>
        </View>

        <View style={styles.footerRow}>
          <View>
            <Text style={styles.budgetLabel}>Presupuesto</Text>
            <Text style={styles.budgetValue}>{item.budget}</Text>
          </View>
          <View style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Gestionar Evento →</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#161b22',
    borderRadius: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#30363d',
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.88,
    borderColor: '#58a6ff',
  },
  cardImage: {
    width: '100%',
    height: 170,
  },
  cardContent: {
    padding: 16,
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: '#1f6feb22',
    borderColor: '#1f6feb',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryBadgeText: {
    color: '#58a6ff',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  statusInProduction: {
    backgroundColor: '#d2992222',
    borderColor: '#d29922',
  },
  statusConfirmed: {
    backgroundColor: '#23863622',
    borderColor: '#238636',
  },
  statusPlanning: {
    backgroundColor: '#8b949e22',
    borderColor: '#8b949e',
  },
  statusBadgeText: {
    color: '#f0f6fc',
    fontSize: 12,
    fontWeight: '600',
  },
  titleText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  clientText: {
    color: '#8b949e',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  metadataContainer: {
    backgroundColor: '#0d1117',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metaLabel: {
    color: '#8b949e',
    fontSize: 13,
    width: 80,
    fontWeight: '600',
  },
  metaValue: {
    color: '#c9d1d9',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#21262d',
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 14,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: '#58a6ff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#8b949e',
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#30363d',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#21262d',
  },
  budgetLabel: {
    color: '#8b949e',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  budgetValue: {
    color: '#3fb950',
    fontSize: 17,
    fontWeight: 'bold',
  },
  actionButton: {
    backgroundColor: '#238636',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
