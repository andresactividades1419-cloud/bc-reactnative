// ============================================================
// SCREEN: EditScreen — src/screens/EditScreen.tsx
// Dominio: Productora de Eventos (Pesos Colombianos COP)
// React Hook Form + Zod Resolver + TanStack Query useUpdateEvent
// ============================================================

import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { EditScreenProps } from '../navigation/types';
import { useEventById, useUpdateEvent } from '../hooks/useEvents';
import { eventSchema, EventFormData, EventFormInput, EVENT_CATEGORIES } from '../schemas/eventSchema';
import { FormField } from '../components/FormField';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../theme';

export function EditScreen({ route, navigation }: EditScreenProps): React.JSX.Element {
  const { id } = route.params;

  // 1. Cargar datos del evento existente desde TanStack Query
  const { data: event, isLoading: isLoadingData, isError } = useEventById(id);

  // 2. Hook de mutación para actualizar vía HTTP PUT
  const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent();

  // 3. Inicializar React Hook Form con validación de Zod
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EventFormInput, any, EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: '',
      client: '',
      category: 'Concierto',
      date: '',
      location: '',
      budget: 0,
      capacity: 0,
      description: '',
    },
  });

  // 4. Patrón clave de la semana: reset() dentro de useEffect cuando los datos cargan
  useEffect(() => {
    if (event) {
      // Extraer valor numérico del presupuesto COP
      const rawBudget =
        typeof event.budget === 'string'
          ? Number(event.budget.replace(/[^0-9]/g, '')) || 0
          : event.budget;

      reset({
        name: event.name,
        client: event.client,
        category: (EVENT_CATEGORIES.includes(event.category as (typeof EVENT_CATEGORIES)[number])
          ? event.category
          : 'Concierto') as EventFormData['category'],
        date: event.date,
        location: event.location,
        budget: rawBudget,
        capacity: event.capacity,
        description: event.description || '',
      });
    }
  }, [event, reset]);

  // 5. Envío del formulario validado
  const onSubmit = (formData: EventFormData): void => {
    const formattedBudget = `$ ${Number(formData.budget).toLocaleString('es-CO')} COP`;

    updateEvent(
      {
        id,
        payload: {
          name: formData.name.trim(),
          client: formData.client.trim(),
          category: formData.category,
          date: formData.date.trim(),
          location: formData.location.trim(),
          budget: formattedBudget,
          capacity: formData.capacity,
          description: formData.description?.trim() || '',
        },
      },
      {
        onSuccess: () => {
          Alert.alert('¡Éxito!', 'Producción actualizada correctamente.', [
            { text: 'Aceptar', onPress: () => navigation.goBack() },
          ]);
        },
        onError: (err) => {
          Alert.alert('Error al actualizar', `No se pudo guardar los cambios: ${err.message}`);
        },
      }
    );
  };

  const isSaving = isSubmitting || isUpdating;
  const canSubmit = !isSaving && isDirty;

  if (isLoadingData) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primaryLight} />
        <Text style={styles.loadingText}>Cargando datos de la producción...</Text>
      </View>
    );
  }

  if (isError || !event) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No se pudo cargar la información del evento.</Text>
        <Pressable style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Cabecera */}
        <View style={styles.header}>
          <Text style={styles.badge}>REACT HOOK FORM + ZOD • EDIT</Text>
          <Text style={styles.title}>Editar Producción</Text>
          <Text style={styles.subtitle}>
            Modifica los detalles técnicos y presupuestarios en Pesos Colombianos (COP).
          </Text>
        </View>

        {/* Campo: Nombre */}
        <FormField
          control={control}
          name="name"
          label="Nombre de la Producción *"
          placeholder="Ej: Concierto Rock Fest 2026"
          errorMessage={errors.name?.message}
          editable={!isSaving}
        />

        {/* Campo: Cliente */}
        <FormField
          control={control}
          name="client"
          label="Cliente / Empresa Contratante *"
          placeholder="Ej: Sony Music Colombia"
          errorMessage={errors.client?.message}
          editable={!isSaving}
        />

        {/* Selector de Categoría con Controller */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Categoría de Producción *</Text>
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <View style={styles.categoriesRow}>
                {EVENT_CATEGORIES.map((cat) => {
                  const isSelected = value === cat;
                  return (
                    <Pressable
                      key={cat}
                      style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                      onPress={() => onChange(cat)}
                      disabled={isSaving}
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
            )}
          />
          {errors.category?.message ? (
            <Text style={styles.errorInline}>⚠️ {errors.category.message}</Text>
          ) : null}
        </View>

        {/* Campo: Presupuesto en COP */}
        <FormField
          control={control}
          name="budget"
          label="Presupuesto en COP (Pesos Colombianos) *"
          placeholder="Ej: 150000000"
          helperText="Ingresa el valor numérico en COP (mínimo $ 100.000 COP)"
          keyboardType="numeric"
          errorMessage={errors.budget?.message}
          editable={!isSaving}
        />

        {/* Campo: Aforo */}
        <FormField
          control={control}
          name="capacity"
          label="Aforo Máximo Estimado *"
          placeholder="Ej: 8000"
          keyboardType="number-pad"
          errorMessage={errors.capacity?.message}
          editable={!isSaving}
        />

        {/* Campo: Fecha */}
        <FormField
          control={control}
          name="date"
          label="Fecha Programada *"
          placeholder="Ej: 2026-11-20"
          errorMessage={errors.date?.message}
          editable={!isSaving}
        />

        {/* Campo: Locación */}
        <FormField
          control={control}
          name="location"
          label="Locación / Recinto *"
          placeholder="Ej: Movistar Arena Bogotá"
          errorMessage={errors.location?.message}
          editable={!isSaving}
        />

        {/* Campo: Descripción técnica */}
        <FormField
          control={control}
          name="description"
          label="Ficha Técnica & Requerimientos"
          placeholder="Especificaciones de tarima, pantallas LED, iluminación..."
          multiline
          numberOfLines={4}
          errorMessage={errors.description?.message}
          editable={!isSaving}
        />

        {/* Botones de acción */}
        <View style={styles.actions}>
          <Pressable
            style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={!canSubmit}
          >
            {isSaving ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color={COLORS.background} />
                <Text style={styles.submitButtonText}>Guardando Cambios...</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>💾 Guardar Cambios (PUT)</Text>
            )}
          </Pressable>

          <Pressable
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={isSaving}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl * 2,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  loadingText: {
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    fontSize: 14,
  },
  header: {
    marginBottom: SPACING.lg,
  },
  badge: {
    color: COLORS.warning,
    fontSize: 11,
    fontWeight: 'bold',
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
  fieldContainer: {
    marginBottom: SPACING.md,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: SPACING.xs,
  },
  categoriesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs + 2,
  },
  categoryChip: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm + 4,
    paddingVertical: SPACING.xs + 2,
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
  errorInline: {
    fontSize: 11,
    color: COLORS.danger,
    marginTop: 4,
    fontWeight: '500',
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 14,
    textAlign: 'center',
  },
  actions: {
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  submitButton: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
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
