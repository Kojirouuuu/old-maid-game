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
import { LinearGradient } from "expo-linear-gradient";

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
    <View style={styles.outerContainer}>
      <LinearGradient
        colors={[
          "rgba(6, 70, 53, 0.95)",
          "rgba(4, 47, 35, 0.98)",
          "rgba(6, 70, 53, 0.95)",
        ]}
        style={styles.gradientBackground}
      >
        <View style={styles.container}>
          {!gameStarted ? (
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeTitle}>Royal Old Maid</Text>
              <Text style={styles.welcomeSubtitle}>カジノの王様へようこそ</Text>
              <TouchableOpacity
                style={styles.startButton}
                onPress={handleStartGame}
              >
                <Text style={styles.startButtonText}>ゲームを開始</Text>
              </TouchableOpacity>
            </View>
          ) : isCoinTossing ? (
            <View style={styles.coinTossContainer}>
              <Text style={styles.coinTossText}>コイントス中...</Text>
              <TouchableOpacity
                style={styles.coinTossButton}
                onPress={tossCoin}
              >
                <Text style={styles.coinTossButtonText}>コインを投げる</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.gameContainer}>
              <PlayerHand cards={players[1].cards} isNPC={true} />
              <View style={styles.middleSection}>
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
              </View>
              <PlayerHand
                cards={players[0].cards}
                onCardPress={(index) => handleCardPress(index)}
              />
              {gameResult && renderGameResult()}
            </View>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#064635",
  },
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#facc15",
    textAlign: "center",
    marginBottom: 16,
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 5,
  },
  welcomeSubtitle: {
    fontSize: 24,
    color: "rgba(253, 224, 71, 0.9)",
    textAlign: "center",
    marginBottom: 32,
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  gameContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  middleSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  // ゲーム開始ボタン
  startButton: {
    backgroundColor: "#facc15",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 2,
    // ゴールド調の枠線
    borderColor: "rgba(234, 179, 8, 0.8)",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5, // Android用
  },
  startButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    textShadowColor: "rgba(255, 255, 255, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // コイントス画面
  coinTossContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // 若干黒みがかったエリアで際立たせる
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    padding: 20,
  },
  coinTossText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#facc15",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  coinTossButton: {
    backgroundColor: "#facc15",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 2,
    borderColor: "rgba(234, 179, 8, 0.8)",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5, // Android用
  },
  coinTossButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  // ゲームステータス表示
  gameStatus: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(234, 179, 8, 0.4)",
  },
  statusText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#facc15",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  coinResultText: {
    fontSize: 16,
    color: "rgba(253, 224, 71, 0.8)",
    marginTop: 5,
  },
  // 捨て札（ペア）のコンテナ
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
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    // ゴールド調の薄い枠線
    borderColor: "rgba(234, 179, 8, 0.2)",
  },
  pairText: {
    fontSize: 16,
    color: "#facc15",
    marginBottom: 5,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  pairCards: {
    flexDirection: "row",
  },
  cardContainer: {
    margin: 5,
  },
  // リザルト画面
  resultContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // 背景を少し濃くして前面に表示
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  resultTitle: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#facc15",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 5,
  },
  resultText: {
    fontSize: 24,
    color: "rgba(253, 224, 71, 0.9)",
    marginBottom: 30,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  resetButton: {
    backgroundColor: "#facc15",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(234, 179, 8, 0.8)",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5, // Android用
  },
  resetButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    textShadowColor: "rgba(255, 255, 255, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
