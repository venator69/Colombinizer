import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, ScrollView, Alert, Image } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [secureText, setSecureText] = useState(true);
  const router = useRouter();

  async function signUpWithEmail() {
    if (!email || !password) {
      setErrorMessage("Email and password must not be empty!");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          setErrorMessage("Account already registered, please login!");
        } else {
          setErrorMessage(error.message);
        }
      } else {
        Alert.alert("Success!", "User created successfully. Please log in.");
      }
    } catch (err) {
      setErrorMessage("System error during registration.");
    } finally {
      setLoading(false);
    }
  }

  async function signInWithEmail() {
    if (!email || !password) {
      setErrorMessage("Enter your email and password to log in.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setErrorMessage("Email or password incorrect. Please try again.");
        } else {
          setErrorMessage(error.message);
        }
      } else {
        router.replace('/home');
      }
    } catch (err) {
      setErrorMessage("Connection error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaProvider style={{ backgroundColor: "#EEEEEEff" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 40 }}>
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={styles.containerStyle}>
            <Text style={styles.titleText}>Colombinizer</Text>
            
            <TextInput
              style={styles.textInputStyle}
              onChangeText={setEmail}
              value={email}
              placeholder="Enter Your Email"
              placeholderTextColor="#999"
              autoCapitalize={'none'}
            />

            <View style={styles.passwordWrapper}>
              <TextInput
                style={[styles.textInputStyle, { flex: 1, marginBottom: 0 }]}
                onChangeText={setPassword}
                value={password}
                secureTextEntry={secureText}
                placeholder="Enter Your Password"
                placeholderTextColor="#999"
                autoCapitalize={'none'}
              />
              <TouchableOpacity 
                onPress={() => setSecureText(!secureText)}
                style={styles.eyeButton}
              >
                <Image 
                  source={
                    secureText 
                      ? require("../../assets/images/pw-view.png") 
                      : require("../../assets/images/pw-hide.png")
                  } 
                  style={styles.eyeIcon} 
                />
              </TouchableOpacity>
            </View>

            {errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}

            <TouchableOpacity 
              style={[styles.button, styles.loginButton]} 
              onPress={signInWithEmail}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? "Loading..." : "Login"}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.registerButton]} 
              onPress={signUpWithEmail}
              disabled={loading}
            >
              <Text style={[styles.buttonText, { color: '#002467ff' }]}>Register</Text>
            </TouchableOpacity>

            {/* Continue without login */}
            <TouchableOpacity 
              style={styles.guestButton} 
              onPress={() => router.replace('/home')}
              disabled={loading}
            >
              <Text style={styles.guestText}>Continue without login →</Text>
            </TouchableOpacity>

          </View>
        </SafeAreaView>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    margin: 16, padding: 24, borderRadius: 16, backgroundColor: "white",
    elevation: 5, width: '90%', maxWidth: 500,
  },
  titleText: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 30, color: "#002467" },
  textInputStyle: {
    height: 50, borderWidth: 1, borderColor: "#ccc", borderRadius: 8,
    paddingHorizontal: 12, backgroundColor: "#F9F9F9", marginBottom: 16, fontSize: 15,
  },

  passwordWrapper: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: "#ccc",
    borderRadius: 8, backgroundColor: "#F9F9F9", marginBottom: 16,
  },
  eyeButton: { padding: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  eyeIcon: {
    width: 24, 
    height: 24,
    resizeMode: 'contain'
  },

  errorText: { color: '#ff4444', fontSize: 14, marginBottom: 16, textAlign: 'center', fontWeight: '500' },
  button: { padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  loginButton: { backgroundColor: '#002467ff' },
  registerButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#002467ff' },
  guestButton: { marginTop: 24, alignItems: 'center' },
  guestText: { color: '#666', fontSize: 14, textDecorationLine: 'underline' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});