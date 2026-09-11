# Semana 05 — Productora de Eventos (Networking y TanStack Query v5)

> **Aprendiz:** ANDRES FELIPE FERNANDEZ CARDOZA  
> **Ficha:** 3228970  
> **Bootcamp:** `bc-reactnative` — Semana 05 (Networking y TanStack Query v5)

---

## Descripción del Dominio & Arquitectura de Networking

**Productora de Eventos**: Sistema móvil profesional para la gestión, exploración y registro de producciones y eventos en vivo (conciertos, festivales, bodas, conferencias, eventos corporativos).

En esta semana se implementa la capa completa de **Networking** consumiendo APIs REST con **Axios** y administrando el estado asíncrono del servidor mediante **TanStack Query v5** (`@tanstack/react-query`), manteniendo una separación estricta entre el estado del servidor y el estado del cliente (Zustand).

- **Moneda:** Todos los presupuestos, cotizaciones y costos se manejan estrictamente en **Pesos Colombianos (COP)** con separadores de miles (ej: `$ 350.000.000 COP`).
- **Arquitectura Limpia:** Separación en capas: Servicios API (`src/services/`), Hooks de React Query (`src/hooks/`), Stores locales (`src/stores/`), Navegación (`src/navigation/`), Pantallas (`src/screens/`) y Componentes UI (`src/components/`).

---

## Características Implementadas

### 1. Cliente HTTP con Axios (`src/services/api.ts`)
- Instancia centralizada de Axios con `baseURL`, cabeceras JSON por defecto y timeouts controlados.
- **Interceptores de Request y Response:** Manejo centralizado de logging para depuración y formateo normalizado de respuestas y errores HTTP.

### 2. Custom Hooks con TanStack Query v5 (`src/hooks/useEvents.ts`)
- **`useEvents()`:** Implementa `useQuery` para la consulta del catálogo de eventos con query key `['events']`. Configurado con `staleTime`, `retry` y garbage collection optimizados.
- **`useEventById(id)`:** Query tipada para obtener la información de una producción específica `['events', id]`.
- **`useCreateEvent()`:** `useMutation` para el registro asíncrono de nuevos eventos mediante `POST`. Al completarse con éxito, ejecuta automáticamente `queryClient.invalidateQueries({ queryKey: ['events'] })` para refrescar la lista sin recargas manuales.

### 3. Manejo Exhaustivo de Estados en `HomeScreen`
- **Loading State:** Spinner con `ActivityIndicator` y mensaje contextual durante la carga inicial (`isLoading`).
- **Error State:** Pantalla informativa de error con detalles amigables y botón interactivo **"Reintentar"** que invoca `refetch()`.
- **Empty State:** Vista personalizada cuando no existen registros disponibles en el servidor.
- **Pull-to-Refresh:** `RefreshControl` nativo en el `FlatList` sincronizado con `onRefresh={refetch}` y `refreshing={isFetching}`.

### 4. Pantalla de Creación (`CreateScreen.tsx`)
- Formulario modal para registrar nuevos eventos del dominio (Nombre, Cliente, Categoría, Fecha, Locación, Presupuesto en COP, Aforo).
- Validación de campos requeridos y formato numérico.
- Integración directa con `useCreateEvent.mutateAsync()` con indicador de progreso en el botón de guardado.

### 5. Sincronización de Servidor y Cliente
- **TanStack Query v5:** Administra el ciclo de vida de los datos remotos (caché, reintentos, refetch en segundo plano).
- **Zustand (`src/stores/useEventStore.ts`):** Gestiona las acciones locales del cliente (eventos guardados/destacados y badge numérico en tiempo real en la barra de navegación).

### 6. TypeScript Estricto
- Interfaces del modelo de datos (`EventItem`, `CreateEventDTO`, `EventCategory`, `EventStatus`).
- Tipos seguros de navegación con React Navigation 7 (`RootStackParamList`, `RootTabParamList`).
- Cero uso de `any` ni `as any`.

---

## Estructura del Proyecto

```
├── App.tsx                       # Entry point con QueryClientProvider y RootNavigator
├── app.json                      # Configuración Expo
├── package.json                  # Dependencias y scripts
├── tsconfig.json                 # Configuración TypeScript estricta
├── README.md                     # Documentación de la entrega
└── src/
    ├── services/
    │   └── api.ts                # Instancia de Axios e interceptores
    ├── hooks/
    │   └── useEvents.ts          # Hooks useQuery y useMutation de TanStack Query
    ├── stores/
    │   └── useEventStore.ts      # Store global Zustand para eventos destacados
    ├── navigation/
    │   ├── RootNavigator.tsx     # Tab + Stack Navigator anidados
    │   └── types.ts              # Tipado de rutas y parámetros
    ├── screens/
    │   ├── HomeScreen.tsx        # Catálogo con useQuery, loading, error y pull-to-refresh
    │   ├── DetailScreen.tsx      # Ficha técnica con useEventById y toggle Zustand
    │   ├── CreateScreen.tsx      # Formulario modal con useMutation
    │   └── FavoritesScreen.tsx   # Pestaña de eventos guardados con Zustand
    ├── components/
    │   ├── ItemCard.tsx          # Tarjeta del evento con badges y acciones
    │   ├── SearchBar.tsx         # Barra de búsqueda con filtrado
    │   └── CategoryFilter.tsx    # Filtro horizontal por tipo de producción
    ├── data/
    │   └── mockData.ts           # Datos base del dominio de eventos
    ├── theme/
    │   └── index.ts              # Tokens de diseño (colores, tipografía, espaciado)
    └── types/
        └── index.ts              # Tipos TypeScript del dominio
```

---

## Cómo ejecutar

```bash
# 1. Instalar dependencias
pnpm install
# (o npm install)

# 2. Iniciar el servidor de desarrollo de Expo
npx expo start

# 3. Presionar 'a' para Android, 'i' para iOS simulador o escanear el QR con Expo Go
```

Para verificar que el código cumple con TypeScript estricto:
```bash
npx tsc --noEmit
```
