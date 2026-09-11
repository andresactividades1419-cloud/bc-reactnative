# Semana 02 — Productora de Eventos (React Native)

> **Aprendiz:** ANDRES FELIPE FERNANDEZ CARDOZA  
> **Ficha:** 3228970  
> **Bootcamp:** `bc-reactnative` — Semana 02 (Listas, Inputs y Estilos)

---

## Descripción del Dominio

**Productora de Eventos**: Sistema móvil para la exploración, búsqueda en tiempo real y filtrado por categorías de eventos masivos, corporativos, bodas, conferencias y festivales.

### Entidades y Campos Representados
- `id`: Identificador único (`evt-101`, `evt-102`, etc.)
- `name`: Nombre del evento o producción (ej. *Festival Neon Lights 2026*)
- `client`: Cliente contratante (ej. *LiveNation Colombia*, *Globant*)
- `category`: Categoría (`Concierto`, `Boda`, `Conferencia`, `Corporativo`, `Festival`)
- `date`: Fecha programada
- `location`: Locación o recinto
- `budget`: Presupuesto asignado en Pesos Colombianos (ej. *$ 340.000.000 COP*)
- `capacity`: Aforo máximo de asistentes
- `vendorsCount`: Número de proveedores contratados
- `staffCount`: Personal técnico y de logística asignado
- `status`: Estado actual (`Planificación`, `En Producción`, `Confirmado`, `Finalizado`)

---

## Características Implementadas

1. **`FlatList` Virtualizada con `keyExtractor` por ID:** Renderiza 12 eventos de forma fluida.
2. **Búsqueda en Tiempo Real (`TextInput`):** Filtra simultáneamente por nombre de evento, cliente o locación.
3. **Filtro por Categorías (Pills / Badges):** Scroll horizontal para seleccionar categorías (*Todos*, *Concierto*, *Boda*, *Conferencia*, *Corporativo*, *Festival*).
4. **Optimización con `useMemo` y `useCallback`:**
   - `useMemo` para la computación del filtrado de la lista.
   - `useCallback` para `renderItem`, `keyExtractor`, `ItemSeparatorComponent` y `ListEmptyComponent`.
   - Componente `ItemCard` envuelto en `React.memo` para prevenir re-renders innecesarios.
5. **Manejo del Teclado:**
   - `KeyboardAvoidingView` ajustado según plataforma (`ios: padding`, `android: height`).
   - Cierre del teclado mediante `Keyboard.dismiss()` al interactuar fuera del input o presionar el botón de limpiar (`✕`).
6. **Estado Vacío Personalizado:** Mensaje didáctico e icono cuando la búsqueda no coincide con ningún evento.
7. **Pull-to-Refresh:** `RefreshControl` funcional en el `FlatList`.
8. **Sistema de Tokens de Diseño (`src/theme/index.ts`):** `COLORS`, `TYPOGRAPHY`, `SPACING`, `RADIUS`.

---

## Decisiones de Diseño

- **Paleta de Colores Dark Mode:** Inspirada en GitHub Dark (Fondo `#0d1117`, Superficies `#161b22`, Bordes `#30363d`, Acentos en azul `#58a6ff` y verde `#238636`).
- **Arquitectura de Componentes:** Componentes pequeños y modulares (`SearchBar`, `CategoryFilter`, `ItemCard`, `HomeScreen`).
- **TypeScript Estricto:** Tipado 100% explícito sin uso de `any`.
