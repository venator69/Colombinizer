import {StyleSheet, View, Text, ScrollView, Pressable, Image as RNImage, Switch, TextInput, useWindowDimensions, TouchableOpacity} from "react-native";
import Svg, { Line as SvgLine, Rect as SvgRect, Image as SvgImage } from "react-native-svg";
import React, { useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Navbar from "../../components/navbar";
import CustomAlert from "../../components/alert";
import { supabase } from "../../lib/supabase";
import { useRouter } from "expo-router";

// charge object type
type Charge = {
  id: number;
  x: number;
  y: number;
  q: number;
  startX?: number;
  startY?: number;
};

function FieldPlot({
  title,
  render
}: {
  title: string;
  render: (w: number, h: number) => React.ReactNode;
}) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  return (
    <View style={styles.containerStyle}>
      <Text style={styles.fieldTitle}>
        {title}
      </Text>

      <View
        style={styles.mapStyle}
        onLayout={e => {
          setSize({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height
          });
        }}
      >
        {size.width > 0 && size.height > 0 && (
          <Svg width={size.width} height={size.height}>
            {render(size.width, size.height)}
          </Svg>
        )}
      </View>
    </View>
  );
}

export default function App() {
  const router = useRouter();

  // states
  const [cards, setCards] = useState<number[]>([]);
  const [charges, setCharges] = useState<Charge[]>([]);
  const [showEField, setShowEField] = useState(false);  
  const [showPField, setShowPField] = useState(false);
  const [dragging, setDragging] = useState(false);
  const { width } = useWindowDimensions();
  const [canvas, setCanvas] =
  useState<{x:number,y:number,width:number,height:number} | null>(null);
  
  // Notification states
  const [alertConfig, setAlertConfig] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    buttons?: Array<{
      text: string;
      onPress?: () => void;
      style?: 'default' | 'cancel' | 'destructive';
    }>;
  }>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  // constants
  const isLarge = width > 1000;
  const isMobile = width < 768;
  const k = 8.9875517923e9; 

  // save history function
  const saveExperiment = async () => {
    try {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (!session || !session.user) {
        setAlertConfig({
          visible: true,
          type: 'warning',
          title: 'Guest Mode',
          message: 'Please log in first to save your lab results to the database.',
          buttons: [
            { text: 'Not now', style: 'cancel' },
            { 
              text: 'Log in now',
              onPress: () => router.push("/(auth)/login")
            }
          ]
        });
        return;
      }

      if (charges.length === 0) {
        setAlertConfig({
          visible: true,
          type: 'info',
          title: 'No Data',
          message: 'Please add at least one charge before saving.',
        });
        return;
      }

      const { error } = await supabase
        .from('experiments')
        .insert(
          charges.map(c => {
            const force = forceData.find(f => f.id === c.id);
            return {
              user_id: session.user.id,
              q1: c.q,
              q2: 0, 
              distance: Math.sqrt(c.x * c.x + c.y * c.y),
              force: force?.magnitude || 0,
            };
          })
        );

      if (error) {
        setAlertConfig({
          visible: true,
          type: 'error',
          title: 'Unable to save',
          message: error.message,
        });
      } else {
        setAlertConfig({
          visible: true,
          type: 'success',
          title: 'Success!',
          message: 'Your experiment has been saved to your history.',
        });
      }

    } catch (error: any) {
      setAlertConfig({
        visible: true,
        type: 'error',
        title: 'Error',
        message: 'An unexpected error occurred. Please try again.',
      });
    }
  };

  // utility functions
  function computePotentialAt(x: number, y: number) {
    let V = 0;
    charges.forEach(c => {
      const dx = x - c.x;
      const dy = y - c.y;
      const r = Math.sqrt(dx * dx + dy * dy);
      if (r === 0) return;
      const q = c.q * 1e-9;
      V += (k * q) / r;
    });
    return V;
  }

  function computeElectricFieldAt(x: number, y: number) {
    let Ex = 0;
    let Ey = 0;
    charges.forEach(c => {
      const dx = x - c.x;
      const dy = y - c.y;
      const r = Math.sqrt(dx * dx + dy * dy);
      if (r === 0) return;
      const q = c.q * 1e-9;
      const E = (k * q) / (r * r);
      Ex += E * (dx / r);
      Ey += E * (dy / r);
    });
    return { Ex, Ey };
  }

  const renderElectric = (w:number, h:number) => {
    const nodes: any[] = [];
    const step = 30;
    for (let x = 0; x < w; x += step) {
      for (let y = 0; y < h; y += step) {
        const { Ex, Ey } = computeElectricFieldAt(x, y);
        const scale = 200;
        nodes.push(
          <SvgLine
            key={`${x}-${y}`}
            x1={x} y1={y}
            x2={x + Ex * scale}
            y2={y + Ey * scale}
            stroke="cyan"
            strokeWidth={5}
          />
        );
      }
    }
    return nodes;
  };

  const renderPotential = (w:number,h:number) => {
    const nodes: any[] = [];
    const step = 12;
    for (let x = 0; x < w; x += step) {
      for (let y = 0; y < h; y += step) {
        const V = computePotentialAt(x, y);
        const intensity = Math.min(1, Math.abs(V) / 10);
        nodes.push(
          <SvgRect
            key={`${x}-${y}`}
            x={x} y={y}
            width={step} height={step}
            fill="yellow" // DIKEMBALIKAN KE YELLOW
            fillOpacity={intensity}
          />
        );
      }
    }
    return nodes;
  };
  
  const addCard = () => {
    if (cards.length >= 5) return;
    setCards(prev => [...prev, prev.length + 1]);
    setCharges(prev => [...prev, { id: prev.length + 1, x: 50, y: 50, q: 10 }]);
  };

  const removeCard = (index: number) => {
    setCards(prev => prev.filter((_, i) => i !== index));
    setCharges(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setCards([]);
    setCharges([]);
  };

  const changePolarity = (index: number) => {
    setCharges(prev => {
      const copy = [...prev];
      copy[index].q = -copy[index].q;
      return copy;
    });
  };

  const addCharge = (index: number, value: number) => {
    setCharges(prev => {
      const copy = [...prev];
      copy[index].q = value;
      return copy;
    });
  };

  function computeForces() {
    return charges.map(c1 => {
      let Fx = 0; let Fy = 0;
      charges.forEach(c2 => {
        if (c1.id === c2.id) return;
        const dx = c2.x - c1.x;
        const dy = c2.y - c1.y;
        const r = Math.sqrt(dx*dx + dy*dy);
        if (r === 0) return;
        const q1 = c1.q * 1e-9;
        const q2 = c2.q * 1e-9;
        const F = (k * q1 * q2) / (r * r);
        Fx += F * (dx / r);
        Fy += F * (dy / r);
      });
      return {
        id: c1.id,
        x: c1.x, y: c1.y,
        Fx, Fy,
        magnitude: Math.sqrt(Fx*Fx + Fy*Fy)
      };
    });
  }
  
  const forceData = computeForces();

  return (
    <SafeAreaProvider style={{ backgroundColor: "#EEEEEEff" }}>
        <CustomAlert
          visible={alertConfig.visible}
          type={alertConfig.type}
          title={alertConfig.title}
          message={alertConfig.message}
          buttons={alertConfig.buttons}
          onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
        />

        <Navbar />

        <ScrollView
          scrollEnabled={!dragging}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <SafeAreaView
            style={{
              flex: 1,
              flexDirection: isLarge ? "row" : "column",
            }}
          >
            {/* left side */}
            <View style={{ width: isLarge ? "38%" : "100%" }}>
              <View style={styles.containerStyle}>
                <Text style={styles.titleText}>Coulomb's Law Simulator</Text>
              </View>

              <View style={styles.containerStyle}>
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>Force Display</Text>
                <Text style={{ fontSize: 15 }}>Move the charges around to see the forces.</Text>
                
                <View 
                  style={[styles.canvasStyle, isMobile && { height: 260 }]} 
                  onLayout={(e) => setCanvas(e.nativeEvent.layout)}
                >
                  {canvas && (
                    <>
                      <Svg width={canvas.width} height={canvas.height} pointerEvents="none">
                        {(() => {
                          const spacing = 20;
                          const lines = [];
                          for (let x = 0; x < canvas.width; x += spacing) {
                            lines.push(<SvgLine key={`v-${x}`} x1={x} y1={0} x2={x} y2={canvas.height} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />);
                          }
                          for (let y = 0; y < canvas.height; y += spacing) {
                            lines.push(<SvgLine key={`h-${y}`} x1={0} y1={y} x2={canvas.width} y2={y} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />);
                          }
                          return lines;
                        })()}
                        {charges.map(c => (
                          <SvgImage
                            key={c.id}
                            x={c.x} y={c.y}
                            width={20} height={20}
                            href={c.q > 0 ? require("../../assets/images/positive.png") : require("../../assets/images/negative.png")}
                          />
                        ))}
                      </Svg>
                      {charges.map(c => {
                        const pan = Gesture.Pan()
                          .onBegin(() => {
                            setDragging(true);
                            setCharges(prev => prev.map(ch => ch.id === c.id ? { ...ch, startX: ch.x, startY: ch.y } : ch));
                          })
                          .onUpdate(e => {
                            if (!canvas) return;
                            setCharges(prev => prev.map(ch => ch.id === c.id ? {
                              ...ch,
                              x: Math.max(0, Math.min(canvas.width - 20, (ch.startX ?? ch.x) + e.translationX)),
                              y: Math.max(0, Math.min(canvas.height - 20, (ch.startY ?? ch.y) + e.translationY)),
                            } : ch));
                          })
                          .onEnd(() => {
                            setDragging(false);
                            setCharges(prev => prev.map(ch => ch.id === c.id ? { ...ch, startX: undefined, startY: undefined } : ch));
                          })
                          .runOnJS(true);
                        return (
                          <GestureDetector key={c.id} gesture={pan}>
                            <View style={{ position: "absolute", width: 30, height: 30, left: c.x - 5, top: c.y - 5 }} />
                          </GestureDetector>
                        );
                      })}
                    </>
                  )}
                </View>

                <View style={styles.measurementContainer}>
                  <Text style={styles.measurementTitle}>Object Measurements</Text>
                  
                  <View style={{ maxHeight: isMobile ? 180 : 400 }}>
                    <ScrollView nestedScrollEnabled={true}>
                      {forceData.map(f => (
                        <View key={f.id} style={styles.objectMeasurement}>
                          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Object {f.id}</Text>
                          <Text style={{ fontSize: 12 }}>Position : ({Math.round(f.x)} , {canvas ? Math.round(canvas.height - f.y - 20) : 0})</Text>
                          <Text style={{ fontSize: 12 }}>Fx : {f.Fx.toExponential(2)} N , Fy : {f.Fy.toExponential(2)} N</Text>
                          <Text style={{ fontSize: 12, fontWeight: 'bold' }}>|F| : {f.magnitude.toExponential(2)} N</Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                  
                  <Pressable 
                    onPress={saveExperiment}
                    style={({ pressed }) => [styles.saveButton, pressed && { opacity: 0.7 }]}
                  >
                    <Text style={styles.saveButtonText}>Save this experiment</Text>
                  </Pressable>
                </View>
              </View>

              {showEField && <FieldPlot title="Electric Field" render={(w,h)=>renderElectric(w,h)} />}
              {showPField && <FieldPlot title="Potential Field" render={(w,h)=>renderPotential(w,h)} />}
            </View>

            {/* right side */}
            <View style={{ width: isLarge ? "56%" : "100%", paddingHorizontal: isMobile ? 0 : 8 }}>
              <View style={styles.containerStyle}>
                <View style={styles.headerRow}>
                  <Text style={[styles.titleText, isMobile && { fontSize: 18 }]}>Add up to 5 objects</Text>
                  <View style={styles.headerButtons}>
                    <TouchableOpacity onPress={clearAll}>
                      <Text style={styles.clearButtonText}>Clear All</Text>
                    </TouchableOpacity>
                    <Pressable onPress={addCard}>
                      <RNImage source={require("../../assets/images/plus-butt.png")} style={styles.plusIcon} />
                    </Pressable>
                  </View>
                </View>
              </View>

              {cards.map((c, index) => (
                <View key={index} style={styles.containerStyle}>
                  <View style={styles.headerRow}>
                    <Text style={styles.subtitleText}>Object {index + 1}</Text>
                    <Pressable onPress={() => removeCard(index)}>
                      <RNImage source={require("../../assets/images/x.png")} style={styles.xicon} />
                    </Pressable>
                  </View>
                  <Text style={styles.chargeText}>
                    Charge : <TextInput
                      style={styles.textInputStyle}
                      keyboardType="numeric"
                      value={String(charges[index]?.q || '')}
                      onChangeText={(text) => {
                        if (text === '' || text === '-') {
                          setCharges(prev => {
                            const copy = [...prev];
                            copy[index].q = text as any; 
                            return copy;
                          });
                          return;
                        }
                        const num = parseFloat(text);
                        if (!isNaN(num)) addCharge(index, num);
                      }}
                    /> nC
                  </Text>
                  <View style={styles.polarButtonSeparator}>
                    <Text style={{ fontSize: 15 }}>Polarity :</Text>
                    <Pressable onPress={() => changePolarity(index)}>
                      <RNImage source={charges[index]?.q > 0 ? require("../../assets/images/positive.png") : require("../../assets/images/negative.png")} style={styles.polarButton} />
                    </Pressable>
                  </View>
                </View>
              ))}

              <View style={styles.containerStyle}>
                <View style={styles.toggleRow}>
                  <Text style={styles.subtitleText}>Show Electric Fields :</Text>
                  <Switch trackColor={{ false: "#c1c1c1", true: "#00ff0d" }} thumbColor={showEField ? "#009b08" : "#f4f3f4"} value={showEField} onValueChange={setShowEField} />
                </View>
                <View style={styles.toggleRow}>
                  <Text style={styles.subtitleText}>Show Potential Fields :</Text>
                  <Switch trackColor={{ false: "#c1c1c1", true: "#00ff0d" }} thumbColor={showPField ? "#009b08" : "#f4f3f4"} value={showPField} onValueChange={setShowPField} />
                </View>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  mapStyle: { height: 320, borderRadius: 12, overflow: "hidden", backgroundColor: "#ee00ffff" },
  containerStyle: { marginHorizontal: 16, marginVertical: 8, padding: 16, borderRadius: 16, backgroundColor: "white", elevation: 5 },
  titleText: { fontSize: 24, fontWeight: "bold" },
  subtitleText: { fontSize: 18, fontWeight: "bold" },
  chargeText: { fontSize: 15, paddingTop: 16, paddingBottom: 8 },
  canvasStyle: { marginTop: 10, height: 320, borderRadius: 12, overflow: "hidden", backgroundColor: "#111", position: "relative" },
  measurementContainer: { marginTop: 12, padding: 12, borderRadius: 10, backgroundColor: "#002467ff" },
  measurementTitle: { color: "white", fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  objectMeasurement: { backgroundColor: "#ffffff", marginBottom: 8, padding: 10, borderRadius: 8 },
  saveButton: { backgroundColor: "#4CAF50", marginTop: 10, padding: 12, borderRadius: 8, alignItems: "center" },
  saveButtonText: { color: "white", fontWeight: "bold", fontSize: 14 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerButtons: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  clearButtonText: { color: '#ff4444', fontWeight: 'bold', fontSize: 14 },
  toggleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
  plusIcon: { width: 30, height: 30 },
  xicon:{ width: 20, height: 20 },
  textInputStyle:{ marginLeft: 10, width: 70, height: 36, borderWidth: 1, borderColor: "#555", borderRadius: 6, paddingHorizontal: 8, backgroundColor: "white" },
  polarButtonSeparator:{ flexDirection: "row", alignItems: "center" },
  polarButton:{ width: 20, height: 20, marginLeft: 24 },
  fieldTitle:{ fontSize: 24, fontWeight: "bold", marginBottom: 10 },
});