// Dominio: Productora de Eventos

export type EventCategory =
  | 'Concierto'
  | 'Boda'
  | 'Conferencia'
  | 'Corporativo'
  | 'Festival';

export interface EventItem {
  id: string;
  name: string;
  client: string;
  category: EventCategory;
  location: string;
  date: string;
  budget: string;
  capacity: number;
  ticketsSold: number;
  /** aforo vendido, 0-1 — usado por ProgressBar */
  progress: number;
}
