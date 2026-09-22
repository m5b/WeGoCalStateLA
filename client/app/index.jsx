import React from 'react';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CalendarDays, HeartHandshake, MessageCircle, ShieldCheck, Users } from 'lucide-react-native';
import { Colors } from '../constant/Colors';

const pillars = [
  {
    icon: Users,
    title: 'Community connection',
    text: 'A welcoming place for the families and loved ones who support Cal State LA students.',
  },
  {
    icon: CalendarDays,
    title: 'Events and opportunities',
    text: 'Discover gatherings, workshops, and programs that help families stay informed and involved.',
  },
  {
    icon: HeartHandshake,
    title: 'Trusted resources',
    text: 'Find practical campus and community resources gathered in one easy-to-use place.',
  },
  {
    icon: MessageCircle,
    title: 'Supportive conversation',
    text: 'Share encouragement and experience through community discussions and replies.',
  },
];

export default function ProjectOverview() {
  return (
    <SafeAreaView style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <LinearGradient colors={[Colors.PRIMARY, '#111827']} style={styles.hero}>
          <Text style={styles.eyebrow}>PACIFIC CLINICS · CAL STATE LA COMMUNITY</Text>
          <Text style={styles.title}>WeGoToCalStateLA</Text>
          <Text style={styles.subtitle}>
            Helping families and loved ones connect, share support, and find resources for the Cal State LA journey.
          </Text>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Currently in community evaluation</Text>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>THE PROJECT</Text>
          <Text style={styles.sectionTitle}>Support for the people behind every student</Text>
          <Text style={styles.body}>
            WeGoToCalStateLA is a university initiative sponsored by Pacific Clinics and supported by private philanthropy. The project is exploring how a digital community can help families, caregivers, and trusted supporters feel connected to the university community and to one another.
          </Text>
          <Text style={styles.body}>
            The current application is an early prototype. Feedback from families, students, and community partners will shape what it becomes.
          </Text>
        </View>

        <View style={styles.grid}>
          {pillars.map(({ icon: Icon, title, text }) => (
            <View key={title} style={styles.card}>
              <View style={styles.iconWrap}><Icon size={24} color={Colors.PRIMARY} /></View>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardText}>{text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.notice}>
          <ShieldCheck size={26} color="#92400e" />
          <View style={styles.noticeCopy}>
            <Text style={styles.noticeTitle}>A privacy-conscious prototype</Text>
            <Text style={styles.noticeText}>
              The evaluation version does not provide clinical care or crisis response. Please do not submit private, identifying, or sensitive information while the prototype is being evaluated.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>WeGoToCalStateLA · Prototype overview</Text>
          {Platform.OS !== 'web' ? (
            <TouchableOpacity style={styles.mobilePreviewButton}>
              <Text style={styles.mobilePreviewText}>Evaluation access is provided separately</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#f8fafc' },
  content: { paddingBottom: 48 },
  hero: { paddingHorizontal: 24, paddingVertical: 80, alignItems: 'center' },
  eyebrow: { color: '#fbbf24', fontSize: 12, fontWeight: '800', letterSpacing: 1.8, textAlign: 'center' },
  title: { color: '#fff', fontSize: 48, fontWeight: '900', marginTop: 14, textAlign: 'center' },
  subtitle: { color: '#e5e7eb', fontSize: 20, lineHeight: 30, maxWidth: 760, textAlign: 'center', marginTop: 18 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10, marginTop: 28 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fbbf24' },
  statusText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  section: { width: '100%', maxWidth: 900, alignSelf: 'center', paddingHorizontal: 24, paddingTop: 64 },
  sectionLabel: { color: '#b45309', fontSize: 12, fontWeight: '800', letterSpacing: 1.5 },
  sectionTitle: { color: '#111827', fontSize: 34, lineHeight: 42, fontWeight: '850', marginTop: 10, marginBottom: 20 },
  body: { color: '#475569', fontSize: 17, lineHeight: 28, marginBottom: 14 },
  grid: { width: '100%', maxWidth: 1000, alignSelf: 'center', paddingHorizontal: 24, paddingTop: 36, flexDirection: 'row', flexWrap: 'wrap', gap: 18, justifyContent: 'center' },
  card: { backgroundColor: '#fff', width: 460, maxWidth: '100%', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', padding: 24 },
  iconWrap: { width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fef3c7', marginBottom: 16 },
  cardTitle: { color: '#111827', fontWeight: '800', fontSize: 18, marginBottom: 8 },
  cardText: { color: '#64748b', fontSize: 15, lineHeight: 23 },
  notice: { width: '100%', maxWidth: 950, alignSelf: 'center', marginTop: 48, marginHorizontal: 24, padding: 22, borderRadius: 14, backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fde68a', flexDirection: 'row', gap: 16 },
  noticeCopy: { flex: 1 },
  noticeTitle: { color: '#78350f', fontWeight: '800', fontSize: 16, marginBottom: 5 },
  noticeText: { color: '#92400e', fontSize: 14, lineHeight: 22 },
  footer: { alignItems: 'center', marginTop: 48, paddingHorizontal: 24 },
  footerText: { color: '#94a3b8', fontSize: 13 },
  mobilePreviewButton: { marginTop: 16, padding: 12 },
  mobilePreviewText: { color: '#64748b', fontSize: 13 },
});
