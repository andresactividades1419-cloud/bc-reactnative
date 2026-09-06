# Semana 07 — Productora de Eventos (Persistencia Local)

> **Aprendiz:** ANDRES FELIPE FERNANDEZ CARDOZA  
> **Ficha:** 3228970  
> **Bootcamp:** `bc-reactnative` — Semana 07 (Persistencia Local: MMKV, AsyncStorage y SecureStore)

---

## 🎯 Descripción del Dominio & Arquitectura de Persistencia

**Productora de Eventos**: Aplicación móvil profesional para la planificación, costeo, gestión y visualización de producciones y espectáculos en vivo (conciertos, festivales, bodas campestres, conferencias tech y eventos corporativos).

En esta semana se implementa una **arquitectura de almacenamiento local en 3 niveles**, seleccionando la tecnología adecuada según velocidad, volumen de datos y requerimientos de seguridad:

| Storage | Tecnología | Caso de Uso en Productora de Eventos | Tipo de Operación |
| :--- | :--- | :--- | :--- |
| **Preferencias UI** | **MMKV** | Modo compacto, orden alfabético/cronológico y producciones por página. | Síncrono ultrarrápido vía JSI / C++ (sin `async/await`). |
| **Caché Offline** | **AsyncStorage** | Almacenamiento en caché de la lista de producciones y fallback ante fallos de red. | Asíncrono para estructuras JSON y payloads de red. |
| **Datos Sensibles** | **Expo SecureStore** | PIN de autorización de presupuestos VIP y claves de producción. | Encriptado por hardware en iOS Keychain y Android Keystore. |

- **Moneda Oficial:** Todos los presupuestos, costos y cotizaciones se manejan estrictamente en **Pesos Colombianos (COP)** con formato de miles (ej: `$ 150.000.000 COP`).

---

## 🚀 Características Implementadas

### 1. MMKV — Preferencias Reactivas en Tiempo Real (`src/storage/mmkv.ts` & `src/hooks/usePreferences.ts`)
- Instancia global con `createMMKV({ id: 'event-production-storage' })`.
- Custom Hook reactivo `usePreferences()` que expone y persiste 3 preferencias del usuario:
  - **`sortOrder` (`'asc' | 'desc'`):** Controla el orden alfabético de las producciones en el catálogo (`useMMKVString`).
  - **`compactMode` (`boolean`):** Alterna entre tarjetas completas con fotografía y tarjetas resumidas con menor espaciado (`useMMKVBoolean`).
  - **`itemsPerPage` (`number`):** Define el límite visible de producciones (`5`, `10` o `20`) en la pantalla principal (`useMMKVNumber`), con valor por defecto de 20 para ver todas y botón para expandir.
- Los cambios se guardan de inmediato en memoria y disco sin botones de "Guardar" y sin recargar la app.

### 2. AsyncStorage — Caché Offline y Soporte Sin Conexión (`src/hooks/useEvents.ts`)
- Al realizar una consulta exitosa con Axios a la API REST, los datos se almacenan automáticamente en la clave `@events_production_cache_v2`.
- Si la conexión falla o el dispositivo está offline, el hook rescata las producciones cacheadas y marca `source: 'cache'`.
- **Banner Offline en `HomeScreen`:** Cuando la información proviene de la caché local, se despliega un banner destacado en la parte superior:  
  `⚠️ Modo sin conexión: Mostrando producciones guardadas localmente`.

### 3. Expo SecureStore — Credenciales VIP Encriptadas (`src/screens/SettingsScreen.tsx`)
- Almacenamiento seguro del **PIN de Autorización de Presupuestos VIP** (`producer_vip_auth_pin`).
- Métodos implementados:
  - `SecureStore.setItemAsync`: Cifra y guarda el PIN en el llavero nativo del sistema.
  - `SecureStore.getItemAsync`: Lee la credencial almacenada.
  - `SecureStore.deleteItemAsync`: Elimina de forma segura la credencial del dispositivo.
- **Seguridad y Enmascaramiento:** En cumplimiento estricto con las directrices de seguridad, el dato **nunca se muestra en texto plano**, presentándose en pantalla en formato enmascarado (`••••••••-8970`).

### 4. Nueva Pestaña de Navegación (`src/screens/SettingsScreen.tsx` & `RootNavigator.tsx`)
- Incorporada la 3ª pestaña en el Tab Navigator:
  - **Eventos 📅:** Catálogo con TanStack Query, soporte offline, modo compacto y ordenamiento por MMKV.
  - **Destacados ⭐:** Administrado con Zustand y badge dinámico en tiempo real.
  - **Ajustes ⚙️:** Panel de switches MMKV y consola de credenciales seguras con SecureStore.

### 5. TypeScript Estricto
- Interfaces del modelo y tipos de almacenamiento 100% explícitos.
- Validación con `npx tsc --noEmit` con **cero errores** y sin uso de `any`.

---

## 📁 Estructura del Proyecto

```
├── App.tsx                       # QueryClientProvider + RootNavigator
├── app.json                      # Configuración Expo
├── package.json                  # Dependencias de storage (mmkv, async-storage, secure-store)
├── tsconfig.json                 # Configuración TypeScript estricta
├── README.md                     # Documentación oficial de la entrega
└── src/
    ├── storage/
    │   └── mmkv.ts               # Instancia global de MMKV vía createMMKV
    ├── hooks/
    │   ├── usePreferences.ts     # Hook con useMMKVString, useMMKVBoolean y useMMKVNumber
    │   └── useEvents.ts          # useQuery con fallback y caché en AsyncStorage
    ├── screens/
    │   ├── HomeScreen.tsx        # Lista con banner offline y preferencias aplicadas
    │   ├── DetailScreen.tsx      # Ficha técnica con acción de edición
    │   ├── CreateScreen.tsx      # Formulario modal de creación (React Hook Form + Zod)
    │   ├── EditScreen.tsx        # Formulario modal de edición con reset() reactivo
    │   ├── FavoritesScreen.tsx   # Lista de guardados con Zustand
    │   └── SettingsScreen.tsx    # Pantalla de preferencias MMKV y Expo SecureStore
    ├── components/
    │   ├── FormField.tsx         # Componente genérico Controller + TextInput + Error
    │   ├── ItemCard.tsx          # Tarjeta responsiva con soporte para compactMode
    │   ├── SearchBar.tsx         # Barra de búsqueda en vivo
    │   └── CategoryFilter.tsx    # Filtro por tipo de producción
    ├── services/
    │   └── api.ts                # Cliente Axios con soporte GET, POST, PUT y DELETE
    ├── stores/
    │   └── useEventStore.ts      # Store global Zustand
    ├── navigation/
    │   ├── RootNavigator.tsx     # Tab Navigator (Eventos, Destacados, Ajustes) + Stack
    │   └── types.ts              # Tipado de rutas y parámetros
    ├── schemas/
    │   └── eventSchema.ts        # Esquema Zod e inferencia de tipos
    ├── data/
    │   └── mockData.ts           # Datos base del dominio
    ├── theme/
    │   └── index.ts              # Tokens de diseño
    └── types/
        └── index.ts              # Tipos TypeScript del dominio
```

---

## 🚀 Cómo ejecutar

```bash
# 1. Instalar dependencias
pnpm install
# (o npm install)

# 2. Iniciar servidor Expo
npx expo start

# 3. Presionar 'a' para Android, 'i' para iOS simulador o escanear con Expo Go
```

Para comprobar que el código cumple con TypeScript estricto:
```bash
npx tsc --noEmit
```
