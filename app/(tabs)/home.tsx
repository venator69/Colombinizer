import {Image as RNImage, StyleSheet, View, Text, ScrollView, useWindowDimensions, Platform} from "react-native";
import Navbar from "../../components/navbar";
import { useState } from "react";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";

export default function Home() {
  const [dragging, setDragging] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const insets = useSafeAreaInsets(); //

  return (    
  <SafeAreaProvider style={{ backgroundColor: "#EEEEEEff" }}>
    <View style={{ 
      flex: 1, 
      backgroundColor: "#EEEEEEff",
      paddingBottom: Platform.OS === 'web' ? 0 : insets.bottom
    }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#EEEEEEff" }} edges={['top']}>
        <Navbar />

        <ScrollView
          scrollEnabled={!dragging}
          contentContainerStyle={{ paddingBottom: 120, alignItems: "center" }}
        >
          <View style={{ flex: 1, width: "100%", maxWidth: 900, alignItems: "center", paddingHorizontal: isMobile ? 16 : 24 }}>
            
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>Colombinizer</Text>
            </View>
            
            <View style={styles.containerStyle}>
              <Text style={styles.description}>
                Welcome to the Colombinizer! This app allows you to simulate and visualize 
                electric forces between charged particles using Coulomb's law.
              </Text>
            </View>
            
            <View style={styles.containerStyle}>
              <Text style={styles.subtitleText}>What is Coulomb's Law?</Text>
              <Text style={styles.description}>
                Coulomb's law states that the force between two point charges is directly 
                proportional to the product of the magnitudes of the charges and inversely 
                proportional to the square of the distance between them.
              </Text>
              <View style={styles.imageContainer}>
                <RNImage
                  source={require("../../assets/images/coulombs.png")}
                  style={[styles.imageStyle, isMobile && { width: 200, height: 200 }]}
                />
              </View>
            </View>

            <View style={styles.containerStyle}>
              <Text style={styles.subtitleText}>How to Use the Virtual Lab</Text>
              <Text style={styles.description}>
                Navigate to the Lab tab. Tap the "+" icon to add particles. You can drag 
                particles to reposition them and see real-time force calculations.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  titleContainer: { marginVertical: 12, paddingVertical: 20, paddingHorizontal: 40, borderRadius: 16, backgroundColor: "white", elevation: 5, alignSelf: "center" },
  containerStyle: { width: "100%", marginVertical: 12, padding: 20, borderRadius: 16, backgroundColor: "white", elevation: 5 },
  titleText: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 8 },
  subtitleText: { fontSize: 18, fontWeight: "bold", marginTop: 16, marginBottom: 8 },
  description: { fontSize: 15, lineHeight: 22, textAlign: "justify" },
  imageContainer: { alignItems: "center", marginVertical: 16 },
  imageStyle: { width: 250, height: 250, resizeMode: "contain" },
});