// ============================================================
// ZUSTAND STORE — src/stores/useEventStore.ts
// Dominio: Productora de Eventos (Manejo de Estado Global)
// ============================================================

import { create } from 'zustand';
import { EventItem } from '../types';
import { MOCK_EVENTS } from '../data/mockData';

interface EventStoreState {
  // Estado
  savedEvents: EventItem[];
  
  // Acciones
  addEvent: (event: EventItem) => void;
  removeEvent: (eventId: string) => void;
  toggleSaveEvent: (event: EventItem) => void;
  clearSavedEvents: () => void;
  
  // Selectores / Helpers
  isEventSaved: (eventId: string) => boolean;
  totalSavedCount: () => number;
}

export const useEventStore = create<EventStoreState>((set, get) => ({
  // Estado inicial con 2 eventos guardados por defecto para pruebas
  savedEvents: [MOCK_EVENTS[0], MOCK_EVENTS[1]],

  addEvent: (event: EventItem) => {
    set((state) => {
      const exists = state.savedEvents.some((item) => item.id === event.id);
      if (exists) return state;
      return { savedEvents: [...state.savedEvents, event] };
    });
  },

  removeEvent: (eventId: string) => {
    set((state) => ({
      savedEvents: state.savedEvents.filter((item) => item.id !== eventId),
    }));
  },

  toggleSaveEvent: (event: EventItem) => {
    const { savedEvents, addEvent, removeEvent } = get();
    const isSaved = savedEvents.some((item) => item.id === event.id);
    if (isSaved) {
      removeEvent(event.id);
    } else {
      addEvent(event);
    }
  },

  clearSavedEvents: () => {
    set({ savedEvents: [] });
  },

  isEventSaved: (eventId: string) => {
    return get().savedEvents.some((item) => item.id === eventId);
  },

  totalSavedCount: () => {
    return get().savedEvents.length;
  },
}));
