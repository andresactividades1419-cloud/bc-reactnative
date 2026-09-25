import React, { useEffect, useRef } from 'react';
import {
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProgressBar } from '../components/ProgressBar';
import { COLORS, SPACING } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Detail'>;

// Misma fuente de datos que HomeScreen — en un proyecto real vendría de
// TanStack Query / el store compartido, tal como en semanas anteriores.
const EVENT_DETAILS: Record<
  string,
  {
    name: string;
    client: string;
    category: string;
    location: string;
    date: string;
    budget: string;
    capacity: number;
    ticketsSold: number;
    progress: number;
  }
> = {
  'evt-101': {
    name: 'Festival Neon Lights 2026',
    client: 'LiveNation Colombia',
    category: 'Festival',
    location: 'Centro de Eventos Valle del Pacífico, Cali',
    date: '25 Oct 2026',
    budget: '$ 340.000.000 COP',
    capacity: 18000,
    ticketsSold: 14400,
    progress: 0.8,
  },
  'evt-102': {
    name: 'Gala Anual Tech Summit',
    client: 'Globant Enterprise',
    category: 'Conferencia',
    location: 'Hotel Grand Hyatt, Bogotá',
    date: '12 Nov 2026',
    budget: '$ 128.000.000 COP',
    capacity: 1500,
    ticketsSold: 675,
    progress: 0.45,
  },
  'evt-103': {
    name: 'Boda Real Cardoza & Silva',
    client: 'Familia Cardoza',
    category: 'Boda',
    location: 'Hacienda San Rafael, Sopó',
    date: '05 Dic 2026',
    budget: '$ 98.000.000 COP',
    capacity: 350,
    ticketsSold: 70,
    progress: 0.2,
  },
  'evt-104': {
    name: 'Lanzamiento Corporativo BMW iX',
    client: 'BMW Group Colombia',
    category: 'Corporativo',
    location: 'Club El Nogal, Bogotá',
    date: '28 Feb 2027',
    budget: '$ 180.000.000 COP',
    capacity: 600,
    ticketsSold: 390,
    progress: 0.65,
  },
};

export function DetailScreen({ route }: Props): React.JSX.Element {
  const { eventId } = route.params;

  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacityAnim, translateYAnim]);

  const event = EVENT_DETAILS[eventId] ?? {
    name: `Evento ${eventId}`,
    client: 'Cliente no encontrado',
    category: '—',
    location: 'Producción eliminada del catálogo',
    date: '—',
    budget: '$ 0 COP',
    capacity: 0,
    ticketsSold: 0,
    progress: 0,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View
          style={{
            opacity: opacityAnim,
            transform: [{ translateY: translateYAnim }],
          }}
        >
          <View style={styles.card}>
            <Text style={styles.categoryBadge}>{event.category}</Text>
            <Text style={styles.name}>{event.name}</Text>
            <Text style={styles.description}>Cliente: {event.client}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Aforo Vendido</Text>
            <ProgressBar
              progress={event.progress}
              label={`${event.ticketsSold} / ${event.capacity} asistentes`}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Ficha Técnica</Text>
            <Text style={styles.detailRow}>
              <Text style={styles.detailLabel}>Lugar: </Text>
              <Text style={styles.detailValue}>{event.location}</Text>
            </Text>
            <Text style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fecha: </Text>
              <Text style={styles.detailValue}>{event.date}</Text>
            </Text>
            <Text style={styles.detailRow}>
              <Text style={styles.detailLabel}>Presupuesto: </Text>
              <Text style={styles.detailValue}>{event.budget}</Text>
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  categoryBadge: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  name: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '700',
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  sectionTitle: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailRow: {
    fontSize: 14,
  },
  detailLabel: {
    color: COLORS.textMuted,
  },
  detailValue: {
    color: COLORS.text,
  },
});
