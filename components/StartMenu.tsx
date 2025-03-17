import React from "react";
import { StyleSheet, ImageBackground, View } from "react-native";
import { WelcomeOverlay } from "./WelcomeOverlay";

interface StartMenuProps {
  onStart: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ onStart }) => {
  return (
    <ImageBackground
      source={require("../assets/images/DALL·E 2025-03-18 01.28.36 - A luxurious casino background with a rich, atmospheric feel. The scene features green-felt card tables, golden lighting, and elegant decorations. The .webp")}
      style={styles.introContainer}
    >
      <View style={styles.centerContainer}>
        <WelcomeOverlay onStart={onStart} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  introContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  introImage: {
    resizeMode: "cover",
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
