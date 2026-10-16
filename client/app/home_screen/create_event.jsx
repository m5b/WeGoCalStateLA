import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ImageIcon, Camera, Images, MapPin, Clock } from 'lucide-react-native';
import { Colors } from '../../constant/Colors';
import { createEvent, getEvent, updateEvent } from '../../services/events';
import DateTimeInput from '../../components/DateTimeInput';
import WebLayout from '../../components/WebLayout';

// The server returns times like "3:00 PM", but the web time picker's
// values are 24-hour "15:00".
function toPickerTime(time) {
  if (Platform.OS !== 'web') return time;
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time || '');
  if (!match) return time;
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === 'PM') hours += 12;
  return `${String(hours).padStart(2, '0')}:${match[2]}`;
}

// Opened with ?eventId=... from the event details screen -> edit mode.
export default function CreateEventScreen() {
  const { eventId } = useLocalSearchParams();
  const isEditing = !!eventId;
  const [existingImageUri, setExistingImageUri] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    getEvent(eventId)
      .then((event) => {
        setTitle(event.title || '');
        setDescription(event.description || '');
        setDate(event.date || '');
        setTime(toPickerTime(event.time || ''));
        setLocation(event.location || '');
        setImageUri(event.imageUri || null);
        setExistingImageUri(event.imageUri || null);
      })
      .catch((error) => {
        console.warn('Failed to load event for editing', error);
        Alert.alert('Error', 'Could not load this event.');
      });
  }, [eventId]);

  const goBack = () =>
    isEditing
      ? router.replace({ pathname: '/home_screen/details', params: { eventId } })
      : router.replace('/home_screen/events');

  async function pickFrom(kind) {
    try {
      if (kind === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Camera access is required.');
          return;
        }
        const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
        if (!result.canceled) setImageUri(result.assets[0]?.uri);
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
        if (!result.canceled) setImageUri(result.assets[0]?.uri);
      }
    } catch (_e) {
      Alert.alert('Error', 'Unable to open picker.');
    }
  }

  async function handleSubmit() {
    if (!title.trim()) {
      Alert.alert('Missing title', 'Please enter an event title.');
      return;
    }
    if (!date.trim() || !time.trim()) {
      Alert.alert('Missing info', 'Please enter a date and time.');
      return;
    }
    setLoading(true);
    if (isEditing) {
      try {
        await updateEvent(eventId, {
          title: title.trim(),
          description: description.trim(),
          imageUri,
          existingImageUri,
          date: date.trim(),
          time: time.trim(),
          location: location.trim(),
        });
        goBack();
      } catch (error) {
        console.error('Update event failed:', error);
        Alert.alert('Error', 'Failed to save changes.');
      } finally {
        setLoading(false);
      }
      return;
    }
    try {
      // The backend creates the linked community post automatically, so no
      // separate createThread call is needed here.
      await createEvent({
        title: title.trim(),
        description: description.trim(),
        imageUri,
        date: date.trim(),
        time: time.trim(),
        location: location.trim(),
      });



      router.replace('/home_screen/events');
    } catch (error) {
      console.error('Create event failed:', error);
      Alert.alert('Error', 'Failed to create event.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <WebLayout>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={goBack}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              {isEditing ? 'Edit Event' : 'Create Event'}
            </Text>

            <View style={{ width: 40 }} />
          </View>

          <View style={styles.card}>

            <TouchableOpacity style={styles.imagePlaceholder} onPress={() => pickFrom('library')} activeOpacity={0.8}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.coverImage} />
              ) : (
                <View style={styles.imagePlaceholderInner}>
                  <ImageIcon size={40} color={Colors.GRAY} />
                  <Text style={styles.imagePlaceholderText}>Add a cover image</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.pickerButton, styles.galleryButton]}
                onPress={() => pickFrom('library')}
              >
                <Images size={18} color={Colors.WHITE} />
                <Text style={styles.pickerButtonText}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.pickerButton, styles.cameraButton]}
                onPress={() => pickFrom('camera')}
              >
                <Camera size={18} color={Colors.BLACK} />
                <Text style={[styles.pickerButtonText, { color: Colors.BLACK }]}>
                  Camera
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Event Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter event title"
              placeholderTextColor={Colors.TEXT_MUTED}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              placeholder="What's this event about?"
              placeholderTextColor={Colors.TEXT_MUTED}
              value={description}
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
                onChangeText={setLocation}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {isEditing
                  ? loading ? 'Saving...' : 'Save Changes'
                  : loading ? 'Creating...' : 'Create Event'}
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </View>
    </WebLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.LIGHT_GRAY,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backText: {
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  headerTitle: {
    color: Colors.TEXT,
    fontSize: 20,
    fontWeight: '800',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    maxWidth: 760,
    alignSelf: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.BORDER,
    padding: 14,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
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
    backgroundColor: Colors.BRAND_GOLD,
  },
  pickerButtonText: {
    color: Colors.WHITE,
    fontWeight: '700',
    fontSize: 15,
  },
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
    backgroundColor: Colors.PRIMARY,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: Colors.WHITE,
    fontWeight: '700',
    fontSize: 16,
  },
});
