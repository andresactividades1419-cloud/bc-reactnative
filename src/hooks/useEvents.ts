// ============================================================
// CUSTOM HOOKS (TanStack Query v5) — src/hooks/useEvents.ts
// Dominio: Productora de Eventos (Pesos Colombianos COP)
// ============================================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  fetchEventsApi,
  fetchEventByIdApi,
  createEventApi,
  updateEventApi,
  deleteEventApi,
} from '../services/api';
import type { EventItem, CreateEventPayload } from '../types';

// ============================================================
// QUERY KEYS & ASYNC STORAGE KEYS
// ============================================================
export const EVENTS_QUERY_KEY = ['events'] as const;
export const EVENTS_CACHE_KEY = '@events_production_cache';

export interface EventsQueryResult {
  events: EventItem[];
  source: 'network' | 'cache';
}

// ============================================================
// useEvents — Lista con soporte de caché offline en AsyncStorage
// ============================================================
export function useEvents() {
  return useQuery<EventsQueryResult, Error>({
    queryKey: EVENTS_QUERY_KEY,
    queryFn: async (): Promise<EventsQueryResult> => {
      try {
        const data = await fetchEventsApi();
        // Guardar en caché offline AsyncStorage cuando la red es exitosa
        await AsyncStorage.setItem(EVENTS_CACHE_KEY, JSON.stringify(data));
        return { events: data, source: 'network' };
      } catch (networkError) {
        console.warn('[useEvents] Fallo de red, consultando caché AsyncStorage...', networkError);
        const cachedString = await AsyncStorage.getItem(EVENTS_CACHE_KEY);
        if (cachedString) {
          const parsed = JSON.parse(cachedString) as EventItem[];
          return { events: parsed, source: 'cache' };
        }
        throw new Error('Sin conexión a red y sin datos en caché disponibles');
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

// ============================================================
// useEventById — Obtener una producción por ID (GET)
// ============================================================
export function useEventById(id: string) {
  return useQuery<EventItem, Error>({
    queryKey: [...EVENTS_QUERY_KEY, id],
    queryFn: () => fetchEventByIdApi(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 2,
  });
}

// ============================================================
// useCreateEvent — Registrar nueva producción (POST)
// ============================================================
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation<EventItem, Error, CreateEventPayload>({
    mutationFn: createEventApi,
    onSuccess: () => {
      // Invalida el caché de TanStack Query para disparar el refetch automático
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error('[useCreateEvent Error]', error.message);
    },
  });
}

// ============================================================
// useUpdateEvent — Actualizar producción existente (PUT)
// ============================================================
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation<EventItem, Error, { id: string; payload: Partial<EventItem> }>({
    mutationFn: ({ id, payload }) => updateEventApi(id, payload),
    onSuccess: (_, variables) => {
      // Invalida la lista y el detalle específico del ítem editado
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: [...EVENTS_QUERY_KEY, variables.id] });
    },
    onError: (error) => {
      console.error('[useUpdateEvent Error]', error.message);
    },
  });
}

// ============================================================
// useDeleteEvent — Cancelar / eliminar producción (DELETE)
// ============================================================
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteEventApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EVENTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error('[useDeleteEvent Error]', error.message);
    },
  });
}
