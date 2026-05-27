import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function DashboardScreen({ navigation }) {
  const score = 87;
  const risk = score >= 75 ? 'LOW' : score >= 50 ? 'MEDIUM' : 'HIGH';
  const color = score >= 75 ? '#2ECC71' : score >= 50 ? '#F39C12' : '#E74C3C';
  const action = score >= 75 ? 'ALLOWED' : score >= 50 ? '2FA REQUIRED' : 'BLOCKED';

  return (
    <View style={styles.container}>

      <Text style={styles.symbol}>🛡️</Text>
      <Text style={styles.title}>VISHPALA</Text>
      <Text style={styles.subtitle}>BEHAVIORAL ANALYSIS COMPLETE</Text>

      <View style={styles.divider} />

      {/* Score Circle */}
      <View style={[styles.scoreCircle, { borderColor: color }]}>
        <Text style={[styles.scoreNumber, { color: color }]}>{score}</Text>
        <Text style={styles.scoreLabel}>TRUST SCORE</Text>
      </View>

      {/* Risk Level */}
      <View style={[styles.riskBadge, { borderColor: color }]}>
        <Text style={[styles.riskText, { color: color }]}>RISK: {risk}</Text>
      </View>

      {/* Action */}
      <View style={[styles.actionBox, { backgroundColor: color + '22', borderColor: color }]}>
        <Text style={[styles.actionText, { color: color }]}>✓ ACCESS {action}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>47</Text>
          <Text style={styles.statLabel}>SIGNALS</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>22ms</Text>
          <Text style={styles.statLabel}>LATENCY</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>98%</Text>
          <Text style={styles.statLabel}>ACCURACY</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Logout */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Enrollment')}>
        <Text style={styles.buttonText}>← LOGOUT</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0A06', alignItems: 'center', justifyContent: 'center', padding: 24 },
  symbol: { fontSize: 40, marginBottom: 8 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#E8D5A3', letterSpacing: 8, marginBottom: 4 },
  subtitle: { fontSize: 10, color: '#A0896B', letterSpacing: 3, marginBottom: 16 },
  divider: { width: '60%', height: 1, backgroundColor: '#8B1A1A', marginVertical: 20 },
  scoreCircle: { width: 140, height: 140, borderRadius: 70, borderWidth: 3, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  scoreNumber: { fontSize: 52, fontWeight: 'bold' },
  scoreLabel: { fontSize: 10, color: '#A0896B', letterSpacing: 2 },
  riskBadge: { borderWidth: 1, borderRadius: 4, paddingHorizontal: 20, paddingVertical: 6, marginBottom: 16 },
  riskText: { fontSize: 12, letterSpacing: 3, fontWeight: 'bold' },
  actionBox: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 32, paddingVertical: 12, marginBottom: 32, width: '100%', alignItems: 'center' },
  actionText: { fontSize: 16, fontWeight: 'bold', letterSpacing: 2 },
  statsRow: { flexDirection: 'row', gap: 32, marginBottom: 8 },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: 'bold', color: '#E8D5A3' },
  statLabel: { fontSize: 9, color: '#A0896B', letterSpacing: 2 },
  button: { borderWidth: 1, borderColor: '#8B1A1A', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 4 },
  buttonText: { color: '#A0896B', fontSize: 12, letterSpacing: 3 },
});