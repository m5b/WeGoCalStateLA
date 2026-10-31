import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CalendarDays, Clock, Lock, MapPin, MessageCircle } from "lucide-react-native";
import WebLayout from "../../components/WebLayout";
import ReplyImagePicker from "../../components/ReplyImagePicker";
import FlexibleImage from "../../components/FlexibleImage";
import ReplyNode from "../../components/ReplyNode";
import { addReplyToTree, removeReplyFromTree, updateReplyInTree } from "../../utils/replyTree";
import { Colors } from "../../constant/Colors";
import { getEvent, deleteEvent } from "../../services/events";
import { createReply, deleteReply, getThreadByEventId, toggleReplyLike } from "../../services/threads";
import { confirmAction } from "../../utils/confirmAction";
import { useAuth } from "../../context/AuthContext";
import { canManage } from "../../utils/permissions";
import { formatEventDate } from "../../utils/formatEventDate";
import { replyErrorMessage } from "../../utils/replyError";

const EVENT_CARD_BACKGROUND = '#fff8d6';
const EVENT_TEXT_COLOR = '#000000';

function getEventTitle(event) {
  return (event.title || event.caption || event.text || "Event").trim();
}

export default function EventDetails() {
  const { eventId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [thread, setThread] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyImage, setReplyImage] = useState(null);
  const [replyError, setReplyError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvent() {
      try {
        const [found, eventThread] = await Promise.all([
          getEvent(eventId),
          getThreadByEventId(eventId),
        ]);
        setEvent(found ?? null);
        setThread(eventThread);
      } catch (error) {
        console.warn("Failed to load event detail", error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [eventId]);

  if (loading) {
    return (
      <WebLayout>
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.PRIMARY} />
        </View>
      </WebLayout>
    );
  }

  if (!event) {
    return (
      <WebLayout>
        <View style={styles.centered}>
          <Text style={styles.notFoundText}>Event not found.</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push("/home_screen/events")}
          >
            <Text style={styles.backButtonText}>Back to Events</Text>
          </TouchableOpacity>
        </View>
      </WebLayout>
    );
  }

  const submitReply = async () => {
    const text = replyText.trim();
    if ((!text && !replyImage) || !thread) return;
    setReplyError("");
    try {
      const reply = await createReply(thread.id, { text, imageUri: replyImage });
      setThread((current) => ({
        ...current,
        replies: addReplyToTree(current.replies ?? [], reply, null),
      }));
      setReplyText("");
      setReplyImage(null);
    } catch (error) {
      console.warn("Failed to post reply", error);
      setReplyError(replyErrorMessage(error));
    }
  };

  // Posts a reply under another reply.
  const replyTo = async (parent, text) => {
    const reply = await createReply(thread.id, { text, parentId: parent.id });
    setThread((current) => ({
      ...current,
      replies: addReplyToTree(current.replies ?? [], reply, parent.id),
    }));
  };

  // Liking needs an account, so signed-out visitors are sent to log in.
  const likeReply = async (reply) => {
    try {
      const { liked, likeCount } = await toggleReplyLike(reply.id);
      setThread((current) => ({
        ...current,
        replies: updateReplyInTree(current.replies ?? [], reply.id, { likes: likeCount, likedByMe: liked }),
      }));
    } catch (error) {
      if (error?.status === 401) router.push("/authentication/login");
    }
  };

  const confirmDeleteEvent = () =>
    confirmAction({
      title: "Delete event",
      message: "Delete this event and its discussion? This can't be undone.",
      onConfirm: async () => {
        try {
          await deleteEvent(event.id);
          router.replace("/home_screen/events");
        } catch (error) {
          console.warn("Failed to delete event", error);
        }
      },
    });

  const confirmDeleteReply = (replyId) =>
    confirmAction({
      title: "Delete reply",
      message: "Delete this reply? This can't be undone.",
      onConfirm: async () => {
        try {
          await deleteReply(thread.id, replyId);
          setThread((current) => ({
            ...current,
            replies: removeReplyFromTree(current.replies ?? [], replyId),
          }));
        } catch (error) {
          console.warn("Failed to delete reply", error);
        }
      },
    });

  // Edit and delete: the person who created the event, or an admin.
  const canManageEvent = canManage(user, event.authorUuid);
  const title = getEventTitle(event);
  const description = event.description || (event.text && event.text !== title ? event.text : "");

  // Private events come back locked (details stripped) for signed-out
  // visitors, so they get the sign-in prompt over the page instead.
  return (
    <WebLayout requireSignIn={event.locked ? "events" : undefined}>
      <View style={styles.screen}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backText}>{"\u2190"} Back to Events</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Event Details</Text>
          {canManageEvent ? (
            <View style={{ width: 72, alignItems: "flex-end" }}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/home_screen/create_event",
                    params: { eventId: event.id },
                  })
                }
              >
                <Text style={styles.backText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmDeleteEvent}>
                <Text style={styles.deleteEventText}>Delete</Text>
              </TouchableOpacity>
            </View>
           ) : (
            <View style={{ width: 72 }} />
          )}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.eventCard}>
            {event.imageUri ? (
              <FlexibleImage uri={event.imageUri} style={styles.heroImage} maxHeight={640} />
            ) : null}

            <View style={styles.eventBody}>
              {!event.isPublic ? (
                <View style={styles.privateBadge}>
                  <Lock size={12} color={Colors.WHITE} />
                  <Text style={styles.privateBadgeText}>Private event</Text>
                </View>
              ) : null}
              <Text style={styles.eventTitle}>{title}</Text>
              {event.author ? (
                <Text style={styles.postedBy}>Posted by {event.author}</Text>
              ) : null}

              <View style={styles.metaGrid}>
                {event.date ? (
                  <View style={styles.metaItem}>
                    <CalendarDays size={18} color={EVENT_TEXT_COLOR} />
                    <Text style={styles.metaText}>{formatEventDate(event.date)}</Text>
                  </View>
                ) : null}

                {event.time ? (
                  <View style={styles.metaItem}>
                    <Clock size={18} color={EVENT_TEXT_COLOR} />
                    <Text style={styles.metaText}>{event.time}</Text>
                  </View>
                ) : null}

                {event.location ? (
                  <View style={styles.metaItem}>
                    <MapPin size={18} color={EVENT_TEXT_COLOR} />
                    <Text style={styles.metaText}>{event.location}</Text>
                  </View>
                ) : null}
              </View>

              {description ? (
                <View style={styles.descriptionBlock}>
                  <Text style={styles.sectionLabel}>About this event</Text>
                  <Text style={styles.description}>{description}</Text>
                </View>
              ) : null}
            </View>
          </View>

          {thread ? (
            <View style={styles.discussionCard}>
              <View style={styles.discussionHeader}>
                <View style={styles.discussionTitleRow}>
                  <MessageCircle size={18} color={Colors.TEXT} />
                  <Text style={styles.discussionTitle}>Discussion</Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/threads/detail",
                      params: { threadId: thread.id },
                    })
                  }
                >
                  <Text style={styles.discussionLink}>View in Community</Text>
                </TouchableOpacity>
              </View>

              {(thread.replies ?? []).length === 0 ? (
                <Text style={styles.emptyReplies}>
                  No replies yet. Start the conversation!
                </Text>
              ) : (
                thread.replies.map((reply) => (
                  <ReplyNode
                    key={String(reply.id)}
                    reply={reply}
                    user={user}
                    inset={0}
                    cardColor={Colors.LIGHT_GRAY}
                    onLike={likeReply}
                    onReply={replyTo}
                    onDelete={(r) => confirmDeleteReply(r.id)}
                  />
                ))
              )}

              <View style={styles.replyBox}>
                {replyError ? <Text style={styles.replyError}>{replyError}</Text> : null}
                <ReplyImagePicker imageUri={replyImage} onChange={setReplyImage} />
                <TextInput
                  placeholder="Write a reply..."
                  placeholderTextColor={Colors.TEXT_MUTED}
                  value={replyText}
                  onChangeText={setReplyText}
                  onSubmitEditing={submitReply}
                  style={styles.replyInput}
                />
                <TouchableOpacity style={styles.replyButton} onPress={submitReply}>
                  <Text style={styles.replyButtonText}>Reply</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </ScrollView>
      </View>
    </WebLayout>
  );
}

