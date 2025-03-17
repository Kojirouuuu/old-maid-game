import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ImageBackground,
} from "react-native";
import { CardType } from "../types/card";

type CardProps = {
  card: CardType;
  onPress?: () => void;
};

export const Card: React.FC<CardProps> = ({ card, onPress }) => {
  const { suit, number, isFaceUp } = card;

  return (
    <TouchableOpacity
      style={styles.cardWrapper}
      onPress={onPress}
      // 裏向きカードはタップ不能にしたい場合、disabled にする
      disabled={!isFaceUp}
    >
      {isFaceUp ? (
        // ---- 表向きカード ----
        <View style={[styles.cardContainer, styles.faceUpCard]}>
          <Text
            style={[
              styles.cardText,
              suit === "♥" || suit === "♦" ? styles.redCard : styles.blackCard,
            ]}
          >
            {`${suit}${number}`}
          </Text>
        </View>
      ) : (
        // ---- 裏向きカード (ImageBackground) ----
        <ImageBackground
          source={require("../assets/images/trump.png")}
          style={[styles.cardContainer, styles.faceDownCard]}
          imageStyle={styles.imageStyle}
        >
          <Text style={styles.faceDownText}>?</Text>
        </ImageBackground>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    margin: 5,
  },
  cardContainer: {
    width: 60,
    height: 90,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",

    // ---- シャドウを少し強めに設定 ----
    ...Platform.select({
      web: {
        boxShadow: "0 4px 6px rgba(0,0,0,0.5)",
      },
      default: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 6,
      },
    }),
  },
  // ---- 表向きカード ----
  faceUpCard: {
    backgroundColor: "#fff",
  },
  // ---- 裏向きカード: ImageBackground で背景画像を敷く ----
  faceDownCard: {
    backgroundColor: "transparent", // 背景は透過
  },
  // ImageBackground 内の画像スタイル
  imageStyle: {
    resizeMode: "contain", // 画像をカードサイズでカバー
    borderRadius: 8,
  },
  cardText: {
    fontSize: 20,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  faceDownText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  redCard: {
    color: "red",
  },
  blackCard: {
    color: "black",
  },
});
