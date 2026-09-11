# Semana 03 — Productora de Eventos (React Navigation 7)

> **Aprendiz:** ANDRES FELIPE FERNANDEZ CARDOZA  
> **Ficha:** 3228970  
> **Bootcamp:** `bc-reactnative` — Semana 03 (React Navigation 7)

---

## Descripción del Dominio & Navegación

**Productora de Eventos**: Sistema móvil con navegación avanzada de dos niveles:
- **Tab Navigator Principal (`RootTab`):** Pestaña de **Eventos** (`HomeTab`) y Pestaña de **Favoritos** (`FavoritesTab`).
- **Stack Navigator Anidado (`HomeStack`):** Navegación de lista general (`HomeList`) a la **Ficha Técnica Detallada** (`DetailScreen`).

---

## Características Implementadas

1. **`Tab Navigator` (`RootNavigator.tsx`):**
   - Pestaña **Eventos** con icono `calendar-outline` de `@expo/vector-icons` (`Ionicons`).
   - Pestaña **Favoritos** con icono `star-outline`.
   - `tabBarActiveTintColor`: `#61DAFB`.
2. **`Stack Navigator` Anidado (`HomeStack`):**
   - Transición fluida de `HomeList` a `DetailScreen`.
   - Paso de parámetros tipados (`id` y `name`).
   - Header nativo visible en `DetailScreen` con el nombre del evento como título.
3. **Pantalla de Detalle (`DetailScreen.tsx`):**
   - Lectura de parámetros mediante `route.params`.
   - Ficha técnica completa del evento (cliente, categoría, fecha, locación, presupuesto, aforo, proveedores, personal asignado y contacto responsable).
   - Botón de navegación para regresar (`goBack()`).
4. **Pantalla de Favoritos (`FavoritesScreen.tsx`):**
   - Lista de eventos marcados con `isFavorite: true` en `mockData.ts` (3 eventos de ejemplo), con navegación anidada hacia el detalle.
5. **Tipado Estricto con TypeScript:**
   - `HomeStackParamList`, `RootTabParamList`.
   - `NativeStackScreenProps` y `CompositeScreenProps`.
   - Sin uso de `any`.

---

## Decisiones de Diseño

- **Navegación Intuitiva:** El Tab Bar se mantiene visible para cambiar de contexto rápidamente, mientras el Stack administra el flujo dentro del catálogo.
- **Iconografía Consistente:** Uso de `@expo/vector-icons` integrado con la paleta de colores Dark Mode.
