import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Platform,
} from "react-native";
import { GameBoard } from "../../components/GameBoard";
import { StartMenu } from "../../components/StartMenu";

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);

  if (!gameStarted) {
    return <StartMenu onStart={() => setGameStarted(true)} />;
  }

  return (
    <View style={styles.gameContainer}>
      {/* GameBoard など */}
      <GameBoard />
    </View>
  );
}

const styles = StyleSheet.create({
  // ------- ゲーム開始後（GameBoardを表示する画面）のスタイル -------
  gameContainer: {
    flex: 1,
    backgroundColor: "#064635", // カジノ風の深い緑
  },
});
