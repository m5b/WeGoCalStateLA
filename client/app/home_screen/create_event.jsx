import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { ImageIcon, ArrowLeft, Camera, Images, MapPin, Clock } from 'lucide-react-native';
import { Colors } from '../../constant/Colors';
import { createEvent } from '../../services/events';
import { createThread } from '../../services/threads';
import DateTimeInput from '../../components/DateTimeInput';
import { extractEventFromFlyer } from '../../services/ai';
import usePastedImage from '../../hooks/usePastedImage';

export default function CreateEventScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageAsset, setImageAsset] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [aiNotice, setAiNotice] = useState(null);
  const [pendingExtraction, setPendingExtraction] = useState(null);
  const extractionInFlight = useRef(false);
  const mounted = useRef(true);
  const isBusy = loading || isExtracting || Boolean(pendingExtraction);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const cancelPendingPaste = usePastedImage({
    disabled: isBusy,
    onImage: (asset) => {
      if (!extractionInFlight.current && !loading && !pendingExtraction) selectImage(asset);
    },
    onError: (text) => setAiNotice({ kind: 'error', text }),
  });

  function selectImage(asset) {
    if (!asset?.uri) return;
    cancelPendingPaste();
    setImageUri(asset.uri);
    setImageAsset(asset);
    setAiNotice(null);
    setPendingExtraction(null);
  }

  function applyExtraction(result) {
    for (const [field, setter] of [
      ['title', setTitle], ['description', setDescription], ['date', setDate],
      ['time', setTime], ['location', setLocation],
    ]) {
      if (result[field].trim()) setter(result[field].trim());
    }
    const reason = result.eventStatusReason.trim();
    if (result.eventStatus === 'likely_event') {
      setAiNotice({ kind: 'info', text: 'Event details extracted. Please review them before creating the event.' });
    } else {
      const message = result.eventStatus === 'not_event'
        ? 'You chose to review an image that may not be an event flyer.'
        : 'This image may not be an event flyer.';
      setAiNotice({ kind: 'warning', text: [message, reason, 'Verify all extracted information before creating the event.'].filter(Boolean).join(' ') });
    }
  }

  async function handleAutofill() {
    // A ref guards repeated taps before React has rendered the loading state.
    if (extractionInFlight.current || loading || pendingExtraction || !imageUri) return;
    extractionInFlight.current = true;
    setIsExtracting(true);
    setAiNotice(null);
    try {
      const result = await extractEventFromFlyer(imageUri, imageAsset || {});
      if (!mounted.current) return;
      if (result.eventStatus === 'not_event') {
        setPendingExtraction(result);
      } else {
        applyExtraction(result);
      }
    } catch (error) {
      if (mounted.current) {
        setAiNotice({ kind: 'error', text: error.status === 401
          ? 'Your session expired. Please sign in and try again.'
          : (error.message || 'Unable to read this flyer. Please try again.') });
      }
    } finally {
      extractionInFlight.current = false;
      if (mounted.current) setIsExtracting(false);
    }
  }


  async function pickFrom(kind) {
    if (extractionInFlight.current || loading) return;
    try {
      if (kind === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Camera access is required.');
          return;
        }
        const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
        if (!result.canceled) selectImage(result.assets[0]);
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Photo library access is required.');
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 0.8,
        });
        if (!result.canceled) selectImage(result.assets[0]);
      }
    } catch (_e) {
      Alert.alert('Error', 'Unable to open picker.');
      setAiNotice({ kind: 'error', text: 'Unable to open the image picker. Please try again.' });
    }
  }

  async function handleSubmit() {
    if (extractionInFlight.current || loading || pendingExtraction) return;
    if (!title.trim()) {
      Alert.alert('Missing title', 'Please enter an event title.');
      return;
    }
    if (!date.trim() || !time.trim()) {
      Alert.alert('Missing info', 'Please enter a date and time.');
      return;
    }
    setLoading(true);
    try {
      const createdEvent = await createEvent({
        title: title.trim(),
        description: description.trim(),
        imageUri,
        date: date.trim(),
        time: time.trim(),
        location: location.trim(),
        createdAt: Date.now(),
      });

      await createThread({
        caption: `${createdEvent.title} — Event Discussion`,
        imageUri: createdEvent.imageUri,
        date: createdEvent.date,
        time: createdEvent.time,
        location: createdEvent.location,
        eventId: createdEvent.id,
        type: 'event',
        createdAt: Date.now(),
      });

      router.replace('/home_screen/events');
    } catch (_e) {
      Alert.alert('Error', 'Failed to create event.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={[Colors.PRIMARY, Colors.DARK_BLUE]} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.replace('/home_screen/events')} style={styles.backButton}>
            <ArrowLeft size={24} color={Colors.SECONDARY} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Event</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>

          <TouchableOpacity disabled={isBusy} style={styles.imagePlaceholder} onPress={() => pickFrom('library')} activeOpacity={0.8}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.coverImage} resizeMode="contain" />
            ) : (
              <View style={styles.imagePlaceholderInner}>
                <ImageIcon size={40} color={Colors.GRAY} />
                <Text style={styles.imagePlaceholderText}>Add a cover image</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.row}>
            <TouchableOpacity disabled={isBusy} accessibilityRole="button" style={[styles.pickerButton, styles.galleryButton, isBusy && styles.submitButtonDisabled]} onPress={() => pickFrom('library')}>
              <Images size={18} color={Colors.SECONDARY} />
              <Text style={styles.pickerButtonText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity disabled={isBusy} accessibilityRole="button" style={[styles.pickerButton, styles.cameraButton, isBusy && styles.submitButtonDisabled]} onPress={() => pickFrom('camera')}>
              <Camera size={18} color={Colors.SECONDARY} />
              <Text style={styles.pickerButtonText}>Camera</Text>
            </TouchableOpacity>
          </View>

          {Platform.OS === 'web' && (
            <Text style={styles.autofillHint}>You can also paste an image with Ctrl+V</Text>
          )}

          <TouchableOpacity
            accessibilityRole="button" accessibilityState={{ disabled: !imageUri || isBusy, busy: isExtracting }}
            style={[styles.autofillButton, (!imageUri || isBusy) && styles.submitButtonDisabled]}
            onPress={handleAutofill} disabled={!imageUri || isBusy}>
            <Text style={styles.autofillButtonText}>{isExtracting ? 'Reading flyer...' : 'Autofill from Flyer'}</Text>
          </TouchableOpacity>
          {!imageUri && <Text style={styles.autofillHint}>Select a flyer with Gallery or Camera to autofill details.</Text>}
          {aiNotice && (
            <View style={[styles.notice, aiNotice.kind === 'warning' && styles.warningNotice, aiNotice.kind === 'error' && styles.errorNotice]}>
              <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.noticeText}>{aiNotice.text}</Text>
            </View>
          )}

          <Text style={styles.label}>Event Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter event title"
            placeholderTextColor={Colors.TEXT_MUTED}
            value={title}
            editable={!isBusy}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="What's this event about?"
            placeholderTextColor={Colors.TEXT_MUTED}
            value={description}
            editable={!isBusy}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Date</Text>
              <View style={styles.iconInput}>
                
                <DateTimeInput
                        type="date"
                        value={date}
                        onChange={setDate}
                        disabled={isBusy}
                        />
              </View>
            </View>
            <View style={{ width: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Time</Text>
              <View style={styles.iconInput}>
                <Clock size={16} color={Colors.TEXT_MUTED} style={styles.inputIcon} />
                <DateTimeInput
                      type="time"
                      value={time}
                      onChange={setTime}
                      disabled={isBusy}
                      />
              </View>
            </View>
          </View>

          <Text style={styles.label}>Location</Text>
          <View style={styles.iconInput}>
            <MapPin size={16} color={Colors.TEXT_MUTED} style={styles.inputIcon} />
            <TextInput
              style={styles.iconInputField}
              placeholder="Enter location"
              placeholderTextColor={Colors.TEXT_MUTED}
              value={location}
              editable={!isBusy}
              onChangeText={setLocation}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isBusy && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isBusy}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Creating...' : 'Create Event'}
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
      <Modal visible={Boolean(pendingExtraction)} transparent animationType="fade"
        onRequestClose={() => {
          setPendingExtraction(null);
          setAiNotice({ kind: 'warning', text: 'Autofill was not applied. Choose another image or enter the event details manually.' });
        }}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard} accessibilityViewIsModal>
            <Text accessibilityRole="header" style={styles.modalTitle}>This may not be an event flyer</Text>
            <Text style={styles.modalText}>{pendingExtraction?.eventStatusReason || 'The image does not show clear event information.'}</Text>
            <Text style={styles.modalText}>No details have been applied yet. You can review any extracted information and edit it yourself, or choose another image.</Text>
            <TouchableOpacity accessibilityRole="button" style={styles.autofillButton} onPress={() => {
              applyExtraction(pendingExtraction);
              setPendingExtraction(null);
            }}><Text style={styles.autofillButtonText}>Review Anyway</Text></TouchableOpacity>
            <TouchableOpacity accessibilityRole="button" style={styles.chooseImageButton} onPress={() => {
              setPendingExtraction(null);
              setAiNotice({ kind: 'warning', text: 'Choose another flyer image to try autofill again.' });
              pickFrom('library');
            }}><Text style={styles.chooseImageText}>Choose Another Image</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.SECONDARY + '20',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.SECONDARY,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderStyle: 'dashed',
  },
  imagePlaceholder: {
    width: '100%',
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: Colors.GRAY_200,
    overflow: 'hidden',
    marginBottom: 12,
  },
  imagePlaceholderInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  imagePlaceholderText: {
    color: Colors.GRAY,
    fontSize: 14,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  pickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 999,
    gap: 8,
    marginBottom: 16,
  },
  galleryButton: {
    backgroundColor: Colors.PRIMARY,
  },
  cameraButton: {
    backgroundColor: Colors.WARNING,
  },
  pickerButtonText: {
    color: Colors.SECONDARY,
    fontWeight: '700',
    fontSize: 15,
  },
  autofillButton: { backgroundColor: Colors.PRIMARY, borderRadius: 12, padding: 14, alignItems: 'center', marginBottom: 12 },
  autofillButtonText: { color: Colors.WHITE, fontWeight: '700', fontSize: 15 },
  autofillHint: { color: Colors.TEXT_MUTED, fontSize: 13, marginBottom: 12 },
  notice: { backgroundColor: Colors.INFO_LIGHT, borderRadius: 10, padding: 12, marginBottom: 12 },
  warningNotice: { backgroundColor: Colors.WARNING_LIGHT },
  errorNotice: { backgroundColor: Colors.ERROR_LIGHT },
  noticeText: { color: Colors.TEXT, fontSize: 14, lineHeight: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalCard: { backgroundColor: Colors.WHITE, borderRadius: 16, padding: 24, width: '100%', maxWidth: 460 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: Colors.TEXT, marginBottom: 12 },
  modalText: { fontSize: 14, lineHeight: 21, color: Colors.TEXT_SECONDARY, marginBottom: 16 },
  chooseImageButton: { padding: 12, alignItems: 'center' },
  chooseImageText: { color: Colors.TEXT, fontWeight: '600', fontSize: 15 },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.TEXT,
    marginBottom: 6,
    marginTop: 4,
  },
  input: {
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: Colors.TEXT,
    marginBottom: 12,
  },
  inputMultiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  iconInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  iconInputField: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.TEXT,
  },
  submitButton: {
    backgroundColor: Colors.SECONDARY,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: Colors.PRIMARY,
    fontWeight: '700',
    fontSize: 16,
  },
});
