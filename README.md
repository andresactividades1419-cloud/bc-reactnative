# Semana 01 — App de Tarjetas (Productora de Eventos)

> **Aprendiz:** ANDRES FELIPE FERNANDEZ CARDOZA  
> **Ficha:** 3228970  
> **Bootcamp:** `bc-reactnative` — Semana 01 (Core Components y Flexbox)

---

## Dominio Asignado

**Productora de Eventos**: Aplicación móvil para la visualización y gestión inicial de tarjetas de producciones y eventos en vivo (conciertos masivos, bodas campestres, conferencias tech y festivales).

- **Recurso Principal (`EventItem`):**
  - `id`: Identificador único de la producción
  - `name`: Nombre comercial del evento (ej: *Festival Neon Lights 2026*, *Boda Real Campestre*)
  - `category`: Tipo de evento (*Concierto*, *Boda*, *Conferencia*, *Festival*, *Corporativo*)
  - `date`: Fecha programada
  - `location`: Recinto o locación del evento
  - `budget`: Presupuesto asignado en **Pesos Colombianos (COP)** con formato de miles
  - `capacity`: Aforo máximo de asistentes
  - `status`: Estado actual de producción (*Confirmado*, *En Producción*, *Planificación*)
  - `imageUrl`: Imagen ilustrativa del montaje o locación
  - `description`: Sinopsis técnica del evento

---

## Características y Requisitos Implementados

1. **Uso de Core Components Nativos:**
   - Estructuración exclusiva con `View`, `Text`, `Image`, `ScrollView` y `Pressable`.
   - Sin uso de librerías externas de UI.
2. **Layout con Flexbox Nativo:**
   - Maquetación responsiva con `flexDirection`, `justifyContent` y `alignItems`.
   - Distribución limpia sin posicionamiento absoluto innecesario (`position: absolute`).
3. **Estilos Estandarizados (`StyleSheet.create`):**
   - 100% de los estilos definidos mediante `StyleSheet.create` con arquitectura modular.
   - Cero estilos inline (`style={{ ... }}`).
4. **Componente Reutilizable (`ItemCard.tsx`):**
   - Tarjeta con imagen de cabecera, badges de estado con color contextual, etiqueta de categoría, fecha, locación, aforo y presupuesto en COP.
   - `Pressable` interactivo con feedback visual de opacidad al presionar.
5. **Pantalla Principal (`HomeScreen.tsx`):**
   - Header corporativo con identidad de la productora.
   - Barra de métricas (resumen de producciones activas).
   - Lista scrollable (`ScrollView`) con los eventos del dominio.
6. **TypeScript Estricto:**
   - Tipado explícito de interfaces (`EventItem`) y props (`ItemCardProps`).
   - Cero uso de `any`.

---

## Estructura del Proyecto

```
├── App.tsx                     # Entry point de la aplicación
├── app.json                    # Configuración Expo
├── package.json                # Dependencias y scripts
├── tsconfig.json               # Configuración TypeScript
├── README.md                   # Documentación de la entrega
└── src/
    ├── types/
    │   └── index.ts            # Definición de la interfaz EventItem
    ├── data/
    │   └── mockData.ts         # Datos iniciales (4 eventos del dominio)
    ├── components/
    │   └── ItemCard.tsx        # Tarjeta reutilizable con Flexbox nativo
    └── screens/
        └── HomeScreen.tsx      # Pantalla principal con ScrollView y métricas
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

Para validar tipos con TypeScript estricto:
```bash
npx tsc --noEmit
```
