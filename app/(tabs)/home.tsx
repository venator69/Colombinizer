import {Image as RNImage, StyleSheet, View, Text, ScrollView, useWindowDimensions} from "react-native";
import Navbar from "../../components/navbar";
import { useState } from "react";
import { SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";

export default function Home() {
  const [dragging, setDragging] = useState(false);
  const { width } = useWindowDimensions();

  return (    
  <SafeAreaProvider
    style={{ backgroundColor: "#EEEEEEff" }}>
    <ScrollView
      scrollEnabled={!dragging}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Navbar />

        <View style={styles.containerStyle}>
          <Text style={styles.titleText}>
            Columbinizer
          </Text>
        </View>
        <View style={styles.containerStyle}>
          <Text style={styles.description}>
            Welcome to the Columbinizer! 
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
            <View style={{alignItems: "center"}}>
              <RNImage
                source={
                  require("../../assets/images/coulombs.png")
                }
                style={styles.imageStyle}
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
            <View style={{alignItems: "center"}}>
              <RNImage
                source={
                  require("../../assets/images/EFformula.png")
                }
                style={{
                  width: 250,
                  height: 250,
                }}
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
          <View style={{alignItems: "center"}}>
            <RNImage
              source={
                require("../../assets/images/electricpotential.png")
              }
              style={styles.imageStyle}
              />
          </View>
        </View>
        <View style={styles.containerStyle}>
          <Text style={styles.titleText}>
            How to Use the App
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
            <View style={{alignItems: "center"}}>
              <RNImage
                source={
                  require("../../assets/images/addingcharges.png")
                }
                style={{
                  width : 280,
                  height : 350,
                  resizeMode: "contain",
                }}
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
            <View style={{alignItems: "center"}}>
              <RNImage
                source={
                  require("../../assets/images/forceMeasurements.png")
                }
                style={{
                  width : 280,
                  height : 400,
                  resizeMode: "contain",
                }}
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
          <View style={{alignItems: "center"}}>
            <RNImage
              source={
                require("../../assets/images/EFPF.png")
              }
              style={{
                width : 250,
                height : 400,
                resizeMode: "contain",
              }}
              />
          </View>


        </View>
      </SafeAreaView>
    </ScrollView>
  </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    margin: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    maxWidth: 800,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 15,
  },
  plusIconSeperator: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  plusIcon: {
    width: 30,
    height: 30,
  },
  textInputStyle:{
    marginLeft: 24,
    width: 70,
    height: 36,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 6,
    paddingHorizontal: 8,
    backgroundColor: "white",
  },
  imageStyle:{
    maxWidth: 250,
    resizeMode: "contain",
  }
});