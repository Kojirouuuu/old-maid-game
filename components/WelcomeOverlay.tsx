import React from "react";
import { Text, TouchableOpacity, StyleSheet, Platform } from "react-native";
import * as Animatable from "react-native-animatable";

interface WelcomeOverlayProps {
  onStart: () => void;
}

export const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ onStart }) => {
  return (
    <Animatable.View
      animation="fadeInDown"
      duration={1500}
      delay={300}
      style={styles.overlay}
    >
      <Text style={styles.introTitle}>Welcome!</Text>
      <TouchableOpacity onPress={onStart} style={styles.startButton}>
        <Text style={styles.startButtonText}>Start Game</Text>
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    borderRadius: 10,
  },
  introTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#facc15",
    marginBottom: 10,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  startButton: {
    backgroundColor: "#facc15",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 2,
    borderColor: "rgba(234, 179, 8, 0.8)",
    ...Platform.select({
      web: {
        boxShadow: "0 4px 6px rgba(0,0,0,0.5)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 6,
      },
    }),
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textShadowColor: "rgba(255,255,255,0.4)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
