// ============================================================
// TYPES — src/types/index.ts
// Dominio: Productora de Eventos (Pesos Colombianos COP)
// ============================================================

export type EventCategory = 'Todos' | 'Concierto' | 'Boda' | 'Conferencia' | 'Corporativo' | 'Festival';
export type EventStatus = 'Planificación' | 'En Producción' | 'Confirmado' | 'Finalizado';

export interface EventItem {
  id: string;
  name: string;
  client: string;
  category: Exclude<EventCategory, 'Todos'>;
  date: string;
  location: string;
  budget: string; // Formato COP (ej: "$ 340.000.000 COP")
  capacity: number;
  imageUri: string;
  status: EventStatus;
  vendorsCount: number;
  staffCount: number;
  description: string;
  contactPerson: string;
  contactEmail: string;
}

export type Item = EventItem;
