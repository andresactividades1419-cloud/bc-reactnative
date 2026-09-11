// ============================================================
// MOCK DATA — src/data/mockData.ts
// Dominio: Productora de Eventos (Pesos Colombianos COP)
// Catálogo mostrado en HomeScreen tras autenticarse
// ============================================================
import { EventSummary } from '../types';

export const MOCK_EVENTS: EventSummary[] = [
  {
    id: 'evt-101',
    name: 'Festival Neon Lights 2026',
    client: 'LiveNation Colombia',
    category: 'Festival',
    date: '25 de Octubre, 2026',
    location: 'Centro de Eventos Valle del Pacífico, Cali',
    budget: '$ 340.000.000 COP',
    status: 'En Producción',
  },
  {
    id: 'evt-102',
    name: 'Gala Anual Tech Summit',
    client: 'Globant Enterprise',
    category: 'Conferencia',
    date: '12 de Noviembre, 2026',
    location: 'Hotel Grand Hyatt, Bogotá',
    budget: '$ 128.000.000 COP',
    status: 'Confirmado',
  },
  {
    id: 'evt-103',
    name: 'Boda Real Cardoza & Silva',
    client: 'Familia Cardoza',
    category: 'Boda',
    date: '05 de Diciembre, 2026',
    location: 'Hacienda San Rafael, Sopó',
    budget: '$ 98.000.000 COP',
    status: 'Planificación',
  },
  {
    id: 'evt-104',
    name: 'Expo Industria & Innovación',
    client: 'Cámara de Comercio de Bogotá',
    category: 'Corporativo',
    date: '18 de Enero, 2027',
    location: 'Corferias Pabellón 6, Bogotá',
    budget: '$ 240.000.000 COP',
    status: 'Confirmado',
  },
  {
    id: 'evt-105',
    name: 'Concierto Rock Legends Arena',
    client: 'Páramo Presenta',
    category: 'Concierto',
    date: '14 de Febrero, 2027',
    location: 'Movistar Arena, Bogotá',
    budget: '$ 480.000.000 COP',
    status: 'En Producción',
  },
  {
    id: 'evt-106',
    name: 'Lanzamiento Corporativo BMW iX',
    client: 'BMW Group Colombia',
    category: 'Corporativo',
    date: '28 de Febrero, 2027',
    location: 'Club El Nogal, Bogotá',
    budget: '$ 180.000.000 COP',
    status: 'Planificación',
  },
];
