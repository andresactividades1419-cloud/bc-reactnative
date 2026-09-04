// ============================================================
// APP ENTRY POINT — App.tsx
// Dominio: Productora de Eventos (Pesos Colombianos COP)
// Semana 05: TanStack Query v5 + React Navigation 7
// ============================================================

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation/RootNavigator';

// QueryClient singleton fuera del componente para evitar recreaciones en re-renders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutos de frescura en caché
      retry: 2, // Reintenta hasta 2 veces ante fallos de red
      refetchOnWindowFocus: false, // En React Native se desactiva refetch por foco de ventana
    },
  },
});

export default function App(): React.JSX.Element {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
