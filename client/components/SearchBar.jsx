import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Search, X } from "lucide-react-native";
import { Colors } from "../constant/Colors";

// A text box for filtering a list as you type, with a button to clear it.
export default function SearchBar({ value, onChangeText, placeholder = "Search", style }) {
  return (
    <View style={[styles.container, style]}>
      <Search size={18} color={Colors.TEXT_MUTED} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.TEXT_MUTED}
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        accessibilityLabel={placeholder}
      />
      {value ? (
        <TouchableOpacity
          onPress={() => onChangeText("")}
          accessibilityLabel="Clear search"
          hitSlop={8}
        >
          <X size={18} color={Colors.TEXT_MUTED} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.TEXT,
    padding: 0,
    // Drops the browser's own focus ring on web; the rounded border is enough.
    outlineStyle: "none",
  },
});
