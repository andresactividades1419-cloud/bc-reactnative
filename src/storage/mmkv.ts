// src/storage/mmkv.ts
// Instancia global de MMKV para toda la aplicación (Productora de Eventos).
// Proporciona almacenamiento clave-valor síncrono y de altísimo rendimiento vía JSI.

import { createMMKV, type MMKV } from 'react-native-mmkv';

export const storage: MMKV = createMMKV({ id: 'event-production-storage' });
