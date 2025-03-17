import { useState, useCallback, useEffect } from "react";
import { CardType } from "../types/card";

type Player = {
  cards: CardType[];
  name: string;
};

type DiscardedPair = {
  cards: CardType[];
  playerIndex: number;
  timestamp: number;
};

type GameResult = {
  winner: "プレイヤー" | "NPC";
  hasJoker: boolean;
};

export const useOldMaidGame = () => {
  const [players, setPlayers] = useState<Player[]>([
    { cards: [], name: "プレイヤー" },
    { cards: [], name: "NPC" },
  ]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isCoinTossing, setIsCoinTossing] = useState(false);
  const [coinResult, setCoinResult] = useState<"先攻" | "後攻" | null>(null);
  const [discardedPairs, setDiscardedPairs] = useState<DiscardedPair[]>([]);
  const [isCheckingInitialPairs, setIsCheckingInitialPairs] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const findAndRemovePairs = useCallback((playerIndex: number) => {
    let foundPairs: CardType[][] = [];
    setPlayers((prevPlayers) => {
      const newPlayers = [...prevPlayers];
      const player = newPlayers[playerIndex];
      const newCards = [...player.cards];

      // ペアを探す
      for (let i = 0; i < newCards.length; i++) {
        for (let j = i + 1; j < newCards.length; j++) {
          if (newCards[i].number === newCards[j].number) {
            foundPairs.push([newCards[i], newCards[j]]);
            // ペアのカードを削除
            newCards.splice(j, 1);
            newCards.splice(i, 1);
            i--; // インデックスを調整
            break;
          }
        }
      }

      newPlayers[playerIndex].cards = newCards;
      return newPlayers;
    });

    if (foundPairs.length > 0) {
      const newPairs: DiscardedPair[] = foundPairs.map((pair) => ({
        cards: pair,
        playerIndex,
        timestamp: Date.now(),
      }));
      setDiscardedPairs((prev) => [...prev, ...newPairs]);
    }
  }, []);

  const initializeGame = useCallback(() => {
    const suits: CardType["suit"][] = ["♠", "♥", "♦", "♣"];
    const numbers = Array.from({ length: 13 }, (_, i) => i + 1);
    let deck: CardType[] = [];

    // デッキを作成
    suits.forEach((suit) => {
      numbers.forEach((number) => {
        deck.push({ id: `${suit}-${number}`, suit, number });
      });
    });

    // ジョーカーを追加（ババ）
    deck.push({ id: "joker", suit: "♠", number: 0 });

    // デッキをシャッフル
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    // カードを配る
    const playerCards = deck.slice(0, Math.floor(deck.length / 2));
    const npcCards = deck.slice(Math.floor(deck.length / 2));

    setPlayers([
      { cards: playerCards, name: "プレイヤー" },
      { cards: npcCards, name: "NPC" },
    ]);
    setGameStarted(true);
    setGameOver(false);
    setDiscardedPairs([]);
    setGameResult(null);
    setIsCoinTossing(true); // コイントスから開始
  }, []);

  const tossCoin = useCallback(() => {
    const result = Math.random() < 0.5 ? "先攻" : "後攻";
    setCoinResult(result);
    setCurrentTurn(result === "先攻" ? 0 : 1);
    setIsCoinTossing(false);
    setIsCheckingInitialPairs(true); // コイントス後にペア確認を開始
    // プレイヤーのペアを確認
    findAndRemovePairs(0);
    // NPCのペアを確認
    findAndRemovePairs(1);
    // 少し待ってからゲーム開始
    setTimeout(() => {
      setIsCheckingInitialPairs(false);
    }, 2000);
  }, [findAndRemovePairs]);

  const drawCard = useCallback(
    (fromPlayerIndex: number, toPlayerIndex: number) => {
      setPlayers((prevPlayers) => {
        const newPlayers = [...prevPlayers];
        const card = newPlayers[fromPlayerIndex].cards[0];
        newPlayers[fromPlayerIndex].cards =
          newPlayers[fromPlayerIndex].cards.slice(1);
        newPlayers[toPlayerIndex].cards.push(card);
        return newPlayers;
      });
    },
    []
  );

  const checkGameOver = useCallback(() => {
    const hasEmptyHand = players.some((player) => player.cards.length === 0);
    if (hasEmptyHand) {
      setGameOver(true);
      // 勝者を決定
      const winner = players.find((player) => player.cards.length === 0)
        ?.name as "プレイヤー" | "NPC";
      const loser = players.find((player) => player.cards.length > 0)!;
      const hasJoker = loser.cards.some((card) => card.number === 0);
      setGameResult({ winner, hasJoker });
    }
  }, [players]);

  const checkHandAndGameOver = useCallback(
    (playerIndex: number) => {
      const player = players[playerIndex];

      // 手札が空の場合は、そのプレイヤーの勝利
      if (player.cards.length === 0) {
        setGameOver(true);
        setGameResult({
          winner: player.name as "プレイヤー" | "NPC",
          hasJoker: false, // 相手はジョーカーを持っているはず
        });
      }
      // 手札が1枚の場合、そのカードがジョーカーならそのプレイヤーの負け
      else if (player.cards.length === 1 && player.cards[0].number === 0) {
        setGameOver(true);
        setGameResult({
          winner: players[1 - playerIndex].name as "プレイヤー" | "NPC",
          hasJoker: true,
        });
      }
      // 手札が1枚でもジョーカー以外なら、まだゲーム続行の可能性があるためゲーム終了とはしない
    },
    [players]
  );

  const handleCardPress = useCallback(
    (index: number) => {
      if (
        currentTurn !== 0 ||
        gameOver ||
        isCoinTossing ||
        isCheckingInitialPairs
      )
        return;
      const nextPlayerIndex = 1;
      drawCard(nextPlayerIndex, currentTurn);
      findAndRemovePairs(currentTurn);
      setCurrentTurn(nextPlayerIndex);
      checkHandAndGameOver(nextPlayerIndex);
    },
    [
      currentTurn,
      gameOver,
      isCoinTossing,
      isCheckingInitialPairs,
      drawCard,
      findAndRemovePairs,
      checkHandAndGameOver,
    ]
  );

  const handleStartGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  const resetGame = useCallback(() => {
    setGameStarted(false);
    setGameOver(false);
    setGameResult(null);
    setDiscardedPairs([]);
    setCoinResult(null);
    setIsCoinTossing(false);
    setIsCheckingInitialPairs(false);
  }, []);

  // NPCの自動プレイ
  useEffect(() => {
    if (
      gameStarted &&
      !gameOver &&
      !isCoinTossing &&
      !isCheckingInitialPairs &&
      currentTurn === 1
    ) {
      const timer = setTimeout(() => {
        const nextPlayerIndex = 0;
        drawCard(nextPlayerIndex, currentTurn);
        findAndRemovePairs(currentTurn);
        setCurrentTurn(nextPlayerIndex);
        checkHandAndGameOver(nextPlayerIndex);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [
    currentTurn,
    gameStarted,
    gameOver,
    isCoinTossing,
    isCheckingInitialPairs,
    drawCard,
    checkHandAndGameOver,
    findAndRemovePairs,
  ]);

  const gameStatus = gameOver
    ? "ゲーム終了!"
    : isCheckingInitialPairs
    ? "ペアを確認中..."
    : currentTurn === 0
    ? "プレイヤーの番です"
    : "NPCの番です";

  return {
    players,
    currentTurn,
    gameStarted,
    gameOver,
    isCoinTossing,
    isCheckingInitialPairs,
    coinResult,
    discardedPairs,
    gameResult,
    gameStatus,
    playerHand: players[0].cards,
    npcHand: players[1].cards,
    initializeGame,
    tossCoin,
    drawCard,
    checkGameOver,
    setCurrentTurn,
    findAndRemovePairs,
    handleCardPress,
    handleStartGame,
    resetGame,
  };
};
