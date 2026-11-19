import React, { useEffect, useState } from "react";
import { ActivityIndicator, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import WebLayout from "../../components/WebLayout";
import ProfileCard from "../../components/ProfileCard";
import ProfileActivity from "../../components/ProfileActivity";
import { Colors } from "../../constant/Colors";
import { useAuth } from "../../context/AuthContext";
import { getPublicProfile } from "../../services/userService";

// Someone's full profile: open /profile/view?uuid=<userUuid>. Needs an account. Shows what everyone may see:
// who they are, what they have contributed, and their recent public posts and events.
export default function PublicProfileScreen() {
  const params = useLocalSearchParams();
  const uuid = typeof params.uuid === "string" ? params.uuid : "";
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (authLoading || !isAuthenticated || !uuid) return undefined;
    let live = true;
    setLoading(true);
    setFailed(false);
    getPublicProfile(uuid)
      .then((result) => {
        if (live) setProfile(result);
      })
      .catch(() => {
        if (live) setFailed(true);
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [authLoading, isAuthenticated, uuid]);

  let body;
  if (authLoading || (isAuthenticated && loading)) {
    body = <ActivityIndicator color={Colors.PRIMARY} style={{ marginTop: 40 }} />;
  } else if (!isAuthenticated) {
    body = (
      <View style={styles.centered}>
        <Text style={styles.message}>Sign in to view profiles.</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/authentication/login")}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (failed || !profile) {
    body = <Text style={styles.message}>This profile couldn&apos;t be found.</Text>;
  } else {
    body = (
      <View style={styles.card}>
        <ProfileCard
          profile={profile}
          large
          onMessage={profile.isSelf ? undefined : () => router.push({ pathname: "/messages", params: { with: profile.userUuid } })}
          onEdit={profile.isSelf ? () => router.push("/profile") : undefined}
        >
          <ProfileActivity profile={profile} />
        </ProfileCard>
      </View>
    );
  }

  const content = (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.back} onPress={() => (router.canGoBack() ? router.back() : router.replace("/home_screen/home"))}>
          <ArrowLeft size={20} color={Colors.PRIMARY} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        {body}
      </ScrollView>
    </SafeAreaView>
  );

  return Platform.OS === "web" ? <WebLayout>{content}</WebLayout> : content;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 20, paddingBottom: 48, width: "100%", maxWidth: 720, alignSelf: "center" },
  back: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16, alignSelf: "flex-start" },
  backText: { color: Colors.PRIMARY, fontWeight: "700", fontSize: 15 },
  card: { backgroundColor: Colors.WHITE, borderRadius: 16, borderWidth: 1, borderColor: Colors.GRAY_200, padding: 24 },
  centered: { alignItems: "center", gap: 14, marginTop: 40 },
  message: { color: Colors.TEXT_SECONDARY, textAlign: "center", marginTop: 40, fontSize: 15 },
  button: { backgroundColor: Colors.PRIMARY, borderRadius: 10, paddingHorizontal: 22, paddingVertical: 12 },
  buttonText: { color: Colors.WHITE, fontWeight: "800" },
});