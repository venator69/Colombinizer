import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { supabase } from "../lib/supabase";

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Untuk Hamburger Mobile
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
          /* Mobile */
          <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)} style={styles.hamburger}>
            <View style={styles.line} />
            <View style={styles.line} />
            <View style={styles.line} />
          </TouchableOpacity>
        ) : (
          /* Desktop */
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

                {/* Dropdown Desktop */}
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

      {/* Overlay Mobile */}
      {isMobile && isMenuOpen && (
        <View style={styles.mobileMenu}>
          <TouchableOpacity style={styles.mobileItem} onPress={() => navigateTo("/(tabs)/home")}><Text style={styles.mobileText}>Home</Text></TouchableOpacity>
          <TouchableOpacity style={styles.mobileItem} onPress={() => navigateTo("/(tabs)/learn")}><Text style={styles.mobileText}>Learn</Text></TouchableOpacity>
          <TouchableOpacity style={styles.mobileItem} onPress={() => navigateTo("/(tabs)/lab")}><Text style={styles.mobileText}>Virtual Lab</Text></TouchableOpacity>
          {email && <TouchableOpacity style={styles.mobileItem} onPress={() => navigateTo("/(tabs)/history")}><Text style={styles.mobileText}>History</Text></TouchableOpacity>}
          <View style={styles.separator} />
          {email ? (
            <View>
              <Text style={styles.userEmail}>{email}</Text>
              <TouchableOpacity style={styles.mobileItem} onPress={handleLogout}>
                <Text style={[styles.mobileText, {color: '#ff4444'}]}>Logout</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.mobileItem} onPress={() => navigateTo("/(auth)/login")}>
              <Text style={[styles.mobileText, {color: '#4CAF50'}]}>Login</Text>
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

  // Mobile Styles
  hamburger: { gap: 5 },
  line: { width: 25, height: 3, backgroundColor: "white", borderRadius: 2 },
  mobileMenu: { backgroundColor: "#001a4d", padding: 20, position: 'absolute', top: 70, left: 0, right: 0, elevation: 5 },
  mobileItem: { paddingVertical: 15, borderBottomWidth: 0.5, borderBottomColor: "rgba(255,255,255,0.1)" },
  mobileText: { color: "white", fontSize: 18, textAlign: 'center' },
  userEmail: { color: "#aaa", fontSize: 14, textAlign: 'center', marginTop: 10 },
  separator: { height: 1, backgroundColor: "rgba(255,255,255,0.2)", marginVertical: 10 },
  
  // Login Button
  loginBtn: { paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, marginLeft: 10 }
});