# Semana 06 — Productora de Eventos (Formularios con React Hook Form + Zod)

> **Aprendiz:** ANDRES FELIPE FERNANDEZ CARDOZA  
> **Ficha:** 3228970  
> **Bootcamp:** `bc-reactnative` — Semana 06 (Formularios y Validación con React Hook Form + Zod)

---

## 🎯 Descripción del Dominio & Arquitectura de Formularios

**Productora de Eventos**: Sistema móvil profesional para la gestión, planeación, cotización y edición de producciones en vivo (conciertos masivos, festivales, bodas campestres, conferencias tech y eventos corporativos).

En esta semana se integra la capa completa de **captura y edición reactiva de datos** con validaciones estrictas en tiempo de ejecución:
- **Validación con Zod (`src/schemas/eventSchema.ts`):** Esquema declarativo con tipos inferidos automáticamente (`z.infer`), evitando duplicación entre tipos estáticos e interfaces manuales.
- **Gestión de Formularios con React Hook Form:** Control de inputs móviles mediante `Controller` y `@hookform/resolvers/zod`.
- **Componente Reutilizable `FormField` (`src/components/FormField.tsx`):** Abstracción limpia que encapsula `Controller`, `TextInput` nativo y mensajes de error inline con feedback visual.
- **Ciclo Completo de Datos (Create + Edit):**
  - Creación con `CreateScreen` y mutación POST vía `useCreateEvent`.
  - Edición con `EditScreen`, precarga reactiva mediante `useEffect` + `reset()` desde `useEventById`, y mutación PUT vía `useUpdateEvent`.
- **Moneda:** Todos los presupuestos se calculan y presentan estrictamente en **Pesos Colombianos (COP)** con separadores de miles (ej: `$ 150.000.000 COP`).

---

## 📋 Esquema Zod y Reglas de Validación (`src/schemas/eventSchema.ts`)

| Campo | Tipo Zod | Reglas de Validación |
| :--- | :--- | :--- |
| `name` | `z.string()` | Mínimo 3 caracteres, máximo 80 caracteres. |
| `client` | `z.string()` | Mínimo 2 caracteres, máximo 60 caracteres. |
| `category` | `z.enum([...])` | Debe pertenecer a: *Concierto*, *Boda*, *Conferencia*, *Festival*, *Corporativo*. |
| `date` | `z.string()` | Mínimo 5 caracteres (ej: `2026-11-20`). |
| `location` | `z.string()` | Mínimo 3 caracteres, máximo 80 caracteres. |
| `budget` | `z.coerce.number()` | Número positivo mayor a $ 0 COP y mínimo $ 100.000 COP. Convierte texto a número en runtime. |
| `capacity` | `z.coerce.number().int()` | Número entero positivo, mínimo 1 asistente. |
| `description` | `z.string().optional()` | Opcional, máximo 500 caracteres. |

```ts
// Inferencia automática de tipos (sin interfaces manuales duplicadas)
export type EventFormData = z.infer<typeof eventSchema>;
export type EventFormInput = z.input<typeof eventSchema>;
```

---

## 🚀 Características Implementadas

### 1. Componente Reutilizable `FormField` (`src/components/FormField.tsx`)
- Tipado genérico `<T extends FieldValues>` para integrarse con cualquier formulario de React Hook Form sin `any`.
- Envuelve el `Controller` oficial conectando `onChange`, `onBlur` y `value`.
- Renderiza el `TextInput` nativo con estilos de tema y bordes de advertencia en caso de error (`COLORS.danger`).
- Espacio reservado para mensajes de error inline (`numberOfLines={2}`) evitando saltos abruptos en el layout al validar.

### 2. Formulario de Creación (`src/screens/CreateScreen.tsx`)
- Inicializado con `useForm<EventFormInput, any, EventFormData>` con `zodResolver(eventSchema)`.
- Selector interactivo de categoría con chips conectados al `Controller`.
- Validación activa al intentar enviar: muestra mensajes contextuales de Zod en cada campo que no cumpla las reglas.
- Envío asíncrono con `useCreateEvent` (TanStack Query v5) e invalidación automática de la caché `['events']`.

