import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Platform } from "react-native";
import { router } from "expo-router";
import { supabase } from "../lib/supabase";
import { Ionicons } from '@expo/vector-icons';

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const [isBurgerOpen, setIsBurgerOpen] = useState(false); 
  const [isAccountOpen, setIsAccountOpen] = useState(false); 
  const { width } = useWindowDimensions();
  
  const isWeb = Platform.OS === 'web';
  const isLargeWeb = isWeb && width >= 768;
  const isSmallWeb = isWeb && width < 768;

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
    setIsBurgerOpen(false);
    setIsAccountOpen(false);
    router.replace("/(auth)/login");
  };

  const navigateTo = (path: any) => {
    setIsBurgerOpen(false);
    setIsAccountOpen(false);
    router.push(path);
  };

  return (
    <View style={styles.navContainer}>
      <View style={styles.nav}>
        <Text style={styles.logo}>Colombinizer</Text>
        
        {/* WEB DESKTOP (Menu Memanjang) */}
        {isLargeWeb && (
          <View style={styles.menu}>
            <TouchableOpacity onPress={() => navigateTo("/(tabs)/home")}><Text style={styles.menuText}>Home</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigateTo("/(tabs)/learn")}><Text style={styles.menuText}>Learn</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigateTo("/(tabs)/lab")}><Text style={styles.menuText}>Virtual Lab</Text></TouchableOpacity>
            {email && <TouchableOpacity onPress={() => navigateTo("/(tabs)/history")}><Text style={styles.menuText}>History</Text></TouchableOpacity>}
            
            <TouchableOpacity 
              onPress={() => setIsAccountOpen(!isAccountOpen)} 
              style={styles.userButton}
            >
              <Text style={styles.menuText}>{email || "Guest"} ▾</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* WEB MOBILE / SMALL SCREEN (Burger Menu) */}
        {isSmallWeb && (
          <TouchableOpacity onPress={() => setIsBurgerOpen(!isBurgerOpen)} style={styles.iconButton}>
            <Ionicons name={isBurgerOpen ? "close" : "menu"} size={32} color="white" />
          </TouchableOpacity>
        )}

        {/* MOBILE APP APK (Hanya Ikon Profil) */}
        {!isWeb && (
          <TouchableOpacity onPress={() => setIsAccountOpen(!isAccountOpen)} style={styles.iconButton}>
            <Ionicons 
              name={email ? "person-circle" : "person-circle-outline"} 
              size={32} 
              color="white" 
            />
          </TouchableOpacity>
        )}
      </View>

      {/* DROPDOWN BURGER (Hanya tampil di Web Kecil) */}
      {isSmallWeb && isBurgerOpen && (
        <View style={styles.burgerDropdown}>
          <TouchableOpacity style={styles.burgerItem} onPress={() => navigateTo("/(tabs)/home")}>
            <Ionicons name="home-outline" size={20} color="#002467" />
            <Text style={styles.burgerText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.burgerItem} onPress={() => navigateTo("/(tabs)/learn")}>
            <Ionicons name="book-outline" size={20} color="#002467" />
            <Text style={styles.burgerText}>Learn</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.burgerItem} onPress={() => navigateTo("/(tabs)/lab")}>
            <Ionicons name="flask-outline" size={20} color="#002467" />
            <Text style={styles.burgerText}>Virtual Lab</Text>
          </TouchableOpacity>
          {email && (
            <TouchableOpacity style={styles.burgerItem} onPress={() => navigateTo("/(tabs)/history")}>
              <Ionicons name="time-outline" size={20} color="#002467" />
              <Text style={styles.burgerText}>History</Text>
            </TouchableOpacity>
          )}
          <View style={styles.separator} />
          {email ? (
            <TouchableOpacity style={styles.burgerItem} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#ff4444" />
              <Text style={[styles.burgerText, {color: '#ff4444'}]}>Logout ({email})</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.burgerItem} onPress={() => navigateTo("/(auth)/login")}>
              <Ionicons name="log-in-outline" size={20} color="#4CAF50" />
              <Text style={[styles.burgerText, {color: '#4CAF50'}]}>Login</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* DROPDOWN AKUN (Untuk Web Desktop & Mobile App) */}
      {isAccountOpen && (isLargeWeb || !isWeb) && (
        <View style={isWeb ? styles.desktopDropdown : styles.mobileAppDropdown}>
          {email ? (
            <>
              <Text style={styles.userEmailText}>{email}</Text>
              <View style={styles.separator} />
              <TouchableOpacity style={styles.dropdownItemRow} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color="#ff4444" />
                <Text style={[styles.dropdownItemText, {color: '#ff4444'}]}>Logout</Text>
              </TouchableOpacity>
            </>
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
  navContainer: { width: "100%", zIndex: 1000 },
  nav: { height: 70, backgroundColor: "#002467", flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20 },
  logo: { color: "white", fontSize: 20, fontWeight: "bold" },
  menu: { flexDirection: "row", gap: 15, alignItems: "center" },
  menuText: { color: "white", fontSize: 14 },
  iconButton: { padding: 5 },
  
  userButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 5,
  },

  // Dropdown untuk Web Desktop
  desktopDropdown: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "white",
    borderRadius: 8,
    width: 200,
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  // Dropdown untuk Mobile APK
  mobileAppDropdown: { 
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

  // Dropdown Burger untuk Web Mobile
  burgerDropdown: {
    backgroundColor: "white",
    width: "100%",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
    elevation: 5,
  },
  burgerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 12,
  },
  burgerText: {
    fontSize: 16,
    color: "#002467",
    fontWeight: "500",
  },

  userEmailText: { color: "#002467", fontSize: 13, fontWeight: 'bold', marginBottom: 5 },
  separator: { height: 1, backgroundColor: "#eee", marginVertical: 8 },
  dropdownItemRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 5 },
  dropdownItemText: { fontSize: 15, fontWeight: '500' },
});