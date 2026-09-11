// ============================================================
// TIPOS GLOBALES — Semana 08 Autenticación
// Dominio: Productora de Eventos
// ============================================================

/** Tokens recibidos del server al autenticarse */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/** Datos del usuario autenticado (productor / coordinador de eventos) */
export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
  /** Rol dentro de la productora (ej: "Coordinador de Producción", "Productor Junior") */
  role: string;
  /** Cantidad de producciones/eventos actualmente a cargo de este usuario */
  managedEventsCount: number;
}

/** Payload decodificado del JWT */
export interface JwtPayload {
  sub: number;
  username: string;
  iat: number;
  exp: number;
}

/** Credentials para login */
export interface LoginCredentials {
  username: string;
  password: string;
}

/** Datos para registro */
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

/** Respuesta del endpoint /auth/login (dummyjson.com) */
export interface AuthResponse extends AuthTokens {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
}

// ─────────────────────────────────────────────
// Dominio: catálogo de producciones (HomeScreen)
// ─────────────────────────────────────────────
export type EventCategory = 'Concierto' | 'Boda' | 'Conferencia' | 'Corporativo' | 'Festival';
export type EventStatus = 'Planificación' | 'En Producción' | 'Confirmado' | 'Finalizado';

export interface EventSummary {
  id: string;
  name: string;
  client: string;
  category: EventCategory;
  date: string;
  location: string;
  budget: string;
  status: EventStatus;
}
