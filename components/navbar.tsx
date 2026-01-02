import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { supabase } from "../lib/supabase";
import { Ionicons } from '@expo/vector-icons'; // Import ikon

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Untuk Dropdown Mobile (Ikon Akun)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Untuk Dropdown Desktop
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setEmail(user ? user.email ?? "User" : null);
  };

  useEffect(() => {
    checkUser();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    router.replace("/(auth)/login");
  };

  const navigateTo = (path: any) => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    router.push(path);
  };

  return (
    <View style={styles.navContainer}>
      <View style={styles.nav}>
        <Text style={styles.logo}>Colombinizer</Text>

        {isMobile ? (
          /* Mobile - Diganti dari Hamburger ke Ikon Profil */
          <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)} style={styles.accountIcon}>
            <Ionicons 
              name={email ? "person-circle" : "person-circle-outline"} 
              size={32} 
              color="white" 
            />
          </TouchableOpacity>
        ) : (
          /* Desktop - Tetap Sama */
          <View style={styles.menu}>
            <TouchableOpacity onPress={() => navigateTo("/(tabs)/home")}><Text style={styles.menuText}>Home</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigateTo("/(tabs)/learn")}><Text style={styles.menuText}>Learn</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigateTo("/(tabs)/lab")}><Text style={styles.menuText}>Virtual Lab</Text></TouchableOpacity>
            {email && <TouchableOpacity onPress={() => navigateTo("/(tabs)/history")}><Text style={styles.menuText}>History</Text></TouchableOpacity>}
            
            {email ? (
              <View>
                <TouchableOpacity 
                  onPress={() => setIsDropdownOpen(!isDropdownOpen)} 
                  style={styles.userButton}
                >
                  <Text style={styles.menuText}>{email} ▾</Text>
                </TouchableOpacity>

                {isDropdownOpen && (
                  <View style={styles.dropdown}>
                    <TouchableOpacity onPress={handleLogout} style={styles.dropdownItem}>
                      <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ) : (
              <TouchableOpacity 
                onPress={() => navigateTo("/(auth)/login")} 
                style={[styles.loginBtn, { backgroundColor: '#4CAF50' }]}
              >
                <Text style={[styles.menuText, { fontWeight: 'bold' }]}>Login</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Dropdown Mobile - Diposisikan melayang di kanan atas tepat di bawah ikon */}
      {isMobile && isMenuOpen && (
        <View style={styles.mobileDropdown}>
          {email ? (
            <View>
              <Text style={styles.userEmailText}>Logged in as:</Text>
              <Text style={styles.userEmail}>{email}</Text>
              <View style={styles.separator} />
              <TouchableOpacity style={styles.dropdownItemRow} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color="#ff4444" />
                <Text style={[styles.dropdownItemText, {color: '#ff4444'}]}>Logout</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.dropdownItemRow} onPress={() => navigateTo("/(auth)/login")}>
              <Ionicons name="log-in-outline" size={20} color="#4CAF50" />
              <Text style={[styles.dropdownItemText, {color: '#4CAF50'}]}>Login</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: { width: "100%", zIndex: 100 },
  nav: { height: 70, backgroundColor: "#002467", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20 },
  logo: { color: "white", fontSize: 20, fontWeight: "bold" },
  menu: { flexDirection: "row", gap: 20, alignItems: "center" },
  menuText: { color: "white", fontSize: 16 },
  
  // User Button & Dropdown Desktop
  userButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 10,
  },
  dropdown: {
    position: "absolute",
    top: 45,
    right: 0,
    backgroundColor: "white",
    borderRadius: 8,
    width: 150,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dropdownItem: { padding: 12, alignItems: "center" },
  logoutText: { color: "#ff4444", fontWeight: "bold" },

  // Mobile Account Icon
  accountIcon: { padding: 5 },

  // Perbaikan Dropdown Mobile agar melayang di pojok kanan bawah ikon
  mobileDropdown: { 
    position: 'absolute', 
    top: 65, 
    right: 15, 
    backgroundColor: "white", 
    padding: 15, 
    borderRadius: 12,
    width: 220,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  userEmailText: { color: "#888", fontSize: 11, textTransform: 'uppercase' },
  userEmail: { color: "#002467", fontSize: 13, fontWeight: 'bold', marginBottom: 5 },
  separator: { height: 1, backgroundColor: "#eee", marginVertical: 8 },
  dropdownItemRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  dropdownItemText: { fontSize: 16, fontWeight: '500' },
  
  // Login Button Desktop
  loginBtn: { paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, marginLeft: 10 }
});