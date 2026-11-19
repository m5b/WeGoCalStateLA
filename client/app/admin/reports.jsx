import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import WebLayout from "../../components/WebLayout";
import { Colors } from "../../constant/Colors";
import { useAuth } from "../../context/AuthContext";
import { listReports, resolveReport } from "../../services/messages";
import { formatMessageTime } from "../../utils/formatMessageTime";

// Admins: messages people have reported. Each report holds only that one message and the reason, never the
// rest of the conversation. Deal with the person on Manage Users, then mark the report resolved.
export default function AdminReportsScreen() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [reports, setReports] = useState([]);
  const [showResolved, setShowResolved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setReports(await listReports({ includeResolved: showResolved }));
      setError("");
    } catch (err) {
      console.warn("Failed to load reports", err);
      setError("Could not load the reports.");
    } finally {
      setLoading(false);
    }
  }, [showResolved]);

  useEffect(() => {
    if (authLoading || !isAuthenticated || !user?.isAdmin) return;
    load();
  }, [authLoading, isAuthenticated, user?.isAdmin, load]);

  const resolve = async (report) => {
    try {
      await resolveReport(report.reportUuid);
      await load();
    } catch (err) {
      console.warn("Failed to resolve report", err);
      setError("Could not mark it resolved.");
    }
  };

  if (authLoading) {
    return (
      <WebLayout>
        <ActivityIndicator color={Colors.PRIMARY} style={{ marginTop: 40 }} />
      </WebLayout>
    );
  }

  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <WebLayout>
        <Text style={styles.notice}>Only admins can see message reports.</Text>
      </WebLayout>
    );
  }

  return (
    <WebLayout>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.top}>
          <Text style={styles.title}>Message reports</Text>
          <View style={styles.switchRow}>
            <Switch value={showResolved} onValueChange={setShowResolved} />
            <Text style={styles.small}>Show resolved</Text>
          </View>
        </View>

        {loading ? <ActivityIndicator color={Colors.PRIMARY} style={{ marginTop: 24 }} /> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {!loading && !error && reports.length === 0 ? (
          <Text style={styles.notice}>No reports to review.</Text>
        ) : null}

        {reports.map((report) => (
          <View key={report.reportUuid} style={[styles.card, report.resolvedAt && { opacity: 0.6 }]}>
            <Text style={styles.heading}>
              {report.reported.displayName} <Text style={styles.small}>(@{report.reported.username})</Text>
            </Text>
            <Text style={styles.small}>
              Reported by {report.reporter.displayName}{" \u00b7 "}{formatMessageTime(report.createdAt)}
            </Text>
            <Text style={styles.label}>Reason</Text>
            <Text style={styles.body}>{report.reason}</Text>
            <Text style={styles.label}>The message</Text>
            <View style={styles.message}>
              {report.photoUrl ? <Image source={{ uri: report.photoUrl }} resizeMode="cover" style={styles.photo} /> : null}
              {report.messageText ? <Text style={styles.body}>{report.messageText}</Text> : null}
            </View>
            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => router.push("/admin/users")}>
                <Text style={styles.link}>Open Manage Users</Text>
              </TouchableOpacity>
              {report.resolvedAt ? (
                <Text style={styles.small}>Resolved</Text>
              ) : (
                <TouchableOpacity style={styles.resolve} onPress={() => resolve(report)}>
                  <Text style={styles.resolveText}>Mark resolved</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </WebLayout>
  );
}

const styles = StyleSheet.create({
  content: { width: "100%", maxWidth: 860, alignSelf: "center", padding: 16, gap: 14 },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { color: Colors.TEXT, fontSize: 22, fontWeight: "800" },
  switchRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  small: { color: Colors.TEXT_MUTED, fontSize: 13 },
  notice: { color: Colors.TEXT_MUTED, textAlign: "center", marginTop: 24 },
  error: { color: Colors.ERROR },
  card: { backgroundColor: Colors.WHITE, borderRadius: 14, borderWidth: 1, borderColor: Colors.BORDER, padding: 16, gap: 4 },
  heading: { color: Colors.TEXT, fontSize: 16, fontWeight: "800" },
  label: { color: Colors.TEXT_SECONDARY, fontSize: 12, fontWeight: "800", textTransform: "uppercase", marginTop: 10 },
  body: { color: Colors.TEXT, fontSize: 15 },
  message: { backgroundColor: Colors.LIGHT_GRAY, borderRadius: 10, padding: 10, gap: 8 },
  photo: { width: 240, height: 180, borderRadius: 10, backgroundColor: Colors.GRAY_200 },
  buttons: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 12 },
  link: { color: Colors.PRIMARY, fontWeight: "700" },
  resolve: { backgroundColor: Colors.PRIMARY, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10 },
  resolveText: { color: Colors.WHITE, fontWeight: "700" },
});