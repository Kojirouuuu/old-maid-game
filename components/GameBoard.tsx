import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Animated,
  Dimensions,
} from "react-native";
import { PlayerHand } from "./PlayerHand";
import { useOldMaidGame } from "../hooks/useOldMaidGame";
import { Card } from "./Card";
import { CardType } from "../types/card";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const GameBoard: React.FC = () => {
  const {
    players,
    currentTurn,
    gameStarted,
    gameOver,
    isCoinTossing,
    isCheckingInitialPairs,
    coinResult,
    discardedPairs,
    initializeGame,
    tossCoin,
    drawCard,
    checkGameOver,
    setCurrentTurn,
    findAndRemovePairs,
    playerHand,
    npcHand,
    gameStatus,
    gameResult,
    handleCardPress,
    handleStartGame,
    resetGame,
  } = useOldMaidGame();

  const [pairAnimations] = useState(() => new Map());
  const [drawAnimations] = useState(() => new Map());

  useEffect(() => {
    discardedPairs.forEach((pair, index) => {
      if (!pairAnimations.has(index)) {
        const animation = new Animated.Value(0);
        pairAnimations.set(index, animation);

        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start();
      }
    });
  }, [discardedPairs]);

  useEffect(() => {
    const animateCardDraw = (card: CardType, playerIndex: number) => {
      const animation = new Animated.Value(0);
      drawAnimations.set(card.id, animation);

      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    };

    if (gameStatus === "プレイヤーの番です") {
      const lastCard = playerHand[playerHand.length - 1];
      if (lastCard) {
        animateCardDraw(lastCard, 0);
      }
    }

    if (gameStatus === "NPCの番です") {
      const lastCard = npcHand[npcHand.length - 1];
      if (lastCard) {
        animateCardDraw(lastCard, 1);
      }
    }
  }, [playerHand, npcHand, gameStatus]);

  const renderCard = (card: CardType, index: number, isPlayer: boolean) => {
    const animation = drawAnimations.get(card.id);
    if (!animation)
      return (
        <Card
          key={card.id}
          card={card}
          onPress={() => isPlayer && handleCardPress(index)}
        />
      );

    return (
      <Animated.View
        key={card.id}
        style={[
          styles.cardContainer,
          {
            opacity: animation,
            transform: [
              {
                translateX: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [SCREEN_WIDTH / 2, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Card card={card} onPress={() => isPlayer && handleCardPress(index)} />
      </Animated.View>
    );
  };

  const renderGameResult = () => {
    if (!gameResult) return null;

    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>
          {gameResult.winner === "プレイヤー" ? "🎉 勝ち！" : "😢 負け..."}
        </Text>
        <Text style={styles.resultText}>
          {gameResult.hasJoker
            ? "ジョーカーを持っていました！"
            : "ジョーカーを持っていませんでした！"}
        </Text>
        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <Text style={styles.resetButtonText}>もう一度プレイ</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {!gameStarted ? (
        <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
          <Text style={styles.startButtonText}>ゲームを開始</Text>
        </TouchableOpacity>
      ) : isCoinTossing ? (
        <View style={styles.coinTossContainer}>
          <Text style={styles.coinTossText}>コイントス中...</Text>
          <TouchableOpacity style={styles.coinTossButton} onPress={tossCoin}>
            <Text style={styles.coinTossButtonText}>コインを投げる</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <PlayerHand cards={players[1].cards} isNPC={true} />
          <View style={styles.gameStatus}>
            <Text style={styles.statusText}>
              {gameOver
                ? "ゲーム終了!"
                : isCheckingInitialPairs
                ? "ペアを確認中..."
                : gameStatus}
            </Text>
            <Text style={styles.coinResultText}>
              {coinResult &&
                `先攻: ${coinResult === "先攻" ? "プレイヤー" : "NPC"}`}
            </Text>
          </View>
          <View style={styles.discardedPairsContainer}>
            {discardedPairs.map((pair, index) => (
              <Animated.View
                key={`${pair.timestamp}-${index}`}
                style={[
                  styles.pairContainer,
                  {
                    opacity: pairAnimations.get(index),
                    transform: [
                      {
                        scale: pairAnimations.get(index).interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.5, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.pairText}>
                  {pair.playerIndex === 0 ? "プレイヤー" : "NPC"}のペア
                </Text>
                <View style={styles.pairCards}>
                  {pair.cards.map((card) => (
                    <Card key={card.id} card={card} onPress={() => {}} />
                  ))}
                </View>
              </Animated.View>
            ))}
          </View>
          <PlayerHand
            cards={players[0].cards}
            onCardPress={(index) => handleCardPress(index)}
          />
          {gameResult && renderGameResult()}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  startButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  coinTossContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  coinTossText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  coinTossButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  coinTossButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  gameStatus: {
    alignItems: "center",
    padding: 10,
  },
  statusText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  coinResultText: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  discardedPairsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 10,
    minHeight: 120,
  },
  pairContainer: {
    alignItems: "center",
    margin: 5,
  },
  pairText: {
    fontSize: 16,
    marginBottom: 5,
  },
  pairCards: {
    flexDirection: "row",
  },
  cardContainer: {
    margin: 5,
  },
  resultContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  resultTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  resultText: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 30,
  },
  resetButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
