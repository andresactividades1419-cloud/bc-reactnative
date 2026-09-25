import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  LayoutAnimation,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AnimatedCard } from '../components/AnimatedCard';
import { AnimatedButton } from '../components/AnimatedButton';
import { ProgressBar } from '../components/ProgressBar';
import { COLORS, SPACING } from '../theme';
import type { EventItem } from '../types';
import type { RootStackParamList } from '../navigation/types';

// Android requiere este flag para habilitar LayoutAnimation.
// Debe llamarse fuera del componente, a nivel de módulo.
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const SAMPLE_EVENTS: EventItem[] = [
  {
    id: 'evt-101',
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
  {
    id: 'evt-102',
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
  {
    id: 'evt-103',
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
  {
    id: 'evt-104',
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
];

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props): React.JSX.Element {
  const [events, setEvents] = useState<EventItem[]>(SAMPLE_EVENTS);

  // Un Animated.Value por evento para la entrada en cascada.
  const itemAnims = useRef(SAMPLE_EVENTS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      80,
      itemAnims.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [itemAnims]);

  const handleRemoveEvent = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const handleAddEvent = () => {
    const capacity = 500 + Math.round(Math.random() * 2000);
    const ticketsSold = Math.round(capacity * Math.random());
    const newEvent: EventItem = {
      id: Date.now().toString(),
      name: `Nueva Producción ${events.length + 1}`,
      client: 'Cliente por confirmar',
      category: 'Corporativo',
      location: 'Por definir',
      date: 'Por definir',
      budget: '$ 0 COP',
      capacity,
      ticketsSold,
      progress: capacity > 0 ? ticketsSold / capacity : 0,
    };
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setEvents((prev) => [...prev, newEvent]);
  };

  const renderItem = ({ item, index }: { item: EventItem; index: number }) => {
    // Los eventos añadidos dinámicamente no tienen anim de entrada asociado
    // (solo la carga inicial se anima en cascada); se muestran directamente.
    const anim = itemAnims[index];

    const content = (
      <AnimatedCard
        onPress={() => navigation.navigate('Detail', { eventId: item.id })}
        style={styles.card}
      >
        <View style={styles.badgeRow}>
          <Text style={styles.categoryBadge}>{item.category}</Text>
        </View>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>Cliente: {item.client}</Text>
        <ProgressBar
          progress={item.progress}
          label={`Aforo vendido (${item.ticketsSold}/${item.capacity})`}
        />
        <AnimatedButton
          label="Eliminar"
          variant="success"
          onPress={() => handleRemoveEvent(item.id)}
        />
      </AnimatedCard>
    );

    if (!anim) {
      return content;
    }

    return (
      <Animated.View
        style={{
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}
      >
        {content}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Productora de Eventos</Text>
            <Text style={styles.subtitle}>{events.length} producciones activas</Text>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <AnimatedButton label="+ Añadir evento" onPress={handleAddEvent} />
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  list: {
    padding: SPACING.xl,
    gap: SPACING.md,
  },
  header: {
    marginBottom: SPACING.md,
  },
  title: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: '700',
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  card: {
    gap: SPACING.sm,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  categoryBadge: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  itemName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
  },
  itemDescription: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  separator: {
    height: SPACING.md,
  },
  footer: {
    marginTop: SPACING.xl,
  },
});
