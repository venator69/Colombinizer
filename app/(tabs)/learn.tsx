import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, useWindowDimensions, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import Navbar from '../../components/navbar';

const quizData = [
  {
    id: 1,
    question: "Two electric charges are placed close to each other. If the distance between the charges is doubled, how does the Coulomb force change?",
    options: ["Remains the same", "Becomes twice as large", "Becomes four times larger", "Becomes half as large", "Becomes one–fourth of the original"],
    correctIndex: 4,
    explanation: "According to Coulomb’s Law: F = k (q1.q2 / r²). The force is inversely proportional to the square of the distance. If distance is doubled (2r), the force becomes 1/(2)² = 1/4 of original."
  },
  {
    id: 2,
    question: "Which statement best describes Coulomb’s Law?",
    options: [
      "The force depends only on the magnitude of the charges",
      "The force is always attractive",
      "The force is inversely proportional to the square of the distance between charges",
      "The force is not affected by the medium between charges",
      "The force occurs only between like charges"
    ],
    correctIndex: 2,
    explanation: "Coulomb's Law states that the electric force is inversely proportional to the square of the distance (1/r²) between the charges."
  },
  {
    id: 3,
    question: "Two point charges (q1 = 4μC, q2 = 2μC) are separated by 0.3 m. Given k = 9x10⁹, calculate the electric force.",
    options: ["0.4 N", "0.8 N", "1.2 N", "2.4 N", "4.8 N"],
    correctIndex: 1,
    explanation: "F = (9x10⁹ * 4x10⁻⁶ * 2x10⁻⁶) / (0.3)² = 0.072 / 0.09 = 0.8 N."
  },
  {
    id: 4,
    question: "Two charges of 3μC and 6μC are separated by 0.6 m. If the distance is reduced to 0.3 m, how does the electric force change?",
    options: ["Becomes twice as large", "Becomes four times larger", "Becomes half as large", "Becomes one-fourth as large", "Remains the same"],
    correctIndex: 1,
    explanation: "Reducing distance to half (0.6 to 0.3) makes the force 4 times larger because F ∝ 1/r²."
  }
];

export default function Learn() {
  const { width } = useWindowDimensions();
  const isLarge = width > 1000;
  const videoId = "kCp5yYjo9zE";

  const [userAnswers, setUserAnswers] = useState<{[key: number]: number}>({});
  const [score, setScore] = useState(0);

  const handleAnswer = (questionId: number, index: number, correctIndex: number) => {
    if (userAnswers[questionId] !== undefined) return;
    
    setUserAnswers(prev => ({ ...prev, [questionId]: index }));
    
    if (index === correctIndex) {
      setScore(prevScore => prevScore + 1);
    }
  };

  const retakeQuiz = () => {
    setUserAnswers({}); 
    setScore(0);       
  };

  const renderVideo = () => {
    const videoUrl = `https://www.youtube.com/embed/${videoId}`;
    if (Platform.OS === 'web') {
      return <iframe src={videoUrl} frameBorder="0" allowFullScreen style={{ width: '100%', height: '100%', borderRadius: 12 }} />;
    } else {
      return <WebView style={styles.video} javaScriptEnabled domStorageEnabled source={{ uri: videoUrl }} />;
    }
  };

  return (
    <SafeAreaProvider style={{ backgroundColor: "#EEEEEE" }}>
      <SafeAreaView style={{ flex: 0, backgroundColor: "transparent" }} />

      <Navbar />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.contentWrapper}>
          
          <View style={[styles.mainWrapper, { width: isLarge ? "60%" : "100%" }]}>
            
            <View style={styles.containerStyle}>
              <Text style={styles.titleText}>Learn: Coulomb's Law</Text>
              <Text style={styles.description}>Understand point charge interactions through the video and quiz below.</Text>
            </View>

            <View style={styles.videoCard}>
              <View style={styles.videoWrapper}>{renderVideo()}</View>
            </View>

            <View style={styles.scoreCard}>
              <View>
                <Text style={styles.quizTitle}>Knowledge Check</Text>
                <Text style={styles.scoreLabel}>Your Score:</Text>
                <Text style={styles.scoreValue}>{score} / {quizData.length}</Text>
              </View>
              
              {Object.keys(userAnswers).length > 0 && (
                <TouchableOpacity 
                  onPress={retakeQuiz}
                  style={styles.retakeButton}
                >
                  <Text style={styles.retakeButtonText}>Retake Quiz</Text>
                </TouchableOpacity>
              )}
            </View>

            {quizData.map((quiz) => (
              <View key={quiz.id} style={styles.containerStyle}>
                <Text style={styles.quizQuestion}>{quiz.id}. {quiz.question}</Text>
                
                <View style={styles.optionContainer}>
                  {quiz.options.map((option, index) => {
                    const isSelected = userAnswers[quiz.id] === index;
                    const isCorrect = quiz.correctIndex === index;
                    const hasAnswered = userAnswers[quiz.id] !== undefined;

                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleAnswer(quiz.id, index, quiz.correctIndex)}
                        disabled={hasAnswered}
                        style={[
                          styles.quizOption,
                          hasAnswered && isCorrect && styles.correctOption,
                          isSelected && !isCorrect && styles.wrongOption
                        ]}
                      >
                        <Text style={[styles.optionText, hasAnswered && (isCorrect || isSelected) && { color: 'white' }]}>
                          {String.fromCharCode(65 + index)}. {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {userAnswers[quiz.id] !== undefined && (
                  <View style={styles.explanationBox}>
                    <Text style={styles.explanationTitle}>Explanation:</Text>
                    <Text style={styles.explanationText}>{quiz.explanation}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  contentWrapper: { flex: 1, alignItems: 'center' }, // Pengganti SafeAreaView pembungkus agar tidak ada garis samping
  mainWrapper: { alignItems: 'center', width: '100%' },
  containerStyle: {
    margin: 12, padding: 16, borderRadius: 16, backgroundColor: "white", elevation: 5, width: '90%',
  },
  videoCard: { margin: 16, borderRadius: 16, backgroundColor: "white", elevation: 5, overflow: 'hidden', width: '90%' },
  videoWrapper: { width: '100%', aspectRatio: 16 / 9 },
  video: { flex: 1 },
  titleText: { fontSize: 24, fontWeight: "bold", color: "#002467" },
  description: { fontSize: 15, color: "#444", marginTop: 5 },
  
  scoreCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#002467',
    padding: 20,
    borderRadius: 16,
    width: '90%',
    marginVertical: 10,
  },
  quizTitle: { color: '#FF9800', fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 5 },
  scoreLabel: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  scoreValue: { color: 'white', fontSize: 22, fontWeight: 'bold' },

  quizQuestion: { fontSize: 16, fontWeight: '700', marginBottom: 15, color: '#333' },
  optionContainer: { gap: 10 },
  quizOption: { padding: 12, backgroundColor: 'white', borderRadius: 10, borderWidth: 1, borderColor: '#e0e0e0' },
  correctOption: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  wrongOption: { backgroundColor: '#F44336', borderColor: '#F44336' },
  optionText: { fontSize: 14, color: '#333' },
  explanationBox: { marginTop: 15, padding: 12, backgroundColor: '#E3F2FD', borderRadius: 10, borderLeftWidth: 4, borderLeftColor: '#2196F3' },
  explanationTitle: { fontWeight: 'bold', color: '#1565C0', marginBottom: 4 },
  explanationText: { fontSize: 13, color: '#444', lineHeight: 18 },

  retakeButton: { backgroundColor: '#FF9800', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 10 },
  retakeButtonText: { color: 'white', fontWeight: 'bold', fontSize: 14}
});