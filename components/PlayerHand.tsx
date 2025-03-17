import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "./Card";
import { CardType } from "../types/card";

type PlayerHandProps = {
  cards: CardType[];
  onCardPress?: (index: number) => void;
  isNPC?: boolean;
};

export const PlayerHand: React.FC<PlayerHandProps> = ({
  cards,
  onCardPress,
  isNPC = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.playerName}>{isNPC ? "NPC" : "プレイヤー"}</Text>
      <View style={styles.cardsContainer}>
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={{ ...card, isFaceUp: !isNPC }}
            onPress={() => onCardPress?.(index)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 10,
  },
  playerName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
});
