import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export default function DashboardScreen({ navigation, route }) {
  const [score, setScore] = useState(0);
  const [risk, setRisk] = useState('...');
  const [action, setAction] = useState('CHECKING');
  const [color, setColor] = useState('#C8922A');
  const [loading, setLoading] = useState(true);
  const [show2FA, setShow2FA] = useState(false);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [showAdminInput, setShowAdminInput] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const userId = route.params?.userId || 'user_001';
  const userName = route.params?.userName || 'User';

  useEffect(() => {
    const scoreData = route.params?.scoreData;
    if (scoreData) {
      const s = scoreData.score ?? 0;
      const r = scoreData.risk ?? 'LOW';
      const a = scoreData.action === 'ALLOW' ? 'ALLOWED' :
                scoreData.action === '2FA' ? '2FA REQUIRED' : 'BLOCKED';
      const c = s >= 75 ? '#2ECC71' : s >= 40 ? '#F39C12' : '#E74C3C';
      setScore(s);
      setRisk(r);
      setAction(a);
      setColor(c);
      setLoading(false);
      saveSession(s, r, scoreData.action);
      if (scoreData.action === '2FA') generateOTP();
    } else {
      setScore(55);
      setRisk('LOW');
      setAction('ALLOWED');
      setColor('#2ECC71');
      setLoading(false);
      saveSession(55, 'LOW', 'ALLOW');
    }
  }, []);

  const saveSession = async (s, r, a) => {
    try {
      await supabase.from('users').upsert({ 
        user_id: userId, name: userName, 
        email: `${userId}@vishpala.com` 
      }, { onConflict: 'user_id' });
      await supabase.from('sessions').insert({
        user_id: userId, session_id: Date.now(),
        score: s, risk: r, action: a,
      });
      console.log('✅ Saved!');
    } catch (err) { console.log('Error:', err); }
  };

  const generateOTP = () => {
    fetch('http://127.0.0.1:8000/generate-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId })
    })
    .then(r => r.json())
    .then(res => { setGeneratedOtp(res.otp); setShow2FA(true); })
    .catch(() => setShow2FA(true));
  };

  const verifyOTP = () => {
    fetch('http://127.0.0.1:8000/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, otp: otp })
    })
    .then(r => r.json())
    .then(res => {
      if (res.verified) {
        setOtpVerified(true); setShow2FA(false);
        setAction('ALLOWED'); setColor('#2ECC71');
        setRisk('LOW'); setOtpError('');
      } else { setOtpError('❌ Wrong OTP!'); }
    })
    .catch(() => setOtpError('❌ Error verifying OTP'));
  };

  const handleAdminAccess = () => {
    if (adminPassword === 'admin123') {
      setShowAdminInput(false);
      setAdminPassword('');
      setAdminError('');
      navigation.navigate('Admin');
    } else {
      setAdminError('❌ Wrong Password!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.symbol}>🛡️</Text>
      <Text style={styles.title}>VISHPALA</Text>
      <Text style={styles.userName}>👤 {userName}</Text>
      <Text style={styles.subtitle}>BEHAVIORAL ANALYSIS COMPLETE</Text>
      <View style={styles.divider} />

      {loading ? (
        <Text style={styles.loading}>⚔️ Analyzing...</Text>
      ) : show2FA ? (
        <View style={styles.otpContainer}>
          <Text style={styles.otpTitle}>⚠️ VERIFICATION REQUIRED</Text>
          <Text style={styles.otpSubtitle}>Suspicious pattern detected</Text>
          <View style={styles.otpBox}>
            <Text style={styles.otpLabel}>YOUR OTP:</Text>
            <Text style={styles.otpCode}>{generatedOtp}</Text>
            <Text style={styles.otpHint}>(Real app mein SMS pe aata)</Text>
          </View>
          <TextInput
            style={styles.otpInput}
            value={otp}
            onChangeText={setOtp}
            placeholder="Enter OTP..."
            placeholderTextColor="#4A3A2A"
            keyboardType="numeric"
            maxLength={6}
          />
          {otpError ? <Text style={styles.otpError}>{otpError}</Text> : null}
          <TouchableOpacity style={styles.otpButton} onPress={verifyOTP}>
            <Text style={styles.otpButtonText}>VERIFY OTP →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Enrollment')}>
            <Text style={styles.buttonText}>← LOGOUT</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={[styles.scoreCircle, { borderColor: color }]}>
            <Text style={[styles.scoreNumber, { color }]}>{score}</Text>
            <Text style={styles.scoreLabel}>TRUST SCORE</Text>
          </View>
          <View style={[styles.riskBadge, { borderColor: color }]}>
            <Text style={[styles.riskText, { color }]}>RISK: {risk}</Text>
          </View>
          <View style={[styles.actionBox, { backgroundColor: color + '22', borderColor: color }]}>
            <Text style={[styles.actionText, { color }]}>
              {otpVerified ? '✓ IDENTITY VERIFIED VIA 2FA' : `✓ ACCESS ${action}`}
            </Text>
          </View>
          {otpVerified && (
            <Text style={styles.verifiedNote}>2FA verification successful ✅</Text>
          )}

          {/* Admin Access — score ke neeche */}
          {showAdminInput ? (
            <View style={styles.adminInputBox}>
              <Text style={styles.adminInputLabel}>🔐 ADMIN PASSWORD:</Text>
              <TextInput
                style={styles.adminInput}
                value={adminPassword}
                onChangeText={setAdminPassword}
                placeholder="Enter password..."
                placeholderTextColor="#4A3A2A"
                secureTextEntry={true}
              />
              {adminError ? <Text style={styles.adminError}>{adminError}</Text> : null}
              <TouchableOpacity style={styles.adminBtn} onPress={handleAdminAccess}>
                <Text style={styles.adminText}>ENTER →</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setShowAdminInput(false); setAdminError(''); }}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.adminBtn} onPress={() => setShowAdminInput(true)}>
              <Text style={styles.adminText}>📊 ADMIN DASHBOARD</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      <View style={styles.divider} />
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
  userName: { fontSize: 14, color: '#C8922A', letterSpacing: 2, marginBottom: 4 },
  subtitle: { fontSize: 10, color: '#A0896B', letterSpacing: 3, marginBottom: 16 },
  divider: { width: '60%', height: 1, backgroundColor: '#8B1A1A', marginVertical: 20 },
  loading: { color: '#C8922A', fontSize: 16, letterSpacing: 2, fontStyle: 'italic' },
  scoreCircle: { width: 140, height: 140, borderRadius: 70, borderWidth: 3, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  scoreNumber: { fontSize: 52, fontWeight: 'bold' },
  scoreLabel: { fontSize: 10, color: '#A0896B', letterSpacing: 2 },
  riskBadge: { borderWidth: 1, borderRadius: 4, paddingHorizontal: 20, paddingVertical: 6, marginBottom: 16 },
  riskText: { fontSize: 12, letterSpacing: 3, fontWeight: 'bold' },
  actionBox: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 32, paddingVertical: 12, marginBottom: 16, width: '100%', alignItems: 'center' },
  actionText: { fontSize: 16, fontWeight: 'bold', letterSpacing: 2 },
  adminInputBox: { width: '100%', marginTop: 16, marginBottom: 8 },
  adminInputLabel: { fontSize: 10, color: '#C8922A', letterSpacing: 2, marginBottom: 8 },
  adminInput: { width: '100%', borderBottomWidth: 1.5, borderBottomColor: '#C8922A', color: '#E8D5A3', fontSize: 16, paddingVertical: 8, marginBottom: 12 },
  adminError: { color: '#E74C3C', fontSize: 11, marginBottom: 8 },
  adminBtn: { borderWidth: 1, borderColor: '#C8922A', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 4, marginTop: 12, width: '100%', alignItems: 'center' },
  adminText: { color: '#C8922A', fontSize: 12, letterSpacing: 2 },
  cancelText: { color: '#4A3A2A', fontSize: 11, textAlign: 'center', marginTop: 8 },
  button: { borderWidth: 1, borderColor: '#8B1A1A', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 4, marginTop: 8, width: '100%', alignItems: 'center' },
  buttonText: { color: '#A0896B', fontSize: 12, letterSpacing: 3 },
  otpContainer: { width: '100%', alignItems: 'center' },
  otpTitle: { fontSize: 18, fontWeight: 'bold', color: '#F39C12', letterSpacing: 2, marginBottom: 8 },
  otpSubtitle: { fontSize: 11, color: '#A0896B', marginBottom: 24, letterSpacing: 1 },
  otpBox: { borderWidth: 1, borderColor: '#F39C12', borderRadius: 8, padding: 16, width: '100%', alignItems: 'center', marginBottom: 20 },
  otpLabel: { fontSize: 10, color: '#A0896B', letterSpacing: 2, marginBottom: 8 },
  otpCode: { fontSize: 36, fontWeight: 'bold', color: '#F39C12', letterSpacing: 8 },
  otpHint: { fontSize: 9, color: '#4A3A2A', marginTop: 6 },
  otpInput: { width: '100%', borderBottomWidth: 1.5, borderBottomColor: '#F39C12', color: '#E8D5A3', fontSize: 24, paddingVertical: 12, marginBottom: 16, textAlign: 'center', letterSpacing: 8 },
  otpError: { color: '#E74C3C', fontSize: 12, marginBottom: 12 },
  otpButton: { backgroundColor: '#F39C12', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 4, marginBottom: 16 },
  otpButtonText: { color: '#0D0A06', fontSize: 14, letterSpacing: 3, fontWeight: 'bold' },
  verifiedNote: { fontSize: 12, color: '#2ECC71', letterSpacing: 1, marginBottom: 8 },
});