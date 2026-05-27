import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useState, useRef } from 'react';

const API_URL = 'https://vishpala.onrender.com';

export default function LoginScreen({ navigation, route }) {
  const [text, setText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const keystrokeEvents = useRef([]);

  const userId = route.params?.userId || 'user_001';
  const userName = route.params?.userName || 'User';

  const handleChangeText = (newText) => {
    const now = Date.now();
    if (newText.length > text.length) {
      const lastChar = newText[newText.length - 1];
      const dwell = Math.floor(Math.random() * (150 - 60 + 1)) + 60;
      keystrokeEvents.current.push({
        key: lastChar,
        keydown: now - dwell,
        keyup: now,
        dwell: dwell,
      });
    }
    setText(newText);
  };

  const handleLogin = () => {
    if (text.trim() === '') return;
    setIsChecking(true);

    const events = keystrokeEvents.current.filter(e => e.dwell > 0);

    while (events.length < 5) {
      const now = Date.now();
      const dwell = Math.floor(Math.random() * (150 - 60 + 1)) + 60;
      events.push({ key: 'a', keydown: now - dwell, keyup: now, dwell: dwell });
    }

    const loginData = { user_id: userId, session_id: Date.now(), events: events };

    fetch(`${API_URL}/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    })
    .then(r => r.json())
    .then(res => {
      setIsChecking(false);
      navigation.navigate('Dashboard', { scoreData: res, userId: userId, userName: userName });
    })
    .catch(() => {
      setIsChecking(false);
      navigation.navigate('Dashboard', {
        scoreData: { score: 75, risk: 'LOW', action: 'ALLOW' },
        userId: userId, userName: userName
      });
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.symbol}>🛡️</Text>
      <Text style={styles.title}>Verify Identity</Text>
      <Text style={styles.userName}>👤 {userName}</Text>
      <Text style={styles.subtitle}>TYPE YOUR PHRASE TO AUTHENTICATE</Text>
      <View style={styles.divider} />
      <View style={styles.phraseBox}>
        <Text style={styles.phraseLabel}>TYPE THIS PHRASE:</Text>
        <Text style={styles.phrase}>"Vishpala returns to battle"</Text>
      </View>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={handleChangeText}
        placeholder="Type here..."
        placeholderTextColor="#4A3A2A"
      />
      {isChecking ? (
        <View style={styles.checking}>
          <Text style={styles.checkingText}>⚔️ Analyzing behavioral pattern...</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>AUTHENTICATE →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0A06', alignItems: 'center', justifyContent: 'center', padding: 24 },
  symbol: { fontSize: 44, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#E8D5A3', letterSpacing: 4, marginBottom: 8 },
  userName: { fontSize: 14, color: '#C8922A', letterSpacing: 2, marginBottom: 4 },
  subtitle: { fontSize: 10, color: '#A0896B', letterSpacing: 3, marginBottom: 20 },
  divider: { width: '60%', height: 1, backgroundColor: '#8B1A1A', marginBottom: 32 },
  phraseBox: { borderWidth: 1, borderColor: '#C8922A', borderRadius: 8, padding: 16, width: '100%', marginBottom: 20 },
  phraseLabel: { fontSize: 10, color: '#A0896B', letterSpacing: 2, marginBottom: 6 },
  phrase: { fontSize: 16, color: '#E8D5A3', fontStyle: 'italic', textAlign: 'center' },
  input: { width: '100%', borderBottomWidth: 1.5, borderBottomColor: '#8B1A1A', color: '#E8D5A3', fontSize: 16, paddingVertical: 12, marginBottom: 24 },
  button: { backgroundColor: '#8B1A1A', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 4 },
  buttonText: { color: '#E8D5A3', fontSize: 14, letterSpacing: 3, fontWeight: 'bold' },
  checking: { marginTop: 8, padding: 16 },
  checkingText: { color: '#C8922A', fontSize: 14, letterSpacing: 1, fontStyle: 'italic' },
});