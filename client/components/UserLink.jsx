import React, { useState } from "react";
import { Platform, StyleSheet, Text } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import ProfilePopout from "./ProfilePopout";

// A person's name that opens their profile card when you click it, like clicking a name in Discord. Your own
// name opens your profile page. Without an account (or without a person to open) it is plain text.
//   name        what to show
//   userUuid    who they are
//   style       the text style to use
//   canMessage  false hides the Message button on the card (inside a conversation with that person)
export default function UserLink({ name, userUuid, style, numberOfLines, canMessage = true }) {
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);

  if (!isAuthenticated || !userUuid) {
    return <Text style={style} numberOfLines={numberOfLines}>{name}</Text>;
  }
  if (userUuid === user?.userUuid) {
    return (
      <Text style={[style, styles.link]} numberOfLines={numberOfLines} accessibilityRole="link" onPress={() => router.push("/profile")}>
        {name}
      </Text>
    );
  }
  return (
    <>
      <Text style={[style, styles.link]} numberOfLines={numberOfLines} accessibilityRole="link" onPress={() => setOpen(true)}>
        {name}
      </Text>
      <ProfilePopout visible={open} userUuid={userUuid} canMessage={canMessage} onClose={() => setOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  link: Platform.select({ web: { cursor: "pointer" }, default: {} }),
});