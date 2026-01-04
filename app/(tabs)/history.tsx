import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, useWindowDimensions, Platform } from 'react-native';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/navbar'; 
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function HistoryScreen() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const insets = useSafeAreaInsets();

  const fetchHistory = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser(); //
    
    if (user) {
      setIsLoggedIn(true);
      const { data, error } = await supabase
        .from('experiments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const groups = data.reduce((acc: any, item: any) => {
          const time = new Date(item.created_at).getTime();
          const groupKey = Math.floor(time / 2000); 

          if (!acc[groupKey]) acc[groupKey] = [];
          acc[groupKey].push(item);
          return acc;
        }, {});

        setHistory(Object.values(groups));
      }
    } else {
      setIsLoggedIn(false);
      setHistory([]);
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
                <Text style={[styles.objLabel, isMobile && { fontSize: 13 }]}>
                  Object {idx + 1}: <Text style={{fontWeight: 'bold'}}>{obj.q1} nC</Text>
                </Text>
              </View>
              <Text style={[styles.objForce, isMobile && { fontSize: 12 }]}>
                {obj.force.toExponential(2)} N
              </Text>
            </View>
          ))}
        </View>
      
        <View style={styles.insightBox}>
          <Text style={[styles.insightText, isMobile && { fontSize: 12 }]}>
            💡 <Text style={{fontWeight: 'bold'}}>Insight:</Text> This scenario produces a maximum force of {maxForce.toExponential(2)} N.
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaProvider style={{ backgroundColor: "#f8f9fa" }}>
      <View style={[
        styles.mainWrapper, 
        { paddingBottom: Platform.OS === 'web' ? 0 : insets.bottom }
      ]}>
        
        {Platform.OS === 'web' && <Navbar />}
        
        <View style={styles.contentWrapper}>
          <View style={[
            styles.listWrapper,
            { maxWidth: isMobile ? '100%' : 900 }
          ]}>
            <Text style={[styles.title, isMobile && { fontSize: 24 }]}>
              Experiment History
            </Text>
            
            {loading && !refreshing ? (
              <ActivityIndicator size="large" color="#002467" style={{ marginTop: 50 }} />
            ) : (
              <FlatList
                data={history}
                keyExtractor={(item) => item[0].id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: Platform.OS === 'web' ? 40 : 150 }} 
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                  <View style={styles.emptyState}>
                    {!isLoggedIn ? (
                      <>
                        <Text style={[styles.emptyText, { color: '#F44336' }]}>Please Login First</Text>
                        <TouchableOpacity 
                          style={styles.loginButton} 
                          onPress={() => router.push('/(auth)/login')}
                        >
                          <Text style={styles.loginButtonText}>Go to Login</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <Text style={styles.emptyText}>No experiment history yet.</Text>
                    )}
                  </View>
                }
              />
            )}
          </View>
        </View>

        {Platform.OS !== 'web' && <Navbar />}
        
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  listWrapper: { 
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginVertical: 20, 
    color: '#002467',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
  objInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  objLabel: { fontSize: 14, color: '#444', flex: 1 },
  objForce: { fontSize: 13, color: '#2196F3', fontWeight: '500' },
  insightBox: { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee' },
  insightText: { fontSize: 13, color: '#555', fontStyle: 'italic', lineHeight: 18 },
  emptyState: { alignItems: 'center', marginTop: 100, paddingHorizontal: 20 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#adb5bd', textAlign: 'center' },
  loginButton: {
    marginTop: 20,
    backgroundColor: '#002467',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
  },
  loginButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});