### 3. Formulario de Edición (`src/screens/EditScreen.tsx`)
- Nueva pantalla modal en la navegación (`RootNavigator.tsx`).
- Recibe los parámetros `{ id, name }` desde la ruta.
- Consulta el evento remoto con `useEventById(id)`.
- **Patrón clave del bootcamp:** Implementa `useEffect` con `reset()` para rellenar automáticamente los `defaultValues` cuando los datos del servidor llegan:
  ```tsx
  useEffect(() => {
    if (event) {
      reset({
        name: event.name,
        client: event.client,
        category: event.category,
        date: event.date,
        location: event.location,
        budget: rawBudget,
        capacity: event.capacity,
        description: event.description || '',
      });
    }
  }, [event, reset]);
  ```
- Mutación de actualización con `useUpdateEvent` enviando petición HTTP PUT con Axios, invalidando tanto la lista general `['events']` como el detalle específico `['events', id]`.

### 4. Acceso desde la Ficha Técnica (`src/screens/DetailScreen.tsx`)
- Incorporado botón interactivo **"✏️ Editar"** junto al botón de destacados en la barra de acciones superior.
- Navega fluidamente a `EditScreen` transmitiendo el ID y nombre del evento.

### 5. TypeScript Estricto
- Cero uso de `any` ni `as any`.
- Compilación validada al 100% con `npx tsc --noEmit`.

---

## 📁 Estructura del Proyecto

```
├── App.tsx                       # Entry point con QueryClientProvider y RootNavigator
├── app.json                      # Configuración Expo
├── package.json                  # Dependencias (react-hook-form, zod, @hookform/resolvers)
├── tsconfig.json                 # Configuración TypeScript estricta
├── README.md                     # Documentación de la entrega semanal
└── src/
    ├── schemas/
    │   └── eventSchema.ts        # Esquema de validación Zod y tipos inferidos
    ├── components/
    │   ├── FormField.tsx         # Componente reutilizable Controller + TextInput + Error
    │   ├── ItemCard.tsx          # Tarjeta del evento con badges y acciones
    │   ├── SearchBar.tsx         # Barra de búsqueda con filtrado
    │   └── CategoryFilter.tsx    # Filtro horizontal por categoría
    ├── hooks/
    │   └── useEvents.ts          # useEvents, useEventById, useCreateEvent, useUpdateEvent
    ├── services/
    │   └── api.ts                # Cliente Axios con soporte para GET, POST y PUT
    ├── stores/
    │   └── useEventStore.ts      # Store global Zustand para eventos destacados
    ├── navigation/
    │   ├── RootNavigator.tsx     # Tab + Stack (HomeList, DetailScreen, CreateScreen, EditScreen)
    │   └── types.ts              # Tipado de rutas y parámetros
    ├── screens/
    │   ├── HomeScreen.tsx        # Lista con TanStack Query y pull-to-refresh
    │   ├── DetailScreen.tsx      # Detalle técnico con botón de edición
    │   ├── CreateScreen.tsx      # Formulario Create con React Hook Form + Zod
    │   ├── EditScreen.tsx        # Formulario Edit con reset() + Zod + useUpdateEvent
    │   └── FavoritesScreen.tsx   # Pestaña de guardados con Zustand
    ├── data/
    │   └── mockData.ts           # Datos base del dominio
    ├── theme/
    │   └── index.ts              # Tokens de diseño
    └── types/
        └── index.ts              # Tipos del dominio
```

---

## 🚀 Cómo ejecutar

```bash
# 1. Instalar dependencias
pnpm install
# (o npm install)

# 2. Iniciar servidor Expo
npx expo start

# 3. Presionar 'a' para Android, 'i' para iOS simulador o escanear el QR con Expo Go
```

Para verificar que el código cumple con TypeScript estricto:
```bash
npx tsc --noEmit
```
