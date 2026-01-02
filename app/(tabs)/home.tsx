import {Image as RNImage, StyleSheet, View, Text, ScrollView, useWindowDimensions} from "react-native";
import Navbar from "../../components/navbar";
import { useState } from "react";
import { SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";

export default function Home() {
  const [dragging, setDragging] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (    
  <SafeAreaProvider
    style={{ backgroundColor: "#EEEEEEff" }}>
    
      <SafeAreaView style={{ flex: 0, backgroundColor: "transparent" }} />

      <Navbar />

      <ScrollView
        scrollEnabled={!dragging}
        contentContainerStyle={{ 
          paddingBottom: 40,
          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            maxWidth: 900,
            alignItems: "center",
            paddingHorizontal: isMobile ? 16 : 24,
          }}
        >
          
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>
              Colombinizer
            </Text>
          </View>
          
          <View style={styles.containerStyle}>
            <Text style={styles.description}>
              Welcome to the Colombinizer! 
              This app allows you to simulate and visualize 
              electric forces between charged particles using 
              Coulomb's law. You can add, move, and modify 
              particles to see how they interact with each 
              other based on their charges and distances.
            </Text>
          </View>
          
          <View style={styles.containerStyle}>
            <Text style={styles.subtitleText}>
              What is Coulomb's Law?
            </Text>
            <Text style={styles.description}>
              Coulomb's law describes the electrostatic 
              interaction between electrically charged particles. 
              The Coulomb's law is a vector quantity
              meaning it has both magnitude and direction.  
              When charges are of the same sign, 
              they repel each other, and when they 
              are of opposite signs, they attract each other. 
              The law states that the force between two point 
              charges is directly proportional to the product 
              of the magnitudes of the charges and inversely 
              proportional to the square of the distance 
              between them. The formula is given by:
            </Text>
            <View style={styles.imageContainer}>
              <RNImage
                source={require("../../assets/images/coulombs.png")}
                style={[styles.imageStyle, isMobile && { width: 200, height: 200 }]}
              />
            </View>
          </View>
          
          <View style={styles.containerStyle}>
            <Text style={styles.subtitleText}>
              What is Electric Field? and Electric Potential?
            </Text>
            <Text style={styles.description}>
              An electric field is a region around a charged 
              particle where it exerts a force on other charged 
              particles. Similarly to Coulomb's law, the electric field
              is a vector quantity that points away from positive charges 
              and toward negative charges. When the test charge is 
              positive, the force experienced is in the direction 
              of the electric field, and when the test charge is 
              negative, the force is in the opposite direction. When two charges 
              are present, the net electric field at any point 
              in space is the vector sum of the electric fields 
              due to each charge. 
              . The electric field (E) at a point in 
              space is defined as the force (F) experienced by 
              a positive test charge (q) placed at that point, 
              divided by the magnitude of the test charge:
            </Text>
            <View style={styles.imageContainer}>
              <RNImage
                source={require("../../assets/images/EFformula.png")}
                style={[
                  styles.imageStyle,
                  { width: 250, height: 250 },
                  isMobile && { width: 200, height: 200 }
                ]}
              />
            </View>
            <Text style={styles.description}>
              Electric potential (V) at a point in space is 
              defined as the work done (W) in bringing a unit 
              positive test charge from infinity to that point.
              Unlike electric field, which is a vector quantity,
              electric potential is a scalar quantity. On a point
              charge, the electric potential due to a point charge 
              (Q) at a distance (r) is given by:
            </Text>
            <View style={styles.imageContainer}>
              <RNImage
                source={require("../../assets/images/electricpotential.png")}
                style={[styles.imageStyle, isMobile && { width: 200, height: 200 }]}
              />
            </View>
          </View>
          
          <View style={styles.containerStyle}>
            <Text style={styles.titleText}>
              How to Use the Virtual Lab
            </Text>
            <Text style={styles.subtitleText}>
              1. Adding and Manipulating Charges
            </Text>
            <Text style={styles.description}>
              To get started, navigate to the Dashboard tab. 
              Here, you can add charged particles by tapping 
              the "+" icon. You can drag particles 
              to reposition them, and use the input fields 
              to modify their charge values and polarities
            </Text>
            <View style={styles.imageContainer}>
              <RNImage
                source={require("../../assets/images/addingcharges.png")}
                style={[
                  styles.tutorialImage,
                  isMobile && { width: 220, height: 280 }
                ]}
              />
            </View>
            <Text style={styles.subtitleText}>
              2. Forces Measurement
            </Text>
            <Text style={styles.description}>
              As you add and manipulate particles, the app will
              automatically calculate and display the resulting 
              electrostatic forces based on Coulomb's law. It display 
              both the magnitude and direction of the forces acting 
              on each particle.
            </Text>
            <View style={styles.imageContainer}>
              <RNImage
                source={require("../../assets/images/forceMeasurements.png")}
                style={[
                  styles.tutorialImage,
                  { height: 400 },
                  isMobile && { width: 220, height: 320 }
                ]}
              />
            </View>
            <Text style={styles.subtitleText}>
              3. Visualizing Electric Fields and Potentials
            </Text>
            <Text style={styles.description}>
              The app provides visual representations of the 
              electric fields and potentials generated by the 
              charged particles. You can toggle these visualizations 
              on and off to better understand how charges interact 
              in space. The electric field lines indicate the direction
              of the force that a positive test charge would experience 
              at various points in space, while the potential contours 
              represent regions of equal electric potential.
            </Text>
            <View style={styles.imageContainer}>
              <RNImage
                source={require("../../assets/images/EFPF.png")}
                style={[
                  styles.tutorialImage,
                  { height: 400 },
                  isMobile && { width: 200, height: 320 }
                ]}
              />
            </View>
          </View>
        </View>
      </ScrollView>
  </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    marginVertical: 12,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 16,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    alignSelf: "center",
  },
  containerStyle: {
    width: "100%",
    marginVertical: 12,
    padding: 20,
    borderRadius: 16,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "justify",
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  imageStyle: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  tutorialImage: {
    width: 280,
    height: 350,
    resizeMode: "contain",
  },
});