// src/components/FormField.tsx
// Componente genérico y reutilizable que encapsula Controller + TextInput nativo + Error inline.
// Tipado con generics de React Hook Form. El segundo genérico de `Control`
// (TContext) queda como `any` porque así lo tipa la propia librería por defecto;
// no es un casting inseguro sobre datos del dominio.

import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';

import { COLORS, RADIUS, SPACING } from '../theme';

// ──────────────────────────────────────────────────────────
// PROPS DEL COMPONENTE CON GENERICS ESTRICTOS
// ──────────────────────────────────────────────────────────

export interface FormFieldProps<T extends FieldValues> extends TextInputProps {
  control: Control<T, any, any>;
  name: FieldPath<T>;
  label: string;
  errorMessage?: string;
  helperText?: string;
}

// ──────────────────────────────────────────────────────────
// COMPONENTE FORM FIELD
// ──────────────────────────────────────────────────────────

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  errorMessage,
  helperText,
  style,
  ...textInputProps
}: FormFieldProps<T>): React.JSX.Element {
  const hasError = Boolean(errorMessage);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input,
              textInputProps.multiline && styles.inputMultiline,
              hasError && styles.inputError,
              style,
            ]}
            value={value !== undefined && value !== null ? String(value) : ''}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholderTextColor={COLORS.textMuted}
            selectionColor={COLORS.primaryLight}
            {...textInputProps}
          />
        )}
      />

      {/* Mensaje de error inline o texto de ayuda */}
      {hasError ? (
        <Text style={styles.errorText} numberOfLines={2}>
          ⚠️ {errorMessage}
        </Text>
      ) : helperText ? (
        <Text style={styles.helperText} numberOfLines={1}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}

// ──────────────────────────────────────────────────────────
// ESTILOS
// ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: SPACING.sm + 4,
  },
  inputError: {
    borderColor: COLORS.danger,
    backgroundColor: COLORS.dangerBg,
  },
  errorText: {
    fontSize: 11,
    color: COLORS.danger,
    marginTop: 4,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
