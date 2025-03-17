import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CardType } from "../types/card";

type CardProps = {
  card: CardType;
  onPress?: () => void;
};

export const Card: React.FC<CardProps> = ({ card, onPress }) => {
  const { id, suit, number, isFaceUp = true } = card;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text
        style={[
          styles.cardText,
          suit === "♥" || suit === "♦" ? styles.redCard : styles.blackCard,
        ]}
      >
        {isFaceUp ? `${suit}${number}` : "?"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 60,
    height: 90,
    backgroundColor: "white",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  redCard: {
    color: "red",
  },
  blackCard: {
    color: "black",
  },
});
