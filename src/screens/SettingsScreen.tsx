// ============================================================
// SCREEN: SettingsScreen — src/screens/SettingsScreen.tsx
// Dominio: Productora de Eventos (Pesos Colombianos COP)
// Persistencia Local: MMKV (Preferencias) + Expo SecureStore (Datos Sensibles)
// ============================================================

import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { usePreferences, SortOrder } from '../hooks/usePreferences';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

// Clave segura para el dato sensible del dominio (PIN de autorización de presupuestos VIP)
const SENSITIVE_KEY = 'producer_vip_auth_pin';
const DEMO_SENSITIVE_PIN = 'VIP-COP-3228970';

export function SettingsScreen(): React.JSX.Element {
  // 1. Preferencias reactivas y síncronas con MMKV
  const {
    sortOrder,
    setSortOrder,
    compactMode,
    setCompactMode,
    itemsPerPage,
    setItemsPerPage,
  } = usePreferences();

  // Estado para el valor enmascarado leído de SecureStore
  const [maskedValue, setMaskedValue] = useState<string | null>(null);

  // 2. Operaciones con Expo SecureStore
  const handleSaveSensitive = async (): Promise<void> => {
    try {
      await SecureStore.setItemAsync(SENSITIVE_KEY, DEMO_SENSITIVE_PIN);
      Alert.alert(
        '🔐 Guardado Seguro',
        'PIN de Autorización VIP guardado exitosamente en el llavero seguro nativo (Keychain / Keystore).'
      );
      setMaskedValue(null);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar en SecureStore: ' + String(error));
    }
  };

  const handleReadSensitive = async (): Promise<void> => {
    try {
      const raw = await SecureStore.getItemAsync(SENSITIVE_KEY);
      if (!raw) {
        Alert.alert('Aviso', 'No hay ningún PIN VIP guardado en SecureStore.');
        setMaskedValue(null);
        return;
      }

      // Regla de oro de la rúbrica: NUNCA mostrar en texto plano, siempre enmascarado
      const visibleSuffix = raw.slice(-4);
      const masked = '••••••••-' + visibleSuffix;
      setMaskedValue(masked);
    } catch (error) {
      Alert.alert('Error', 'No se pudo leer de SecureStore: ' + String(error));
    }
  };

  const handleDeleteSensitive = async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(SENSITIVE_KEY);
      setMaskedValue(null);
      Alert.alert('🗑️ Eliminado', 'PIN de Autorización VIP eliminado de SecureStore.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo eliminar de SecureStore: ' + String(error));
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ──────────────────────────────────────────────────────────
          SECCIÓN 1: MMKV — PREFERENCIAS REACTIVAS SÍNCRONAS
      ────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.badge}>MMKV • ALMACENAMIENTO SÍNCRONO VÍA JSI</Text>
        <Text style={styles.title}>Preferencias de la App</Text>
        <Text style={styles.subtitle}>
          Estos valores persisten en tiempo real en MMKV sin async/await y sin necesidad de pulsar "Guardar".
        </Text>
      </View>

      {/* Preferencia: Modo Compacto */}
      <View style={styles.row}>
        <View style={styles.rowInfo}>
          <Text style={styles.rowLabel}>Modo Compacto</Text>
          <Text style={styles.rowDesc}>
            Muestra tarjetas condensadas para navegar más rápido en el catálogo de eventos
          </Text>
        </View>
        <Switch
          value={compactMode}
          onValueChange={setCompactMode}
          trackColor={{ false: COLORS.border, true: COLORS.primaryLight }}
          thumbColor={compactMode ? COLORS.primary : COLORS.textMuted}
        />
      </View>

      {/* Preferencia: Orden de la Lista */}
      <View style={[styles.row, styles.rowColumn]}>
        <Text style={styles.rowLabel}>Orden Alfabético de Producciones</Text>
        <View style={styles.segmented}>
          {(['asc', 'desc'] as const).map((opt: SortOrder) => {
            const isActive = sortOrder === opt;
            return (
              <Pressable
                key={opt}
                style={[styles.segment, isActive && styles.segmentActive]}
                onPress={() => setSortOrder(opt)}
              >
                <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                  {opt === 'asc' ? 'A → Z (Ascendente)' : 'Z → A (Descendente)'}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.rowDesc}>
          Valor activo en MMKV: <Text style={styles.mono}>{sortOrder}</Text>
        </Text>
      </View>

      {/* Preferencia: Producciones por Página */}
      <View style={[styles.row, styles.rowColumn]}>
        <Text style={styles.rowLabel}>Producciones Visibles por Página</Text>
        <View style={styles.segmented}>
          {([5, 10, 20] as const).map((count) => {
            const isActive = itemsPerPage === count;
            return (
              <Pressable
                key={count}
                style={[styles.segment, isActive && styles.segmentActive]}
                onPress={() => setItemsPerPage(count)}
              >
                <Text style={[styles.segmentText, isActive && styles.segmentTextActive]}>
                  {count} eventos
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.rowDesc}>
          Límite activo en MMKV: <Text style={styles.mono}>{itemsPerPage}</Text>
        </Text>
      </View>

      {/* ──────────────────────────────────────────────────────────
          SECCIÓN 2: EXPO SECURESTORE — DATOS SENSIBLES ENCRIPTADOS
      ────────────────────────────────────────────────────────── */}
      <View style={styles.separator} />

      <View style={styles.header}>
        <Text style={[styles.badge, { color: COLORS.warningLight }]}>
          EXPO SECURESTORE • CIFRADO HARDWARE
        </Text>
        <Text style={styles.title}>Credenciales y Seguridad VIP</Text>
        <Text style={styles.subtitle}>
          SecureStore cifra los datos con cifrado por hardware en iOS Keychain o Android Keystore.
        </Text>
      </View>

      <View style={styles.secureCard}>
        <Text style={styles.secureCardTitle}>
          PIN de Autorización de Presupuestos VIP (COP)
        </Text>
        <Text style={styles.rowDesc}>
          Clave de almacenamiento seguro: <Text style={styles.mono}>{SENSITIVE_KEY}</Text>
        </Text>

        {maskedValue && (
          <View style={styles.maskedContainer}>
            <Text style={styles.maskedLabel}>Token recuperado (enmascarado):</Text>
            <Text style={styles.maskedValue}>{maskedValue}</Text>
          </View>
        )}

        <View style={styles.secureActions}>
          <Pressable style={styles.btnSecure} onPress={handleSaveSensitive}>
            <Text style={styles.btnSecureText}>💾 Guardar PIN</Text>
          </Pressable>
          <Pressable
            style={[styles.btnSecure, styles.btnSecureAlt]}
            onPress={handleReadSensitive}
          >
            <Text style={[styles.btnSecureText, { color: COLORS.primaryLight }]}>
              🔍 Leer PIN
            </Text>
          </Pressable>
          <Pressable
            style={[styles.btnSecure, styles.btnDanger]}
            onPress={handleDeleteSensitive}
          >
            <Text style={[styles.btnSecureText, { color: COLORS.danger }]}>
              🗑️ Eliminar
            </Text>
          </Pressable>
        </View>
      </View>

      {/* ──────────────────────────────────────────────────────────
          SECCIÓN 3: CAJA PEDAGÓGICA DE STORAGE LAYERS
      ────────────────────────────────────────────────────────── */}
      <View style={styles.infoBox}>
        <Text style={styles.infoBoxTitle}>💡 Arquitectura de Almacenamiento Local:</Text>
        <Text style={styles.infoBoxText}>
          • <Text style={styles.bold}>MMKV:</Text> Preferencias y switches de UI (síncrono, acceso C++ directo vía JSI sin serialización JSON pesada).{'\n'}
          • <Text style={styles.bold}>AsyncStorage:</Text> Caché de catálogo y respuestas de red (asíncrono, apto para estructuras JSON grandes).{'\n'}
          • <Text style={styles.bold}>SecureStore:</Text> Tokens de autenticación, JWTs y PINs (encriptado por hardware en Keychain/Keystore).
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl * 2,
    gap: SPACING.md,
  },
  header: {
    marginBottom: SPACING.xs,
  },
  badge: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primaryLight,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    ...TYPOGRAPHY.headerTitle,
    fontSize: 22,
  },
  subtitle: {
    ...TYPOGRAPHY.headerSubtitle,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  rowColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  rowInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  rowDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  mono: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: COLORS.primaryLight,
    fontWeight: 'bold',
  },
  segmented: {
    flexDirection: 'row',
    gap: SPACING.xs + 2,
    width: '100%',
  },
  segment: {
    flex: 1,
    backgroundColor: COLORS.surfaceLight,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: COLORS.primaryBg,
    borderColor: COLORS.primaryLight,
  },
  segmentText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: COLORS.primaryLight,
    fontWeight: 'bold',
  },
  secureCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  secureCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  maskedContainer: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.sm,
    padding: SPACING.sm + 2,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warning,
  },
  maskedLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  maskedValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.warningLight,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  secureActions: {
    flexDirection: 'row',
    gap: SPACING.xs + 2,
    marginTop: SPACING.xs,
  },
  btnSecure: {
    flex: 1,
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecureAlt: {
    backgroundColor: COLORS.primaryBg,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  btnDanger: {
    backgroundColor: COLORS.dangerBg,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  btnSecureText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  infoBox: {
    backgroundColor: COLORS.surface,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginTop: SPACING.sm,
  },
  infoBoxTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  infoBoxText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  bold: {
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
});
