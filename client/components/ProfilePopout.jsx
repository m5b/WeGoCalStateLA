import React, { useEffect, useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { Colors } from "../constant/Colors";
import ProfileCard from "./ProfileCard";
import { getPublicProfile } from "../services/userService";

// The small card that opens when you click someone's name: who they are, with buttons to message them or
// open their full profile. Closes when you click outside it.
//   canMessage  false hides the Message button (used inside a conversation with that person)
export default function ProfilePopout({ userUuid, visible, onClose, canMessage = true }) {
  const [profile, setProfile] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!visible) return undefined;
    let live = true;
    setProfile(null);
    setFailed(false);
    getPublicProfile(userUuid)
      .then((result) => {
        if (live) setProfile(result);
      })
      .catch(() => {
        if (live) setFailed(true);
      });
    return () => {
      live = false;
    };
  }, [visible, userUuid]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.card} onStartShouldSetResponder={() => true}>
          {profile ? (
            <ProfileCard
              profile={profile}
              onMessage={
                canMessage
                  ? () => {
                      onClose();
                      router.push({ pathname: "/messages", params: { with: profile.userUuid } });
                    }
                  : undefined
              }
              onViewProfile={() => {
                onClose();
                router.push({ pathname: "/profile/view", params: { uuid: profile.userUuid } });
              }}
            />
          ) : failed ? (
            <Text style={styles.message}>Couldn&apos;t load this profile. Please try again.</Text>
          ) : (
            <ActivityIndicator color={Colors.PRIMARY} style={{ marginVertical: 28 }} />
          )}
          <TouchableOpacity onPress={onClose} style={styles.close}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(15,23,42,0.5)", alignItems: "center", justifyContent: "center", padding: 20 },
  card: { backgroundColor: Colors.WHITE, borderRadius: 16, padding: 20, width: "100%", maxWidth: 380 },
  message: { color: Colors.TEXT_SECONDARY, textAlign: "center", marginVertical: 24 },
  close: { alignSelf: "center", marginTop: 14, paddingVertical: 6, paddingHorizontal: 12 },
  closeText: { color: Colors.TEXT_MUTED, fontWeight: "700" },
});