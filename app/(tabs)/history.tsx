import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/navbar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data, error } = await supabase
        .from('experiments')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Grouping data yang disimpan dalam rentang waktu berdekatan (2 detik)
        const groups = data.reduce((acc: any, item: any) => {
          const time = new Date(item.created_at).getTime();
          const groupKey = Math.floor(time / 2000); 

          if (!acc[groupKey]) acc[groupKey] = [];
          acc[groupKey].push(item);
          return acc;
        }, {});

        setHistory(Object.values(groups));
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: any[] }) => {
    const maxForce = Math.max(...item.map(o => o.force));
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.experimentLabel}>Experiment Session</Text>
            <Text style={styles.dateText}>
              {new Date(item[0].created_at).toLocaleString('id-ID')}
            </Text>
          </View>
          <View style={styles.objectBadge}>
            <Text style={styles.objectBadgeText}>{item.length} Objects</Text>
          </View>
        </View>
    
        <View style={styles.summaryBox}>
          {item.map((obj, idx) => (
            <View key={idx} style={styles.objRow}>
              <View style={styles.objInfo}>
                <View style={[styles.dot, { backgroundColor: obj.q1 > 0 ? '#4CAF50' : '#F44336' }]} />
                <Text style={styles.objLabel}>Object {idx + 1}: <Text style={{fontWeight: 'bold'}}>{obj.q1} nC</Text></Text>
              </View>
              <Text style={styles.objForce}>{obj.force.toExponential(2)} N</Text>
            </View>
          ))}
        </View>
      
        <View style={styles.insightBox}>
          <Text style={styles.insightText}>
             💡 <Text style={{fontWeight: 'bold'}}>:</Text> This scenario produces a maximum force of {maxForce.toExponential(2)} N.
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaProvider style={{ backgroundColor: "#f8f9fa" }}>
      <Navbar />
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Experiment History</Text>
        
        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#002467ff" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => item[0].id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 30 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No experiment history yet.</Text>
                <Text style={styles.emptySubText}>Data will appear here after you click 'Save' in the Virtual Lab.</Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginVertical: 20, color: '#002467ff' },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  experimentLabel: { fontSize: 14, fontWeight: '600', color: '#666' },
  dateText: { fontSize: 12, color: '#999', marginTop: 2 },
  objectBadge: { backgroundColor: '#e3f2fd', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  objectBadgeText: { color: '#1976d2', fontSize: 12, fontWeight: 'bold' },
  summaryBox: {
    backgroundColor: '#f1f3f5',
    borderRadius: 12,
    padding: 12,
  },
  objRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  objInfo: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  objLabel: { fontSize: 14, color: '#444' },
  objForce: { fontSize: 13, color: '#2196F3', fontWeight: '500' },
  insightBox: { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee' },
  insightText: { fontSize: 13, color: '#555', fontStyle: 'italic', lineHeight: 18 },
  emptyState: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#adb5bd' },
  emptySubText: { color: '#ced4da', marginTop: 8, textAlign: 'center' },
});