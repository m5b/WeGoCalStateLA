import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constant/Colors";
import Avatar from "../Avatar";
import { searchPeople } from "../../services/messages";

// "New message": type part of someone's name to find them, then tap them to open a conversation.
export default function PeopleSearch({ visible, onClose, onPick }) {
  const [query, setQuery] = useState("");
  const [people, setPeople] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!visible) {
      setQuery("");
      setPeople([]);
      setError("");
    }
  }, [visible]);

  // Searches a moment after you stop typing.
  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setPeople([]);
      return undefined;
    }
    setSearching(true);
    const timer = setTimeout(async () => {
      try {
        setPeople(await searchPeople(term));
        setError("");
      } catch (err) {
        console.warn("People search failed", err);
        setError("Couldn't search right now.");
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.dialog}>
          <View style={styles.top}>
            <Text style={styles.title}>New message</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.close}>Close</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            autoFocus
            placeholder="Search by name (at least 2 letters)"
            placeholderTextColor={Colors.TEXT_MUTED}
            value={query}
            onChangeText={setQuery}
            style={styles.input}
          />
          <ScrollView style={{ maxHeight: 320 }}>
            {searching ? <ActivityIndicator color={Colors.PRIMARY} style={{ margin: 12 }} /> : null}
            {error ? <Text style={styles.empty}>{error}</Text> : null}
            {!searching && !error && query.trim().length >= 2 && people.length === 0 ? (
              <Text style={styles.empty}>Nobody found.</Text>
            ) : null}
            {people.map((person) => (
              <TouchableOpacity key={person.userUuid} style={styles.row} onPress={() => onPick(person)}>
                <Avatar name={person.displayName} size={36} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{person.displayName}</Text>
                  {person.alias ? <Text style={styles.username}>@{person.username}</Text> : null}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  dialog: { width: "100%", maxWidth: 440, backgroundColor: Colors.WHITE, borderRadius: 16, padding: 20, gap: 12 },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { color: Colors.TEXT, fontSize: 18, fontWeight: "800" },
  close: { color: Colors.PRIMARY, fontWeight: "700" },
  input: {
    backgroundColor: Colors.WHITE,
    color: Colors.TEXT,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  empty: { color: Colors.TEXT_MUTED, padding: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  name: { color: Colors.TEXT, fontWeight: "700" },
  username: { color: Colors.TEXT_MUTED, fontSize: 12 },
});