import React from "react";
import { View, StyleSheet, Platform, ViewStyle } from "react-native";

interface UICardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const UICard: React.FC<UICardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1f2937",
    borderRadius: 8,
    padding: 24,
    ...Platform.select({
      web: {
        boxShadow:
          "0 0 5px rgba(234, 179, 8, 0.2), 0 0 10px rgba(234, 179, 8, 0.2), 0 0 15px rgba(234, 179, 8, 0.2)",
      },
      default: {
        shadowColor: "#eab308",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 5,
      },
    }),
  },
});
