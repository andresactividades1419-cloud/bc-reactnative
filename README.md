# Semana 09 — Animaciones Básicas (Productora de Eventos)

## Descripción del Dominio

Catálogo de producciones de la productora, con animaciones aplicadas para reforzar la experiencia de navegación: entrada en cascada del listado, feedback táctil en las tarjetas, y una barra de progreso animada que muestra el aforo vendido de cada evento (entradas vendidas / aforo máximo).

---

## Animaciones Implementadas

1. **Entrada en `DetailScreen`** (`Animated.parallel`): al abrir la ficha de un evento, el contenido aparece con fade in (opacity 0→1) + slide up (translateY 30→0) en 500ms.
2. **Feedback táctil en `AnimatedCard`** (`Animated.spring`): cada tarjeta de evento se comprime a escala 0.95 al presionar y rebota de vuelta a 1 al soltar.
3. **Barra de progreso en `ProgressBar`** (`interpolate`): el ancho y el color del aforo vendido se animan de 0% a 100%, pasando de rojo (poco vendido) a amarillo a verde (casi lleno), en 800ms.
4. **Entrada en cascada en `HomeScreen`** (`Animated.stagger(80, ...)`): las tarjetas de eventos aparecen una tras otra al cargar el catálogo.
5. **`LayoutAnimation` al agregar/eliminar eventos**: al presionar "Eliminar" en una producción o "+ Añadir evento", la transición de la lista se anima suavemente (`LayoutAnimation.Presets.easeInEaseOut`), incluyendo el flag de Android (`UIManager.setLayoutAnimationEnabledExperimental`).

Todas las animaciones de transformación (`opacity`, `scale`, `translateY`) usan `useNativeDriver: true`. Solo `width`/`backgroundColor` en `ProgressBar` usan `useNativeDriver: false`, porque esas propiedades no son animables en el hilo nativo.

---

## Estructura del Proyecto

```
├── App.tsx
├── app.json
├── package.json
├── tsconfig.json
├── README.md
└── src/
    ├── components/
    │   ├── AnimatedCard.tsx      # spring scale al presionar
    │   ├── AnimatedButton.tsx    # timing + spring en tap
    │   └── ProgressBar.tsx       # interpolate de ancho y color
    ├── navigation/
    │   ├── types.ts
    │   └── RootNavigator.tsx
    ├── screens/
    │   ├── HomeScreen.tsx        # stagger + LayoutAnimation
    │   └── DetailScreen.tsx      # fade in + slide up al montar
    ├── theme/
    │   └── index.ts
    └── types/
        └── index.ts
```

---

## Cómo ejecutar

```bash
pnpm install
npx expo start
```

Escanea el QR con Expo Go o presiona `i` (iOS) / `a` (Android) en el simulador.

Para verificar que el código cumple con TypeScript estricto:
```bash
npx tsc --noEmit
```
