import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import KeystrokeService from '../utils/KeystrokeService';

const PHRASES = [
  "Vishpala returns to battle",
  "Iron will cannot be broken",
  "Identity flows from within",
  "The warrior types with purpose",
  "Ancient courage never fades"
];

export default function EnrollmentScreen({ navigation }) {
  const [name, setName] = useState('');
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const [text, setText] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleNameSubmit = () => {
    if (name.trim() === '') return;
    setNameSubmitted(true);
    KeystrokeService.startRecording();
  };

  const handleKeydown = (e) => {
    KeystrokeService.recordKeydown(e.nativeEvent.key);
  };

  const handleSubmit = () => {
    if (text.trim() === '') return;
    if (attempts < 4) {
      setAttempts(attempts + 1);
      setText('');
      KeystrokeService.startRecording();
    } else {
      setAttempts(5);
      setText('');
      KeystrokeService.stopRecording();
      const jsonData = KeystrokeService.getJSON();
      // user_id mein naam use karo
      jsonData.user_id = name.trim().toLowerCase().replace(/\s+/g, '_');
      console.log('User ID:', jsonData.user_id);
      console.log('Final Data:', JSON.stringify(jsonData));
      navigation.navigate('Login', { 
        keystrokeData: jsonData,
        userId: jsonData.user_id,
        userName: name.trim()
      });
    }
  };

  // Naam screen
  if (!nameSubmitted) {
    return (
      <View style={styles.container}>
        <Text style={styles.symbol}>⚔️</Text>
        <Text style={styles.title}>VISHPALA</Text>
        <Text style={styles.subtitle}>ENTER YOUR NAME TO BEGIN</Text>
        <View style={styles.divider} />
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Your name..."
          placeholderTextColor="#4A3A2A"
          autoCapitalize="words"
        />
        <TouchableOpacity style={styles.button} onPress={handleNameSubmit}>
          <Text style={styles.buttonText}>BEGIN ENROLLMENT →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Enrollment screen
  return (
    <View style={styles.container}>
      <Text style={styles.symbol}>⚔️</Text>
      <Text style={styles.title}>Enroll Your Identity</Text>
      <Text style={styles.userName}>👤 {name}</Text>
      <Text style={styles.subtitle}>Attempt {Math.min(attempts + 1, 5)} of 5</Text>

      <View style={styles.dotsRow}>
        {[1,2,3,4,5].map(i => (
          <View key={i} style={[styles.dot, i <= attempts && styles.dotFilled]} />
        ))}
      </View>

      <View style={styles.phraseBox}>
        <Text style={styles.phraseLabel}>TYPE THIS PHRASE:</Text>
        <Text style={styles.phrase}>"{PHRASES[Math.min(attempts, 4)]}"</Text>
      </View>

      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type here... (no copy paste!)"
        placeholderTextColor="#4A3A2A"
        contextMenuHidden={true}
        onKeyPress={handleKeydown}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>
          {attempts < 4 ? 'NEXT →' : 'COMPLETE ENROLLMENT'}
        </Text>
      </TouchableOpacity>

      {attempts >= 5 && (
        <Text style={styles.success}>✓ Enrollment Complete!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0A06', alignItems: 'center', justifyContent: 'center', padding: 24 },
  symbol: { fontSize: 40, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#E8D5A3', letterSpacing: 4, marginBottom: 8 },
  userName: { fontSize: 14, color: '#C8922A', letterSpacing: 2, marginBottom: 4 },
  subtitle: { fontSize: 12, color: '#A0896B', letterSpacing: 2, marginBottom: 24 },
  divider: { width: '60%', height: 1, backgroundColor: '#8B1A1A', marginBottom: 32 },
  dotsRow: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 1.5, borderColor: '#C8922A', backgroundColor: 'transparent' },
  dotFilled: { backgroundColor: '#C8922A' },
  phraseBox: { borderWidth: 1, borderColor: '#C8922A', borderRadius: 8, padding: 16, width: '100%', marginBottom: 20 },
  phraseLabel: { fontSize: 10, color: '#A0896B', letterSpacing: 2, marginBottom: 6 },
  phrase: { fontSize: 16, color: '#E8D5A3', fontStyle: 'italic', textAlign: 'center' },
  input: { width: '100%', borderBottomWidth: 1.5, borderBottomColor: '#8B1A1A', color: '#E8D5A3', fontSize: 16, paddingVertical: 12, marginBottom: 24 },
  button: { backgroundColor: '#8B1A1A', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 4 },
  buttonText: { color: '#E8D5A3', fontSize: 14, letterSpacing: 3, fontWeight: 'bold' },
  success: { marginTop: 24, color: '#C8922A', fontSize: 16, letterSpacing: 2 },
});