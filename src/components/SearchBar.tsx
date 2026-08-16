// ============================================================
// COMPONENT: SearchBar
// Dominio: Productora de Eventos
// ============================================================

import React from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Buscar evento por nombre, cliente o lugar...',
  onClear,
}: SearchBarProps): React.JSX.Element {
  function handleClear(): void {
    onChangeText('');
    if (onClear) {
      onClear();
    }
    Keyboard.dismiss();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <Pressable style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearButtonText}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48,
    marginBottom: SPACING.md,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    height: '100%',
  },
  clearButton: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: RADIUS.full,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  clearButtonText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
  },
});
