import { UICard } from "../components/UICard";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Home() {
  const [isGameStarted, setIsGameStarted] = useState(false);

  return (
    <LinearGradient
      colors={["#064e3b", "#065f46", "#064e3b"]}
      style={styles.container}
    >
      <View style={styles.content}>
        {!isGameStarted ? (
          <View style={styles.startScreen}>
            <Text style={styles.title}>ROYAL OLD MAID</Text>
            <View style={styles.statsContainer}>
              <StatsCard icon="👑" title="ハイスコア" value="2,500" />
              <StatsCard icon="👥" title="総プレイ回数" value="142" />
            </View>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => setIsGameStarted(true)}
            >
              <Text style={styles.startButtonText}>ゲームを開始</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <GameBoard />
        )}
      </View>
    </LinearGradient>
  );
}

function StatsCard({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string;
}) {
  return (
    <View style={styles.statsCard}>
      <View style={styles.statsHeader}>
        <Text style={styles.statsIcon}>{icon}</Text>
        <Text style={styles.statsTitle}>{title}</Text>
      </View>
      <Text style={styles.statsValue}>{value}</Text>
    </View>
  );
}

function GameBoard() {
  return (
    <View style={styles.gameBoard}>
      {/* NPCのカード */}
      <View style={styles.opponentCards}>
        <View style={styles.playerLabel}>
          <Text style={styles.playerLabel}>NPC</Text>
        </View>
        <View style={styles.cardsContainer}>
          {[...Array(5)].map((_, i) => (
            <View
              key={`opponent-${i}`}
              style={[
                styles.card,
                {
                  transform: [
                    { translateX: i * 30 },
                    { rotate: `${i * 2}deg` },
                  ],
                  backgroundColor: "#991b1b",
                  borderColor: "rgba(234, 179, 8, 0.2)",
                },
              ]}
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
                style={styles.cardGradient}
              />
            </View>
          ))}
        </View>
      </View>

      {/* ゲームテーブル */}
      <View style={styles.gameTable}>
        <View style={styles.tableCircle}>
          <LinearGradient
            colors={["rgba(234, 179, 8, 0.1)", "rgba(234, 179, 8, 0.05)"]}
            style={styles.tableGradient}
          />
          <Text style={styles.tableIcon}>🃏</Text>
        </View>
      </View>

      {/* プレイヤーのカード */}
      <View style={styles.playerCards}>
        <View style={styles.playerLabel}>
          <Text style={styles.playerLabel}>プレイヤー</Text>
        </View>
        <View style={styles.cardsContainer}>
          {[...Array(7)].map((_, i) => (
            <TouchableOpacity
              key={`player-${i}`}
              style={[
                styles.card,
                {
                  transform: [
                    { translateX: i * 30 },
                    { rotate: `${i * 2 - 6}deg` },
                  ],
                  backgroundColor: "#991b1b",
                  borderColor: "rgba(234, 179, 8, 0.2)",
                },
              ]}
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
                style={styles.cardGradient}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  startScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#facc15",
    textAlign: "center",
    marginBottom: 32,
    textShadowColor: "rgba(234, 179, 8, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  statsCard: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(234, 179, 8, 0.2)",
    width: 160,
  },
  statsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  statsIcon: {
    fontSize: 20,
  },
  statsTitle: {
    color: "rgba(253, 224, 71, 0.8)",
    fontSize: 14,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#facc15",
  },
  startButton: {
    backgroundColor: "#facc15",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  gameBoard: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  opponentCards: {
    height: 200,
    alignItems: "center",
  },
  playerCards: {
    height: 200,
    alignItems: "center",
  },
  cardsContainer: {
    height: 160,
    width: "100%",
    justifyContent: "center",
  },
  card: {
    width: 96,
    height: 144,
    borderRadius: 12,
    borderWidth: 2,
    position: "absolute",
    left: "50%",
    marginLeft: -48,
    overflow: "hidden",
  },
  cardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gameTable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tableCircle: {
    width: 384,
    height: 384,
    borderRadius: 192,
    borderWidth: 1,
    borderColor: "rgba(234, 179, 8, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  tableGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  tableIcon: {
    fontSize: 64,
    opacity: 0.3,
  },
  playerLabel: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(234, 179, 8, 0.2)",
    marginBottom: 16,
  },
  playerLabelText: {
    color: "#facc15",
    fontSize: 16,
    fontWeight: "bold",
  },
});
