import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Fonts } from '../theme/tokens';
import { BottomNavBar, TabType } from '../components/BottomNavBar';

interface PassScreenProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenRedeem: (cafeName?: string) => void;
}

export const PassScreen: React.FC<PassScreenProps> = ({ onNavigateTab, onOpenRedeem }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isUpgraded, setIsUpgraded] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Sip Pass</Text>
          <View style={[styles.activeBadge, isPaused && styles.pausedBadge]}>
            <Text style={[styles.activeBadgeText, isPaused && styles.pausedBadgeText]}>
              {isPaused ? 'Paused' : 'Active'}
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Plan Card */}
          <View style={styles.planCard}>
            <View style={styles.planHeaderRow}>
              <View>
                <Text style={styles.planSubtitle}>Monthly Plan</Text>
                <Text style={styles.planTitle}>
                  {isUpgraded ? 'Sip Pass Plus' : 'Daily Sip Pass'}
                </Text>
              </View>
              <Text style={styles.planPrice}>
                {isUpgraded ? '₹1,399/mo' : '₹999/mo'}
              </Text>
            </View>

            {/* Coffees Left Meter */}
            <View style={styles.meterContainer}>
              <View style={styles.meterTopRow}>
                <Text style={styles.meterLabel}>Coffees left this month</Text>
                <Text style={styles.meterCount}>18 / 30</Text>
              </View>
              {/* Progress bar */}
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: '60%' }]} />
              </View>
              <Text style={styles.meterSavings}>
                12 cups redeemed · Saved ₹2,140 this month
              </Text>
            </View>

            {/* Renews row */}
            <View style={styles.planFooterRow}>
              <Text style={styles.renewText}>Renews on 22 Dec 2026</Text>
              <Text style={styles.paymentMethod}>UPI AutoPay</Text>
            </View>
          </View>

          {/* Quick Redeem CTA Button */}
          <TouchableOpacity
            style={styles.redeemFloatingBtn}
            onPress={() => onOpenRedeem('Daily Pass')}
            activeOpacity={0.88}
          >
            <Ionicons name="qr-code-outline" size={20} color={Colors.onHoneyOat} />
            <Text style={styles.redeemFloatingBtnText}>Redeem today's cup</Text>
          </TouchableOpacity>

          {/* Manage Pass Section */}
          <View style={styles.manageSection}>
            <Text style={styles.sectionTitle}>Manage your pass</Text>

            {/* Upgrade Card */}
            <View style={styles.manageCard}>
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>Popular upgrade</Text>
              </View>
              <Text style={styles.upgradeTitle}>Sip Pass Plus · ₹1,399/mo</Text>
              <Text style={styles.upgradeDesc}>
                Includes specialty cold brews, oat milk upgrades & 2 guest passes/month.
              </Text>
              <TouchableOpacity
                style={[styles.primaryButton, isUpgraded && styles.disabledButton]}
                onPress={() => setIsUpgraded(!isUpgraded)}
                activeOpacity={0.88}
              >
                <Text style={styles.primaryButtonText}>
                  {isUpgraded ? 'Current Plan' : 'Upgrade to Plus'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Pause Card */}
            <View style={styles.pauseCard}>
              <View style={styles.pauseTextCol}>
                <Text style={styles.pauseTitle}>Going out of town?</Text>
                <Text style={styles.pauseDesc}>Pause your pass for up to 14 days anytime.</Text>
              </View>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setIsPaused(!isPaused)}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryButtonText}>
                  {isPaused ? 'Resume pass' : 'Pause pass'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <BottomNavBar activeTab="pass" onTabPress={onNavigateTab} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.pageMargin,
    paddingTop: Spacing.gutterLg,
    paddingBottom: Spacing.gutterMd,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.onSurface,
    fontFamily: Fonts.display,
  },
  activeBadge: {
    paddingHorizontal: Spacing.gutterMd,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.successContainer,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.onSuccessContainer,
    fontFamily: Fonts.label,
  },
  pausedBadge: {
    backgroundColor: Colors.surfaceContainerLow,
  },
  pausedBadgeText: {
    color: Colors.onSurfaceVariant,
  },
  scrollContent: {
    paddingHorizontal: Spacing.pageMargin,
    paddingBottom: 110,
    gap: Spacing.gutterLg,
  },
  planCard: {
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primary,
    padding: Spacing.gutterXl,
    gap: Spacing.gutterLg,
  },
  planHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  planSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.onPrimaryContainer,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontFamily: Fonts.label,
  },
  planTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.onPrimary,
    fontFamily: Fonts.headline,
    marginTop: 2,
  },
  planPrice: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.onPrimary,
    fontFamily: Fonts.title,
  },
  meterContainer: {
    borderRadius: BorderRadius.default,
    backgroundColor: Colors.primaryContainer,
    padding: Spacing.gutterLg,
    gap: Spacing.gutterSm,
  },
  meterTopRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  meterLabel: {
    fontSize: 14,
    color: Colors.onPrimary,
    fontFamily: Fonts.body,
  },
  meterCount: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.onPrimary,
    fontFamily: Fonts.headline,
  },
  progressBarTrack: {
    width: '100%',
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: Colors.honeyOat,
  },
  meterSavings: {
    fontSize: 12,
    color: Colors.onPrimaryContainer,
    fontFamily: Fonts.body,
    marginTop: 2,
  },
  planFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  renewText: {
    fontSize: 12,
    color: Colors.onPrimaryContainer,
    fontFamily: Fonts.body,
  },
  paymentMethod: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.onPrimary,
    fontFamily: Fonts.label,
  },
  redeemFloatingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.gutterSm,
    minHeight: 50,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.honeyOat,
    shadowColor: Colors.espresso,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  redeemFloatingBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.onHoneyOat,
    fontFamily: Fonts.label,
  },
  manageSection: {
    gap: Spacing.gutterMd,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.onSurface,
    fontFamily: Fonts.title,
  },
  manageCard: {
    borderRadius: BorderRadius.default,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    padding: Spacing.gutterLg,
    gap: Spacing.gutterMd,
  },
  popularBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.gutterSm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainerLow,
  },
  popularBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.secondary,
    fontFamily: Fonts.label,
  },
  upgradeTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.onSurface,
    fontFamily: Fonts.title,
  },
  upgradeDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.onSurfaceVariant,
    fontFamily: Fonts.body,
  },
  primaryButton: {
    minHeight: 46,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.surfaceContainerHigh,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.onPrimary,
    fontFamily: Fonts.label,
  },
  pauseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.gutterMd,
    borderRadius: BorderRadius.default,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    padding: Spacing.gutterLg,
  },
  pauseTextCol: {
    flex: 1,
    gap: 2,
  },
  pauseTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.onSurface,
    fontFamily: Fonts.title,
  },
  pauseDesc: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    fontFamily: Fonts.body,
  },
  secondaryButton: {
    minHeight: 42,
    paddingHorizontal: Spacing.gutterLg,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
    fontFamily: Fonts.label,
  },
});
