// src/hooks/usePreferences.ts
// Hook de preferencias del usuario almacenadas de forma síncrona y reactiva con MMKV.
// Dominio: Productora de Eventos

import { useMMKVBoolean, useMMKVNumber, useMMKVString } from 'react-native-mmkv';
import { storage } from '../storage/mmkv';

// ─── Claves de preferencias (evitar strings mágicos) ───────────────────────────
export const PREF_KEYS = {
  SORT_ORDER: 'pref_sortOrder',
  COMPACT_MODE: 'pref_compactMode',
  ITEMS_PER_PAGE: 'pref_itemsPerPage',
} as const;

// ─── Tipo de ordenamiento ─────────────────────────────────────────────────────
export type SortOrder = 'asc' | 'desc';

// ─── Hook principal de preferencias MMKV ─────────────────────────────────────
export function usePreferences() {
  const [sortOrderRaw, setSortOrderRaw] = useMMKVString(PREF_KEYS.SORT_ORDER, storage);
  const [compactModeRaw, setCompactModeRaw] = useMMKVBoolean(PREF_KEYS.COMPACT_MODE, storage);
  const [itemsPerPageRaw, setItemsPerPageRaw] = useMMKVNumber(PREF_KEYS.ITEMS_PER_PAGE, storage);

  // Valores normalizados con defaults
  const sortOrder: SortOrder = sortOrderRaw === 'desc' ? 'desc' : 'asc';
  const compactMode: boolean = Boolean(compactModeRaw);
  const itemsPerPage: number = itemsPerPageRaw ?? 10;

  const setSortOrder = (value: SortOrder) => {
    setSortOrderRaw(value);
  };

  const setCompactMode = (value: boolean) => {
    setCompactModeRaw(value);
  };

  const setItemsPerPage = (value: number) => {
    setItemsPerPageRaw(value);
  };

  return {
    sortOrder,
    setSortOrder,
    compactMode,
    setCompactMode,
    itemsPerPage,
    setItemsPerPage,
  };
}
