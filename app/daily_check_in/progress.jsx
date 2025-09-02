import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Calendar, Download, Share2 } from 'lucide-react-native';
import Colors from '../../constant/Colors';

const { width } = Dimensions.get('window');

// Mock data for visualizations
const mockMoodData = [
  { day: 'Mon', value: 4 },
  { day: 'Tue', value: 3 },
  { day: 'Wed', value: 5 },
  { day: 'Thu', value: 2 },
  { day: 'Fri', value: 4 },
  { day: 'Sat', value: 3 },
  { day: 'Sun', value: 4 },
];

const mockSleepData = [
  { day: 'Mon', value: 3 },
  { day: 'Tue', value: 4 },
  { day: 'Wed', value: 4 },
  { day: 'Thu', value: 2 },
  { day: 'Fri', value: 3 },
  { day: 'Sat', value: 5 },
  { day: 'Sun', value: 4 },
];

const mockStressData = [
  { day: 'Mon', value: 3 },
  { day: 'Tue', value: 2 },
  { day: 'Wed', value: 1 },
  { day: 'Thu', value: 4 },
  { day: 'Fri', value: 3 },
  { day: 'Sat', value: 2 },
  { day: 'Sun', value: 2 },
];

export default function ProgressScreen() {
  const [timeRange, setTimeRange] = React.useState('week'); // 'week', 'month', 'year'

  const getBarColor = (value, isStress = false) => {
    if (isStress) {
      // For stress, lower is better
      if (value === 1) return Colors.SUCCESS;
      if (value === 2) return Colors.INFO;
      if (value === 3) return Colors.SECONDARY;
      if (value === 4) return Colors.WARNING;
      return Colors.ERROR;
    } else {
      // For mood and sleep, higher is better
      if (value === 5) return Colors.SUCCESS;
      if (value === 4) return Colors.INFO;
      if (value === 3) return Colors.SECONDARY;
      if (value === 2) return Colors.WARNING;
      return Colors.ERROR;
    }
  };

  const renderBarChart = (data, title, isStress = false) => {
    const maxValue = 5; // Maximum value for our scales
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>{title}</Text>
        <View style={styles.chartContent}>
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * 120; // 120 is the max height of our bars
            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barLabelContainer}>
                  <Text style={styles.barValue}>{item.value}</Text>
                </View>
                <View style={styles.barWrapper}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: barHeight, 
                        backgroundColor: getBarColor(item.value, isStress) 
                      }
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{item.day}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.PRIMARY, Colors.DARK_BLUE]}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={Colors.WHITE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Progress</Text>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.contentPadding}>
          {/* Time Range Selector */}
          <View style={styles.timeRangeContainer}>
            <TouchableOpacity 
              style={[styles.timeRangeButton, timeRange === 'week' && styles.activeTimeRange]}
              onPress={() => setTimeRange('week')}
            >
              <Text style={[styles.timeRangeText, timeRange === 'week' && styles.activeTimeRangeText]}>Week</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.timeRangeButton, timeRange === 'month' && styles.activeTimeRange]}
              onPress={() => setTimeRange('month')}
            >
              <Text style={[styles.timeRangeText, timeRange === 'month' && styles.activeTimeRangeText]}>Month</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.timeRangeButton, timeRange === 'year' && styles.activeTimeRange]}
              onPress={() => setTimeRange('year')}
            >
              <Text style={[styles.timeRangeText, timeRange === 'year' && styles.activeTimeRangeText]}>Year</Text>
            </TouchableOpacity>
          </View>

          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Weekly Summary</Text>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Average Mood</Text>
                <Text style={[styles.summaryValue, { color: Colors.INFO }]}>3.6/5</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Sleep Quality</Text>
                <Text style={[styles.summaryValue, { color: Colors.INFO }]}>3.6/5</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Stress Level</Text>
                <Text style={[styles.summaryValue, { color: Colors.INFO }]}>2.4/5</Text>
              </View>
            </View>
          </View>

          {/* Charts */}
          <View style={styles.chartsContainer}>
            {renderBarChart(mockMoodData, 'Mood')}
            {renderBarChart(mockSleepData, 'Sleep Quality')}
            {renderBarChart(mockStressData, 'Stress Level', true)}
          </View>

          {/* Insights */}
          <View style={styles.insightsCard}>
            <Text style={styles.insightsTitle}>Insights</Text>
            <View style={styles.insightItem}>
              <View style={[styles.insightBullet, { backgroundColor: Colors.SUCCESS }]} />
              <Text style={styles.insightText}>Your mood was highest on Wednesday this week.</Text>
            </View>
            <View style={styles.insightItem}>
              <View style={[styles.insightBullet, { backgroundColor: Colors.WARNING }]} />
              <Text style={styles.insightText}>Your stress level peaked on Thursday.</Text>
            </View>
            <View style={styles.insightItem}>
              <View style={[styles.insightBullet, { backgroundColor: Colors.INFO }]} />
              <Text style={styles.insightText}>Your sleep quality has been improving over the weekend.</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={[Colors.PRIMARY, Colors.DARK_BLUE]}
                style={styles.actionGradient}
              >
                <Calendar size={20} color={Colors.WHITE} />
                <Text style={styles.actionText}>View Calendar</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <View style={styles.actionRow}>
              <TouchableOpacity style={[styles.actionButton, styles.halfButton]}>
                <LinearGradient
                  colors={[Colors.SECONDARY, Colors.DARK_GOLD]}
                  style={styles.actionGradient}
                >
                  <Download size={20} color={Colors.WHITE} />
                  <Text style={styles.actionText}>Export Data</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.actionButton, styles.halfButton]}>
                <LinearGradient
                  colors={[Colors.INFO, Colors.INFO_DARK]}
                  style={styles.actionGradient}
                >
                  <Share2 size={20} color={Colors.WHITE} />
                  <Text style={styles.actionText}>Share Report</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.WHITE,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 20,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTimeRange: {
    backgroundColor: Colors.PRIMARY,
  },
  timeRangeText: {
    fontSize: 16,
    color: Colors.TEXT,
    fontWeight: '500',
  },
  activeTimeRangeText: {
    color: Colors.WHITE,
  },
  summaryCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.TEXT,
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.TEXT_SECONDARY,
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chartsContainer: {
    marginBottom: 20,
  },
  chartContainer: {
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.TEXT,
    marginBottom: 15,
  },
  chartContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
  },
  barContainer: {
    alignItems: 'center',
    width: (width - 80) / 7, // Divide available width by number of bars
  },
  barLabelContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  barValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.TEXT_SECONDARY,
  },
  barWrapper: {
    height: 120,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 20,
    borderRadius: 10,
  },
  barLabel: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.TEXT_SECONDARY,
  },
  insightsCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.TEXT,
    marginBottom: 15,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  insightBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 7,
    marginRight: 10,
  },
  insightText: {
    flex: 1,
    fontSize: 16,
    color: Colors.TEXT,
    lineHeight: 22,
  },
  actionsContainer: {
    marginBottom: 20,
  },
  actionButton: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfButton: {
    flex: 0.48,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  actionText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});