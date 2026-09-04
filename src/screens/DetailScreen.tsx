// ============================================================
// SCREEN: DetailScreen — src/screens/DetailScreen.tsx
// Dominio: Productora de Eventos (Pesos Colombianos COP)
// Semana 05: TanStack Query v5 useEventById + Estado Cliente Zustand
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
  ActivityIndicator,
} from 'react-native';
import { DetailScreenProps } from '../navigation/types';
import { useEventById } from '../hooks/useEvents';
import { useEventStore } from '../stores/useEventStore';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';

export function DetailScreen({ route, navigation }: DetailScreenProps): React.JSX.Element {
  const { id, name } = route.params;

  // TanStack Query v5: Consulta del servidor por ID
  const {
    data: event,
    isLoading,
    isError,
    refetch,
    error,
  } = useEventById(id);

  // Zustand Store: Estado global del cliente para guardar/destacar
  const isSaved = useEventStore((state) =>
    event ? state.savedEvents.some((evt) => evt.id === event.id) : false
  );
  const toggleSaveEvent = useEventStore((state) => state.toggleSaveEvent);

  // ── ESTADO 1: CARGANDO DETALLE (Loading State) ─────────────
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primaryLight} />
          <Text style={styles.loadingText}>Cargando ficha técnica del evento...</Text>
          <Text style={styles.loadingSubtext}>Consultando API REST con useQuery</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── ESTADO 2: ERROR DE RED AL CARGAR DETALLE (Error State) ──
  if (isError || !event) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
        <View style={styles.centered}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Error al cargar producción</Text>
          <Text style={styles.errorSubtext}>
            {error?.message || 'No fue posible obtener la información del servidor.'}
          </Text>
          <View style={styles.errorButtonsRow}>
            <Pressable style={styles.retryButton} onPress={() => refetch()}>
              <Text style={styles.retryButtonText}>🔄 Reintentar</Text>
            </Pressable>
            <Pressable style={styles.backOutlineButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backOutlineButtonText}>← Volver</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── ESTADO 3: DETALLE COMPLETO DEL SERVIDOR ────────────────
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
          <View style={styles.networkBadge}>
            <Text style={styles.networkBadgeText}>API SYNCHRONIZED</Text>
          </View>
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

            {/* Botón interactivo de Zustand: Guardar / Quitar de Destacados */}
            <Pressable
              style={[styles.saveButton, isSaved && styles.saveButtonActive]}
              onPress={() => toggleSaveEvent(event)}
            >
              <Text style={styles.saveButtonText}>
                {isSaved ? '⭐ Quitar de Destacados' : '☆ Guardar en Destacados'}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.title}>{event.name || name}</Text>
          <Text style={styles.client}>Cliente: {event.client}</Text>

          <View style={styles.divider} />

          {/* Sección de Descripción */}
          <Text style={styles.sectionHeader}>📋 Ficha Técnica & Descripción</Text>
          <Text style={styles.descriptionText}>{event.description}</Text>

          {/* Grid de Metadatos */}
          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>📅 FECHA PROGRAMADA</Text>
              <Text style={styles.gridValue}>{event.date}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>📍 LOCACIÓN / CIUDAD</Text>
              <Text style={styles.gridValue}>{event.location}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>💰 PRESUPUESTO OFICIAL (COP)</Text>
              <Text style={styles.budgetValue}>{event.budget}</Text>
            </View>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>👥 AFORO MÁXIMO PROYECTADO</Text>
              <Text style={styles.gridValue}>
                {event.capacity ? event.capacity.toLocaleString('es-CO') : '500'} personas
              </Text>
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
  networkBadge: {
    position: 'absolute',
    bottom: SPACING.sm,
    right: SPACING.md,
    backgroundColor: 'rgba(31, 111, 235, 0.85)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
  networkBadgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    gap: SPACING.sm,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  loadingSubtext: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  errorIcon: {
    fontSize: 32,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.danger,
  },
  errorSubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  errorButtonsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  retryButton: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  retryButtonText: {
    color: COLORS.background,
    fontSize: 13,
    fontWeight: 'bold',
  },
  backOutlineButton: {
    borderColor: COLORS.borderLight,
    borderWidth: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  backOutlineButtonText: {
    color: COLORS.textPrimary,
    fontSize: 13,
  },
});
