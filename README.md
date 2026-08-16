# Semana 04 — Productora de Eventos (Estado Global con Zustand)

> **Aprendiz:** ANDRES FELIPE FERNANDEZ CARDOZA  
> **Ficha:** 3228970  
> **Bootcamp:** `bc-reactnative` — Semana 04 (Manejo de Estado Global con Zustand)

---

## 🎯 Descripción del Dominio & Estado Global

**Productora de Eventos**: Sistema móvil con gestión de estado global centralizado usando **Zustand**:
- **Store Centralizado (`src/stores/useEventStore.ts`):** Administra la lista de eventos guardados/destacados (`savedEvents`) a lo largo de toda la aplicación sin prop drilling.
- **Acciones Implementadas:** `addEvent`, `removeEvent`, `toggleSaveEvent`, `clearSavedEvents`.
- **Selectores Dinámicos:**
  - Inyección en tiempo real del badge del Tab Bar (`tabBarBadge`) en la pestaña **Destacados**.
  - Botones toggle de guardado interactivos en `ItemCard`, `HomeScreen` y `DetailScreen`.
- **Moneda:** Todos los presupuestos se manejan en **Pesos Colombianos (COP)**.

---

## 🚀 Características Implementadas

1. **Zustand Store (`useEventStore.ts`):**
   - Tipado 100% estricto en TypeScript sin uso de `any`.
   - Modificación y lectura directa mediante selectores atómicos.
2. **Badge Dinámico en el Tab Bar:**
   - La pestaña **Destacados** reacciona automáticamente al conteo del store Zustand (`savedCount`) mostrando un badge sin necesidad de estados globales pesados o Context API.
3. **Pestaña Destacados (`SavedScreen` / `FavoritesScreen`):**
   - Muestra la lista de producciones marcadas desde cualquier pantalla.
   - Botón **"Limpiar Todo 🗑️"** que ejecuta la acción `clearSavedEvents()` del store.
   - Estado vacío interactivo cuando no hay elementos.
4. **Ficha Técnica (`DetailScreen.tsx`):**
   - Botón toggle dinámico que lee y modifica el store Zustand.

---

## 🎨 Decisiones de Diseño

- **Arquitectura Limpia:** Separación entre pantallas (`src/screens/`), stores (`src/stores/`), componentes visuales (`src/components/`) y tipos (`src/types/`).
- **Aesthetic Dark Theme:** Colores adaptados con jerarquía visual, bordes sutiles y contraste de acentos en amarillo para elementos destacados.
