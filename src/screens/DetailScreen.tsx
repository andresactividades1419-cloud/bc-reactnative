// ============================================================
// SCREEN: DetailScreen
// Dominio: Productora de Eventos (Semana 04 - Zustand)
// ============================================================

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { DetailScreenProps } from '../navigation/types';
import { MOCK_EVENTS } from '../data/mockData';
import { useEventStore } from '../stores/useEventStore';
import { COLORS, SPACING, RADIUS } from '../theme';

export function DetailScreen({ route, navigation }: DetailScreenProps): React.JSX.Element {
  const { id, name } = route.params;

  // Buscar el evento por ID
  const event = MOCK_EVENTS.find((evt) => evt.id === id) || {
    id,
    name: name || 'Evento No Encontrado',
    client: 'Desconocido',
    category: 'Corporativo' as const,
    date: 'Sin fecha',
    location: 'Sin ubicación',
    budget: '$ 0 COP',
    capacity: 0,
    imageUri: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    status: 'Planificación' as const,
    vendorsCount: 0,
    staffCount: 0,
    description: 'No hay descripción disponible para este evento.',
    contactPerson: 'No asignado',
    contactEmail: 'contacto@eventos.co',
  };

  // Selector y acción de Zustand
  const isSaved = useEventStore((state) =>
    state.savedEvents.some((evt) => evt.id === event.id)
  );
  const toggleSaveEvent = useEventStore((state) => state.toggleSaveEvent);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Imagen de portada */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: event.imageUri }} style={styles.image} resizeMode="cover" />
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Volver</Text>
          </Pressable>
        </View>

        {/* Ficha del evento */}
        <View style={styles.body}>
          <View style={styles.topRow}>
            <View style={styles.badgesRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{event.category}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>{event.status}</Text>
              </View>
            </View>

            {/* Botón principal de Zustand: Agregar / Quitar de Destacados */}
            <Pressable
              style={[styles.saveButton, isSaved && styles.saveButtonActive]}
              onPress={() => toggleSaveEvent(event)}
            >
              <Text style={styles.saveButtonText}>
                {isSaved ? '⭐ Quitar de Destacados' : '☆ Guardar en Destacados'}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.title}>{event.name}</Text>
          <Text style={styles.client}>Cliente: {event.client}</Text>

          <View style={styles.divider} />

          {/* Sección de Descripción */}
          <Text style={styles.sectionHeader}>📋 Ficha Técnica & Descripción</Text>
          <Text style={styles.descriptionText}>{event.description}</Text>

          {/* Grid de Metadatos */}
          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>📅 FECHA</Text>
              <Text style={styles.gridValue}>{event.date}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>📍 LOCACIÓN</Text>
              <Text style={styles.gridValue}>{event.location}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>💰 PRESUPUESTO (COP)</Text>
              <Text style={styles.budgetValue}>{event.budget}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>👥 AFORO MÁXIMO</Text>
              <Text style={styles.gridValue}>{event.capacity.toLocaleString()} personas</Text>
            </View>
          </View>

          {/* Logística y Personal */}
          <Text style={styles.sectionHeader}>🛠️ Logística y Operación</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{event.vendorsCount}</Text>
              <Text style={styles.statLabel}>Proveedores Activos</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{event.staffCount}</Text>
              <Text style={styles.statLabel}>Personal de Logística</Text>
            </View>
          </View>

          {/* Contacto Responsable */}
          <Text style={styles.sectionHeader}>👤 Responsable del Evento</Text>
          <View style={styles.contactCard}>
            <Text style={styles.contactName}>{event.contactPerson}</Text>
            <Text style={styles.contactEmail}>✉️ {event.contactEmail}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  imageContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: SPACING.md,
    left: SPACING.md,
    backgroundColor: 'rgba(13, 17, 23, 0.85)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 13,
  },
  body: {
    padding: SPACING.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
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
    backgroundColor: COLORS.successBg,
    borderColor: COLORS.success,
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  statusBadgeText: {
    color: COLORS.successLight,
    fontSize: 11,
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: COLORS.surfaceLight,
    borderColor: COLORS.borderLight,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
  },
  saveButtonActive: {
    backgroundColor: COLORS.warningBg,
    borderColor: COLORS.warning,
  },
  saveButtonText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  client: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.textValue,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  gridContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  gridItem: {
    gap: 2,
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  gridValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  budgetValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.successLight,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primaryLight,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  contactCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  contactName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  contactEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
});
