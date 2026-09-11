# Semana 08 — Productora de Eventos (Autenticación Completa)

> **Aprendiz:** ANDRES FELIPE FERNANDEZ CARDOZA
> **Ficha:** 3228970
> **Bootcamp:** `bc-reactnative` — Semana 08 (Autenticación JWT completa)

---

## Descripción del Dominio & Arquitectura de Autenticación

**Productora de Eventos**: acceso protegido para el equipo de producción (coordinadores y productores) que gestiona conciertos, festivales, bodas, conferencias y eventos corporativos.

Esta semana se implementa el flujo de **autenticación JWT completa**, con separación estricta entre:
- **Tokens (SecureStore):** access token y refresh token — nunca en AsyncStorage ni en texto plano.
- **Estado de sesión (Zustand + persist):** solo `user` e `isAuthenticated` se persisten en AsyncStorage vía `partialize`; los tokens quedan fuera del store.
- **Navegación condicional:** `AuthNavigator` (Login/Registro) cuando no hay sesión, `AppNavigator` (Producciones/Perfil) cuando sí la hay.

**API de autenticación:** `dummyjson.com/auth` (login, refresh y `/auth/me`). Credenciales de prueba: `username: emilys` / `password: emilyspass`.

---

## Características Implementadas

### 1. Autenticación base (obligatorio)
- **LoginScreen:** formulario `username` + `password` con React Hook Form + Zod (`loginSchema`), llama a `useAuthStore.login()`.
- **RegisterScreen:** formulario `username`, `email`, `password` y `confirmPassword` (con `.refine` para validar que coincidan), llama a `useAuthStore.register()`.
- **`useAuthStore` (Zustand):** acciones `login()`, `register()`, `logout()` y `refreshTokens()` completamente implementadas.
- **Tokens en SecureStore:** `src/services/tokenService.ts` guarda y lee `accessToken`/`refreshToken` exclusivamente con `SecureStore.setItemAsync` / `getItemAsync` / `deleteItemAsync`.
- **Navegación condicional:** `RootNavigator.tsx` selecciona `AuthNavigator` o `AppNavigator` según `isAuthenticated`, sin navegación manual desde las pantallas.
- **ProfileScreen:** muestra nombre, correo, usuario, ID, rol y producciones a cargo del usuario autenticado.

### 2. Adaptación al dominio (obligatorio)
- **HomeScreen ("Producciones"):** catálogo de eventos de la productora (nombre, cliente, categoría, fecha, presupuesto en COP y estado), cargado con `useQuery` de TanStack Query.
- **ProfileScreen:** además de los datos básicos, muestra `role` (ej. *Coordinador de Producción*, *Productor Junior*) y `managedEventsCount` (producciones actualmente a su cargo) — campos propios de `AuthUser` extendidos para este dominio.

### 3. Interceptor 401 → refresh automático (mejora opcional)
- `src/services/api.ts` implementa el interceptor de respuesta: si una petición falla con `401` y no se ha reintentado antes, lee el `refreshToken` de SecureStore, pide un nuevo `accessToken` con `authService.refreshTokens()`, lo guarda y reintenta la petición original.
- El `import('./authService')` dentro del interceptor es diferido a propósito para evitar el ciclo `api.ts` ↔ `authService.ts` (ambos módulos se necesitan mutuamente).

### 4. Logout accesible (mejora opcional)
- Botón "Cerrar sesión" en `ProfileScreen`, con confirmación (`Alert.alert`) antes de limpiar tokens y estado.

### 5. TypeScript Estricto
- Interfaces del dominio (`AuthUser`, `AuthTokens`, `EventSummary`) explícitas, sin `any`.
- `refreshTokens()` en `authService.ts` retorna `AuthTokens` (no `AuthResponse`) porque el endpoint real de dummyjson solo devuelve los tokens, no el perfil completo — tipado ajustado a la respuesta real de la API.

---

## Estructura del Proyecto

```
├── App.tsx                       # QueryClientProvider + RootNavigator
├── app.json                      # Configuración Expo
├── package.json                  # Dependencias (auth-session, secure-store, RHF, zod)
├── tsconfig.json                 # Configuración TypeScript estricta
├── README.md                     # Documentación de la entrega
└── src/
    ├── components/
    │   └── FormField.tsx         # Input reutilizable con label + error inline
    ├── schemas/
    │   └── authSchema.ts         # Esquemas Zod de login y registro
    ├── services/
    │   ├── tokenService.ts       # Wrapper de SecureStore (access + refresh token)
    │   ├── authService.ts        # login / register / refreshTokens / getProfile
    │   └── api.ts                # Instancia Axios con interceptor de refresh 401
    ├── stores/
    │   └── authStore.ts          # Zustand + persist (user, isAuthenticated) + SecureStore
    ├── navigation/
    │   ├── types.ts              # AuthStackParamList y AppStackParamList tipados
    │   ├── AuthNavigator.tsx     # Stack: Login, Register
    │   ├── AppNavigator.tsx      # Tabs: Producciones, Mi Perfil
    │   └── RootNavigator.tsx     # Alterna Auth/App según isAuthenticated
    ├── screens/
    │   ├── LoginScreen.tsx
    │   ├── RegisterScreen.tsx
    │   ├── HomeScreen.tsx        # Catálogo de producciones del dominio
    │   └── ProfileScreen.tsx     # Datos del usuario + logout
    ├── data/
    │   └── mockData.ts           # Catálogo de producciones (dominio)
    ├── theme/
    │   └── index.ts              # Tokens de diseño (misma paleta de semanas anteriores)
    └── types/
        └── index.ts              # Tipos de auth y del dominio
```

---

## Cómo ejecutar

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
