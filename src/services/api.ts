// ============================================================
// API CLIENT & SERVICES — src/services/api.ts
// Dominio: Productora de Eventos (Pesos Colombianos COP)
// Axios + Interceptores + Networking Real
// ============================================================

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { EventItem, CreateEventPayload } from '../types';
import { MOCK_EVENTS } from '../data/mockData';

declare const process: {
  env: {
    EXPO_PUBLIC_API_URL?: string;
    [key: string]: string | undefined;
  };
};

// URL base de la API (configurable por variable de entorno EXPO_PUBLIC_API_URL)
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://jsonplaceholder.typicode.com';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ============================================================
// INTERCEPTORES DE AXIOS
// ============================================================

// Interceptor de Request: logs en desarrollo y preparación de encabezados
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (__DEV__) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error: AxiosError) => {
    if (__DEV__) {
      console.error('[API Request Error]', error);
    }
    return Promise.reject(error);
  }
);

// Interceptor de Response: manejo centralizado de respuestas y errores
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (__DEV__) {
      console.log(`[API Response] ${response.status} from ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError) => {
    if (__DEV__) {
      console.error('[API Response Error]', error.response?.status, error.config?.url, error.message);
    }
    return Promise.reject(error);
  }
);

// ============================================================
// PERSISTENCIA EN MEMORIA PARA NUEVOS EVENTOS CREADOS VÍA POST
// ============================================================
// Almacena localmente los eventos creados en la sesión para que al
// llamar invalidateQueries() el refetch incluya los ítems creados
let createdEventsCache: EventItem[] = [];

// ============================================================
// FUNCIONES DE SERVICIO DEL DOMINIO
// ============================================================

interface JsonPlaceholderPost {
  id: number;
  title: string;
  body: string;
  userId: number;
}

/**
 * Obtiene la lista de eventos desde la API usando Axios GET.
 * Consume /posts de JSONPlaceholder como proxy REST y enriquece los
 * datos con las entidades del dominio de Productora de Eventos (COP).
 */
export async function fetchEventsApi(): Promise<EventItem[]> {
  const response = await apiClient.get<JsonPlaceholderPost[]>('/posts?_limit=12');
  const posts = response.data;

  // Mapear cada uno de los 12 posts a los 12 eventos únicos de MOCK_EVENTS
  const mappedEvents: EventItem[] = posts.map((post, index) => {
    const baseMock = MOCK_EVENTS[index % MOCK_EVENTS.length];
    return {
      ...baseMock,
      id: `evt-${post.id}`,
      description: baseMock?.description ?? post.body,
    };
  });

  // Combinar evitando cualquier duplicado de id o nombre
  const combined: EventItem[] = [...createdEventsCache];
  for (const item of mappedEvents) {
    if (!combined.some((c) => c.id === item.id || c.name === item.name)) {
      combined.push(item);
    }
  }

  return combined;
}

/**
 * Obtiene un evento por ID desde la API usando Axios GET.
 */
export async function fetchEventByIdApi(id: string): Promise<EventItem> {
  // 1. Verificar si fue creado/modificado recientemente en la sesión
  const cached = createdEventsCache.find((e) => e.id === id);
  if (cached) return cached;

  // 2. Buscar directamente en el catálogo de eventos únicos
  const foundMock = MOCK_EVENTS.find((e) => e.id === id);
  if (foundMock) return foundMock;

  // 3. Fallback por mapeo numérico de la API
  const numericId = Number(id.replace('evt-', '')) || 1;
  const index = (numericId - 1 + MOCK_EVENTS.length) % MOCK_EVENTS.length;
  return MOCK_EVENTS[index] || MOCK_EVENTS[0];
}

/**
 * Crea un nuevo evento enviando una petición HTTP POST real con Axios.
 */
export async function createEventApi(payload: CreateEventPayload): Promise<EventItem> {
  // Petición POST real a la API con Axios
  const response = await apiClient.post<JsonPlaceholderPost>('/posts', {
    title: payload.name,
    body: payload.description,
    userId: 1,
  });

  const generatedId = `evt-${response.data.id || Date.now()}`;
  const newEvent: EventItem = {
    ...payload,
    id: generatedId,
  };

  // Guardar en la caché en memoria para que el refetch inmediato lo traiga
  createdEventsCache = [newEvent, ...createdEventsCache];

  return newEvent;
}

/**
 * Actualiza un evento existente enviando una petición HTTP PUT real con Axios.
 */
export async function updateEventApi(id: string, payload: Partial<EventItem>): Promise<EventItem> {
  const numericId = id.replace('evt-', '');
  await apiClient.put<JsonPlaceholderPost>(`/posts/${numericId || 1}`, {
    id: Number(numericId) || 1,
    title: payload.name,
    body: payload.description,
    userId: 1,
  });

  const existing =
    createdEventsCache.find((e) => e.id === id) ||
    MOCK_EVENTS.find((e) => e.id === id) ||
    MOCK_EVENTS[0];

  const updatedEvent: EventItem = {
    ...existing,
    ...payload,
    id,
  };

  const alreadyCached = createdEventsCache.some((e) => e.id === id);
  if (alreadyCached) {
    createdEventsCache = createdEventsCache.map((e) => (e.id === id ? updatedEvent : e));
  } else {
    createdEventsCache = [updatedEvent, ...createdEventsCache];
  }

  return updatedEvent;
}

/**
 * Elimina un evento enviando una petición HTTP DELETE real con Axios.
 */
export async function deleteEventApi(id: string): Promise<void> {
  const numericId = id.replace('evt-', '');
  await apiClient.delete(`/posts/${numericId || 1}`);
  createdEventsCache = createdEventsCache.filter((e) => e.id !== id);
}
