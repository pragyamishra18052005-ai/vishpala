import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function LoginScreen({ navigation }) {
  const [text, setText] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleLogin = () => {
    if (text.trim() === '') return;
    setIsChecking(true);
    
    // Simulate AI checking (3 seconds)
    setTimeout(() => {
      setIsChecking(false);
      navigation.navigate('Dashboard');
    }, 3000);
  };

  return (
    <View style={styles.container}>
      
      <Text style={styles.symbol}>🛡️</Text>
      <Text style={styles.title}>Verify Identity</Text>
      <Text style={styles.subtitle}>TYPE YOUR PHRASE TO AUTHENTICATE</Text>

      <View style={styles.divider} />

      <View style={styles.phraseBox}>
        <Text style={styles.phraseLabel}>TYPE THIS PHRASE:</Text>
        <Text style={styles.phrase}>"Vishpala returns to battle"</Text>
      </View>

      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
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