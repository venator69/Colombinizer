import React, { useState } from 'react';
import { Alert, StyleSheet, View, TextInput, TouchableOpacity, Text, ScrollView } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function signUpWithEmail() {
    if (!email || !password) {
      Alert.alert("Error", "Email and password must not be empty!");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        Alert.alert("Registration Failed", error.message);
      } else {
        Alert.alert("Success!", "User created successfully. Please log in.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function signInWithEmail() {
    if (!email || !password) {
      Alert.alert("Error", "Enter your email and password to log in.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert("Login failed", error.message);
    } else {
      router.replace('/home');
    }
    setLoading(false);
  }

  return (
    <SafeAreaProvider style={{ backgroundColor: "#EEEEEEff" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 40 }}>
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={styles.containerStyle}>
            <Text style={styles.titleText}>Columbinizer</Text>
            
            <TextInput
              style={styles.textInputStyle}
              onChangeText={setEmail}
              value={email}
              placeholder="Enter Your Email"
              placeholderTextColor="#999"
              autoCapitalize={'none'}
            />

            <TextInput
              style={styles.textInputStyle}
              onChangeText={setPassword}
              value={password}
              secureTextEntry={true}
              placeholder="Enter Your Password"
              placeholderTextColor="#999"
              autoCapitalize={'none'}
            />

            <TouchableOpacity 
              style={[styles.button, styles.loginButton]} 
              onPress={signInWithEmail}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? "LOADING..." : "Login"}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.registerButton]} 
              onPress={signUpWithEmail}
              disabled={loading}
            >
              <Text style={[styles.buttonText, { color: '#002467ff' }]}>Register</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    maxWidth: 800,
    width: '90%',
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  textInputStyle: {
    height: 50,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 6,
    paddingHorizontal: 8,
    backgroundColor: "white",
    marginBottom: 16,
    fontSize: 15,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButton: {
    backgroundColor: '#002467ff',
  },
  registerButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#002467ff',
  },
  description: {
    fontSize: 15,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});