const styles = StyleSheet.create({
  privateBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: Colors.BLACK,
  },
  privateBadgeText: {
    color: Colors.WHITE,
    fontSize: 12,
    fontWeight: "700",
  },
  screen: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.LIGHT_GRAY,
    gap: 14,
  },
  notFoundText: {
    color: Colors.TEXT,
    fontSize: 18,
    fontWeight: "700",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  backText: {
    color: Colors.PRIMARY,
    fontWeight: "700",
  },
  screenTitle: {
    color: Colors.TEXT,
    fontSize: 20,
    fontWeight: "800",
  },
  content: {
    width: "100%",
    maxWidth: 860,
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  eventCard: {
    backgroundColor: EVENT_CARD_BACKGROUND,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    overflow: "hidden",
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
  },
  heroImage: {
    width: "100%",
    backgroundColor: Colors.GRAY_200,
  },
  eventBody: {
    padding: 22,
  },
  eventTitle: {
    color: EVENT_TEXT_COLOR,
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 16,
  },
  postedBy: {
    color: EVENT_TEXT_COLOR,
    opacity: 0.7,
    fontSize: 13,
    marginBottom: 16,
  },
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: EVENT_CARD_BACKGROUND,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  metaText: {
    color: EVENT_TEXT_COLOR,
    fontSize: 14,
    fontWeight: "600",
  },
  descriptionBlock: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.BORDER,
    paddingTop: 20,
  },
  sectionLabel: {
    color: Colors.TEXT_SECONDARY,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  description: {
    color: EVENT_TEXT_COLOR,
    fontSize: 16,
    lineHeight: 24,
  },
  discussionCard: {
    marginTop: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    padding: 18,
  },
  discussionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  discussionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  discussionTitle: {
    color: Colors.TEXT,
    fontSize: 18,
    fontWeight: "800",
  },
  discussionLink: {
    color: Colors.PRIMARY,
    fontWeight: "700",
  },
  emptyReplies: {
    color: Colors.TEXT_SECONDARY,
    fontSize: 14,
    marginBottom: 12,
  },
  replyCard: {
    marginBottom: 10,
    padding: 12,
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  replyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteEventText: {
    color: Colors.ERROR,
    fontWeight: "700",
    marginTop: 4,
  },
  replyDelete: {
    color: Colors.ERROR,
    fontSize: 12,
    fontWeight: "600",
  },
  replyAuthor: {
    color: Colors.TEXT,
    fontWeight: "700",
  },
  replyImage: {
    width: "100%",
    maxWidth: 300,
    alignSelf: "flex-start",
    borderRadius: 10,
    marginTop: 8,
    backgroundColor: Colors.GRAY_200,
  },
  replyError: {
    color: Colors.ERROR,
    fontSize: 12,
  },
  replyText: {
    color: Colors.TEXT,
    marginTop: 4,
  },
  replyBox: {
    marginTop: 6,
    gap: 10,
  },
  replyInput: {
    backgroundColor: Colors.WHITE,
    color: Colors.TEXT,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  replyButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  replyButtonText: {
    color: Colors.WHITE,
    fontWeight: "700",
  },
  backButton: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backButtonText: {
    color: Colors.WHITE,
    fontWeight: "700",
  },
});
