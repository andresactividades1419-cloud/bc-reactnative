import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { EventItem } from '../types';
import { ItemCard } from '../components/ItemCard';
import { MOCK_EVENTS } from '../data/mockData';

export function HomeScreen(): React.JSX.Element {
  const DOMAIN_TITLE = 'Productora de Eventos';
  const DOMAIN_SUBTITLE = 'Gestión de Producciones, Eventos & Logística';

  function handleEventPress(event: EventItem): void {
    console.log('Evento seleccionado:', event.name);
    Alert.alert(
      `🎉 ${event.name}`,
      `Cliente: ${event.client}\nFecha: ${event.date}\nLugar: ${event.location}\nPresupuesto: ${event.budget}`,
      [{ text: 'Entendido', style: 'default' }]
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0d1117" />

      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{DOMAIN_TITLE}</Text>
          <Text style={styles.headerSubtitle}>{DOMAIN_SUBTITLE}</Text>
        </View>

        <View style={styles.summaryBar}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{MOCK_EVENTS.length}</Text>
            <Text style={styles.summaryLabel}>Eventos Activos</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>$202K USD</Text>
            <Text style={styles.summaryLabel}>Presupuesto Total</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>27.850</Text>
            <Text style={styles.summaryLabel}>Aforo Estimado</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Próximas Producciones</Text>

        {MOCK_EVENTS.map((event) => (
          <ItemCard
            key={event.id}
            item={event}
            onPress={handleEventPress}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#21262d',
    backgroundColor: '#161b22',
  },
  headerTitleContainer: {
    marginBottom: 12,
  },
  headerBadge: {
    color: '#238636',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#8b949e',
    marginTop: 2,
  },
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: '#0d1117',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#30363d',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    color: '#58a6ff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  summaryLabel: {
    color: '#8b949e',
    fontSize: 10,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#30363d',
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  sectionTitle: {
    color: '#f0f6fc',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 14,
    letterSpacing: 0.5,
  },
});
