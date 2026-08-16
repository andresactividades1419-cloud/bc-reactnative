// ============================================================
// TYPES — src/types/index.ts
// Dominio: Productora de Eventos (bc-reactnative)
// ============================================================

export type EventCategory = 'Concierto' | 'Boda' | 'Conferencia' | 'Corporativo' | 'Festival';
export type EventStatus = 'Planificación' | 'En Producción' | 'Confirmado' | 'Finalizado';

export interface EventItem {
  id: string;
  name: string;
  client: string;
  category: EventCategory;
  date: string;
  location: string;
  budget: string;
  capacity: number;
  imageUri: string;
  status: EventStatus;
  vendorsCount: number;
  staffCount: number;
}

// Alias para compatibilidad con la interfaz genérica del starter
export type Item = EventItem;
