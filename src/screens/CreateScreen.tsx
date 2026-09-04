// ============================================================
// SCREEN: CreateScreen — src/screens/CreateScreen.tsx
// Dominio: Productora de Eventos (Pesos Colombianos COP)
// TanStack Query v5 useMutation + Axios POST
// ============================================================

import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native';
import { CreateScreenProps } from '../navigation/types';
import { useCreateEvent } from '../hooks/useEvents';
import { EventCategory, EventStatus } from '../types';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

const CATEGORIES: Exclude<EventCategory, 'Todos'>[] = [
  'Concierto',
  'Boda',
  'Conferencia',
  'Corporativo',
  'Festival',
];

export function CreateScreen({ navigation }: CreateScreenProps): React.JSX.Element {
  // Formulario del dominio de Productora de Eventos
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [category, setCategory] = useState<Exclude<EventCategory, 'Todos'>>('Concierto');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  // Hook TanStack Query v5: useMutation para POST
  const { mutate: createEvent, isPending } = useCreateEvent();

  // Función para formatear presupuesto a COP si el usuario escribe sólo números
  const handleBudgetBlur = () => {
    const rawNumber = budget.replace(/[^0-9]/g, '');
    if (rawNumber) {
      const formatted = Number(rawNumber).toLocaleString('es-CO');
      setBudget(`$ ${formatted} COP`);
    }
  };

  const handleSubmit = (): void => {
    if (!name.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa el nombre de la producción.');
      return;
    }
    if (!client.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa el cliente contratante.');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa la locación del evento.');
      return;
    }

    // Normalizar presupuesto a COP si no tiene formato
    let finalBudget = budget.trim();
    if (!finalBudget) {
      finalBudget = '$ 50.000.000 COP';
    } else if (!finalBudget.includes('COP')) {
      const rawNumber = finalBudget.replace(/[^0-9]/g, '');
      const formatted = rawNumber ? Number(rawNumber).toLocaleString('es-CO') : '50.000.000';
      finalBudget = `$ ${formatted} COP`;
    }

    const payload = {
      name: name.trim(),
      client: client.trim(),
      category,
      date: date.trim() || 'Fecha por definir, 2026',
      location: location.trim(),
      budget: finalBudget,
      capacity: Number(capacity.replace(/[^0-9]/g, '')) || 500,
      imageUri: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
      status: 'Planificación' as EventStatus,
      vendorsCount: 4,
      staffCount: 12,
      description: description.trim() || 'Producción y montaje técnico gestionado por Productora de Eventos.',
      contactPerson: contactPerson.trim() || 'Coordinación Logística',
      contactEmail: contactEmail.trim() || 'contacto@eventos.co',
    };

    // Invocar useMutation de TanStack Query
    createEvent(payload, {
      onSuccess: () => {
        // La mutación invalida ['events'] automáticamente y volvemos a la lista
        navigation.goBack();
      },
      onError: (err) => {
        Alert.alert('Error al crear', `No se pudo registrar la producción: ${err.message}`);
      },
    });
  };

  const canSubmit = name.trim().length > 0 && client.trim().length > 0 && !isPending;

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.badge}>TANSTACK QUERY v5 • USEMUTATION</Text>
          <Text style={styles.title}>Nueva Producción de Evento</Text>
          <Text style={styles.subtitle}>
            Registra una nueva cotización y montaje en Pesos Colombianos (COP)
          </Text>
        </View>

        {/* Nombre del Evento */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Nombre del Evento <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Ej: Festival de Verano 2026"
            placeholderTextColor={COLORS.textMuted}
            editable={!isPending}
          />
        </View>

        {/* Cliente Contratante */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Cliente / Empresa Contratante <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={client}
            onChangeText={setClient}
            placeholder="Ej: Bancolombia, Sony Music, etc."
            placeholderTextColor={COLORS.textMuted}
            editable={!isPending}
          />
        </View>

        {/* Categoría */}
        <View style={styles.field}>
          <Text style={styles.label}>Categoría del Evento</Text>
          <View style={styles.categoriesRow}>
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat;
              return (
                <Pressable
                  key={cat}
                  style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                  onPress={() => setCategory(cat)}
                  disabled={isPending}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      isSelected && styles.categoryChipTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Presupuesto en COP */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Presupuesto en Pesos Colombianos (COP) <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={budget}
            onChangeText={setBudget}
            onBlur={handleBudgetBlur}
            placeholder="Ej: $ 150.000.000 COP"
            placeholderTextColor={COLORS.textMuted}
            keyboardType="numeric"
            editable={!isPending}
          />
          <Text style={styles.hint}>Se formateará automáticamente con formato COP.</Text>
        </View>

        {/* Locación */}
        <View style={styles.field}>
          <Text style={styles.label}>
            Locación / Ciudad <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Ej: Movistar Arena, Bogotá"
            placeholderTextColor={COLORS.textMuted}
            editable={!isPending}
          />
        </View>

        {/* Aforo y Fecha */}
        <View style={styles.row}>
          <View style={[styles.field, styles.flexOne]}>
            <Text style={styles.label}>Aforo Estimado</Text>
            <TextInput
              style={styles.input}
              value={capacity}
              onChangeText={setCapacity}
              placeholder="Ej: 5000"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="number-pad"
              editable={!isPending}
            />
          </View>
          <View style={[styles.field, styles.flexOne]}>
            <Text style={styles.label}>Fecha Tentativa</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="Ej: 18 Dic, 2026"
              placeholderTextColor={COLORS.textMuted}
              editable={!isPending}
            />
          </View>
        </View>

        {/* Contacto Responsable */}
        <View style={styles.row}>
          <View style={[styles.field, styles.flexOne]}>
            <Text style={styles.label}>Responsable Logístico</Text>
            <TextInput
              style={styles.input}
              value={contactPerson}
              onChangeText={setContactPerson}
              placeholder="Ej: Laura Vargas"
              placeholderTextColor={COLORS.textMuted}
              editable={!isPending}
            />
          </View>
          <View style={[styles.field, styles.flexOne]}>
            <Text style={styles.label}>Email de Contacto</Text>
            <TextInput
              style={styles.input}
              value={contactEmail}
              onChangeText={setContactEmail}
              placeholder="contacto@empresa.co"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="email-address"
              editable={!isPending}
            />
          </View>
        </View>

        {/* Descripción / Ficha Técnica */}
        <View style={styles.field}>
          <Text style={styles.label}>Descripción & Requerimientos Técnicos</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Detalles sobre sonido, luces, pantallas LED, permisos, catering..."
            placeholderTextColor={COLORS.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!isPending}
          />
        </View>

        {/* Botón de Envío con useMutation */}
        <Pressable
          style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
        >
          {isPending ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={COLORS.background} />
              <Text style={styles.submitButtonText}>Registrando Producción...</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>🚀 Crear Producción (POST)</Text>
          )}
        </Pressable>

        {/* Botón Cancelar */}
        <Pressable
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={isPending}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.lg,
    gap: SPACING.md,
    paddingBottom: SPACING.xxl * 2,
  },
  header: {
    marginBottom: SPACING.sm,
  },
  badge: {
    color: COLORS.primaryLight,
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  title: {
    ...TYPOGRAPHY.headerTitle,
    fontSize: 22,
  },
  subtitle: {
    ...TYPOGRAPHY.headerSubtitle,
    marginTop: 2,
  },
  field: {
    gap: SPACING.xs,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  flexOne: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  required: {
    color: COLORS.danger,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  textArea: {
    minHeight: 90,
  },
  hint: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs + 2,
  },
  categoryChip: {
    backgroundColor: COLORS.surfaceLight,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs + 1,
  },
  categoryChipSelected: {
    backgroundColor: COLORS.primaryBg,
    borderColor: COLORS.primaryLight,
  },
  categoryChipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  categoryChipTextSelected: {
    color: COLORS.primaryLight,
  },
  submitButton: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  submitButtonDisabled: {
    opacity: 0.45,
    backgroundColor: COLORS.borderLight,
  },
  submitButtonText: {
    color: COLORS.background,
    fontSize: 15,
    fontWeight: 'bold',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
