export type CardType = {
  id: string;
  suit: "♠" | "♥" | "♦" | "♣";
  number: number;
  isFaceUp?: boolean;
};
