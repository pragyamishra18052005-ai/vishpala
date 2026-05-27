import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';

const SUPABASE_URL = 'https://svsslnlchpekoyrzqyqw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_f2cxBGUMYbR8eFOuD70RdQ_KmPouH8E';

export default function AdminScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, low: 0, medium: 0, high: 0, avgScore: 0 });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const usersRes = await fetch(`${SUPABASE_URL}/rest/v1/users?select=*`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
      });
      const usersData = await usersRes.json();
      setUsers(usersData);

      const sessionsRes = await fetch(`${SUPABASE_URL}/rest/v1/sessions?select=*&order=created_at.desc`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
      });
      const sessionsData = await sessionsRes.json();
      setSessions(sessionsData);

      const low = sessionsData.filter(s => s.risk === 'LOW').length;
      const medium = sessionsData.filter(s => s.risk === 'MEDIUM').length;
      const high = sessionsData.filter(s => s.risk === 'HIGH').length;
      const avgScore = sessionsData.length > 0
        ? Math.round(sessionsData.reduce((sum, s) => sum + s.score, 0) / sessionsData.length) : 0;

      setStats({ total: sessionsData.length, low, medium, high, avgScore });
      setLoading(false);
    } catch (err) { console.log('Error:', err); setLoading(false); }
  };

  const getRiskColor = (risk) => {
    if (risk === 'LOW') return '#2ECC71';
    if (risk === 'MEDIUM') return '#F39C12';
    return '#E74C3C';
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0D0A06' }}>
      <View style={{ padding: 24, paddingTop: 40, paddingBottom: 80 }}>

        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#E8D5A3', letterSpacing: 8 }}>⚔️ VISHPALA</Text>
          <Text style={{ fontSize: 10, color: '#A0896B', letterSpacing: 4, marginTop: 4 }}>ADMIN DASHBOARD</Text>
        </View>

        <View style={{ width: '60%', height: 1, backgroundColor: '#8B1A1A', alignSelf: 'center', marginVertical: 20 }} />

        {/* Back Button — UPAR */}
        <TouchableOpacity
          style={{ borderWidth: 1, borderColor: '#C8922A', borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 20 }}
          onPress={() => navigation.navigate('Enrollment')}>
          <Text style={{ color: '#C8922A', fontSize: 12, letterSpacing: 2 }}>← BACK TO APP</Text>
        </TouchableOpacity>

        {loading ? (
          <Text style={{ color: '#C8922A', textAlign: 'center', fontSize: 14, marginTop: 40 }}>Loading...</Text>
        ) : (
          <>
            <Text style={{ fontSize: 12, color: '#C8922A', letterSpacing: 3, marginBottom: 12 }}>📊 OVERVIEW</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
              {[['#C8922A', stats.total, 'TOTAL SESSIONS'], ['#3498DB', users.length, 'TOTAL USERS'], ['#2ECC71', stats.avgScore, 'AVG SCORE']].map(([color, val, label], i) => (
                <View key={i} style={{ flex: 1, borderWidth: 1, borderColor: color, borderRadius: 8, padding: 12, alignItems: 'center', marginHorizontal: 4 }}>
                  <Text style={{ fontSize: 28, fontWeight: 'bold', color }}>{val}</Text>
                  <Text style={{ fontSize: 8, color: '#A0896B', letterSpacing: 1, marginTop: 4, textAlign: 'center' }}>{label}</Text>
                </View>
              ))}
            </View>

            <Text style={{ fontSize: 12, color: '#C8922A', letterSpacing: 3, marginBottom: 12 }}>🎯 RISK DISTRIBUTION</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
              {[['#2ECC71', stats.low, 'LOW'], ['#F39C12', stats.medium, 'MEDIUM'], ['#E74C3C', stats.high, 'HIGH']].map(([color, val, label], i) => (
                <View key={i} style={{ flex: 1, borderWidth: 1, borderColor: color, borderRadius: 8, padding: 12, alignItems: 'center', marginHorizontal: 4 }}>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color }}>{val}</Text>
                  <Text style={{ fontSize: 9, color: '#A0896B', letterSpacing: 2, marginTop: 2 }}>{label}</Text>
                  <Text style={{ fontSize: 12, color: '#E8D5A3', marginTop: 4 }}>
                    {stats.total > 0 ? Math.round((val / stats.total) * 100) : 0}%
                  </Text>
                </View>
              ))}
            </View>

            <Text style={{ fontSize: 12, color: '#C8922A', letterSpacing: 3, marginBottom: 12 }}>👥 ENROLLED USERS</Text>
            {users.map((user, i) => (
              <View key={i} style={{ borderWidth: 1, borderColor: '#2A1A0A', borderRadius: 8, padding: 12, marginBottom: 8, backgroundColor: '#130900' }}>
                <Text style={{ fontSize: 14, color: '#E8D5A3', fontWeight: 'bold' }}>👤 {user.name || user.user_id}</Text>
                <Text style={{ fontSize: 10, color: '#A0896B', marginTop: 2 }}>{user.email}</Text>
              </View>
            ))}

            <Text style={{ fontSize: 12, color: '#C8922A', letterSpacing: 3, marginBottom: 12, marginTop: 8 }}>📋 RECENT SESSIONS</Text>
            {sessions.slice(0, 10).map((session, i) => (
              <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#2A1A0A', borderRadius: 8, padding: 12, marginBottom: 8, backgroundColor: '#130900' }}>
                <View>
                  <Text style={{ fontSize: 12, color: '#E8D5A3', fontWeight: 'bold' }}>{session.user_id}</Text>
                  <Text style={{ fontSize: 10, color: '#A0896B', marginTop: 2 }}>{new Date(session.session_id).toLocaleTimeString()}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 22, fontWeight: 'bold', color: getRiskColor(session.risk) }}>{session.score}</Text>
                  <Text style={{ fontSize: 9, color: getRiskColor(session.risk), letterSpacing: 2 }}>{session.risk}</Text>
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={{ backgroundColor: '#1A0D00', borderWidth: 1, borderColor: '#C8922A', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 16 }}
              onPress={fetchData}>
              <Text style={{ color: '#C8922A', fontSize: 12, letterSpacing: 2 }}>🔄 REFRESH DATA</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ borderWidth: 1, borderColor: '#8B1A1A', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 12 }}
              onPress={() => navigation.navigate('Enrollment')}>
              <Text style={{ color: '#A0896B', fontSize: 12, letterSpacing: 2 }}>← BACK TO APP</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}