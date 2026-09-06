// ============================================================
// CUSTOM HOOKS (TanStack Query v5) — src/hooks/useEvents.ts
// Dominio: Productora de Eventos (Pesos Colombianos COP)
// ============================================================

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchEventsApi,
  fetchEventByIdApi,
  createEventApi,
  updateEventApi,
  deleteEventApi,
} from '../services/api';
import type { EventItem, CreateEventPayload } from '../types';

// ============================================================
// QUERY KEYS
// ============================================================
export const EVENTS_QUERY_KEY = ['events'] as const;

// ============================================================
// useEvents — Obtener lista de producciones / eventos (GET)
// ============================================================
export function useEvents() {
  return useQuery<EventItem[], Error>({
    queryKey: EVENTS_QUERY_KEY,
    queryFn: fetchEventsApi,
    staleTime: 1000 * 60 * 2, // 2 minutos de datos frescos
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
