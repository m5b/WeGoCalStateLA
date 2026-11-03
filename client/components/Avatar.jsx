import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "../constant/Colors";

// A round badge with the first letter of someone's name, like the profile pictures in a chat app.
export default function Avatar({ name, size = 28 }) {
  const initial = (name || "?").trim().charAt(0).toUpperCase() || "?";
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.letter, { fontSize: Math.round(size * 0.45) }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: Colors.BRAND_GOLD,
    alignItems: "center",
    justifyContent: "center",
  },
  letter: {
    color: Colors.BLACK,
    fontWeight: "700",
  },
});