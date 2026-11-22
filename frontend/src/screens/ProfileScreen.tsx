import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Fonts } from '../theme/tokens';
import { BottomNavBar, TabType } from '../components/BottomNavBar';
import { MOCK_USER } from '../data/mockData';

interface ProfileScreenProps {
  onNavigateTab: (tab: TabType) => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigateTab, onLogout }) => {
  const [inviteCopied, setInviteCopied] = useState(false);

  const handleShareInvite = async () => {
    try {
      setInviteCopied(true);
      await Share.share({
        message:
          'Get 7 free coffees on Sip Pass with my code AARAV-SIP7! Download Sip Pass: https://sippass.app',
      });
      setTimeout(() => setInviteCopied(false), 3000);
    } catch {
      setInviteCopied(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image source={{ uri: MOCK_USER.avatar }} style={styles.profileAvatar} />
          <View style={styles.profileInfoCol}>
            <Text style={styles.profileName}>Aarav Mehta</Text>
            <Text style={styles.profileMeta}>Bengaluru · Member since Aug 2026</Text>
          </View>
          <TouchableOpacity onPress={onLogout} style={styles.logoutBtn} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={20} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Stats Grid: Cafes Visited & Streak */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="storefront" size={24} color={Colors.secondary} />
              <Text style={styles.statNumber}>14</Text>
              <Text style={styles.statLabel}>Cafes visited</Text>
            </View>

            <View style={styles.statCard}>
              <Ionicons name="flame" size={26} color={Colors.secondary} />
              <Text style={styles.statNumber}>5 days</Text>
              <Text style={styles.statLabel}>Current streak</Text>
            </View>
          </View>

          {/* Monthly Challenge Card */}
          <View style={styles.challengeCard}>
            <View style={styles.challengeHeaderRow}>
              <View>
                <Text style={styles.challengeSub}>Monthly Challenge</Text>
                <Text style={styles.challengeTitle}>Try 10 different cafes</Text>
              </View>
              <Text style={styles.challengeScore}>7 / 10</Text>
            </View>
            {/* Progress bar */}
            <View style={styles.challengeTrack}>
              <View style={[styles.challengeFill, { width: '70%' }]} />
            </View>
            <Text style={styles.challengeDesc}>
              Visit 3 more new partner cafes this month to unlock a free pastry voucher.
            </Text>
          </View>

          {/* Badges Section */}
          <View style={styles.badgesSection}>
            <Text style={styles.sectionHeading}>Badges</Text>
            <View style={styles.badgesRow}>
              {/* Badge 1 */}
              <View style={styles.badgeItem}>
                <View style={styles.badgeIconCircle}>
                  <Ionicons name="sunny" size={20} color={Colors.secondary} />
                </View>
                <Text style={styles.badgeName}>Early Bird</Text>
              </View>

              {/* Badge 2 */}
              <View style={styles.badgeItem}>
                <View style={styles.badgeIconCircle}>
                  <Ionicons name="compass" size={20} color={Colors.secondary} />
                </View>
                <Text style={styles.badgeName}>Cafe Hopper</Text>
              </View>

              {/* Badge 3 */}
              <View style={styles.badgeItem}>
                <View style={styles.badgeIconCircle}>
                  <Ionicons name="trophy" size={20} color={Colors.onSurfaceVariant} />
                </View>
                <Text style={[styles.badgeName, { color: Colors.onSurfaceVariant }]}>
                  Roast Master
                </Text>
              </View>
            </View>
          </View>

          {/* Referral Section */}
          <View style={styles.referralCard}>
            <Text style={styles.referralTitle}>Give a week, get a week</Text>
            <Text style={styles.referralDesc}>
              Share your code{' '}
              <Text style={styles.referralCode}>AARAV-SIP7</Text>. Your friend gets 7 free
              coffees and you get 7 days added.
            </Text>
            <TouchableOpacity
              style={styles.shareBtn}
              onPress={handleShareInvite}
              activeOpacity={0.88}
            >
              <Ionicons name="share-social-outline" size={18} color={Colors.onSecondary} />
              <Text style={styles.shareBtnText}>
                {inviteCopied ? 'Invite link copied!' : 'Give a week, get a week'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <BottomNavBar activeTab="profile" onTabPress={onNavigateTab} />
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
    gap: Spacing.gutterMd,
    paddingHorizontal: Spacing.pageMargin,
    paddingTop: Spacing.gutterLg,
    paddingBottom: Spacing.gutterMd,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  profileInfoCol: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.onSurface,
    fontFamily: Fonts.display,
  },
  profileMeta: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    fontFamily: Fonts.body,
  },
  logoutBtn: {
    padding: Spacing.gutterSm,
    borderRadius: BorderRadius.full,
  },
  scrollContent: {
    paddingHorizontal: Spacing.pageMargin,
    paddingBottom: 110,
    gap: Spacing.gutterLg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.gutterMd,
  },
  statCard: {
    flex: 1,
    padding: Spacing.gutterLg,
    borderRadius: BorderRadius.default,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    gap: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.onSurface,
    fontFamily: Fonts.display,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    fontFamily: Fonts.body,
  },
  challengeCard: {
    padding: Spacing.gutterLg,
    borderRadius: BorderRadius.default,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    gap: Spacing.gutterMd,
  },
  challengeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  challengeSub: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.secondary,
    fontFamily: Fonts.label,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.onSurface,
    fontFamily: Fonts.title,
    marginTop: 2,
  },
  challengeScore: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
    fontFamily: Fonts.title,
  },
  challengeTrack: {
    width: '100%',
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.surfaceContainerHigh,
    overflow: 'hidden',
  },
  challengeFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: Colors.secondary,
  },
  challengeDesc: {
    fontSize: 12,
    lineHeight: 17,
    color: Colors.onSurfaceVariant,
    fontFamily: Fonts.body,
  },
  badgesSection: {
    gap: Spacing.gutterSm,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.onSurface,
    fontFamily: Fonts.title,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: Spacing.gutterSm,
  },
  badgeItem: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.gutterMd,
    borderRadius: BorderRadius.default,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    gap: 6,
  },
  badgeIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeName: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.onSurface,
    fontFamily: Fonts.label,
    textAlign: 'center',
  },
  referralCard: {
    padding: Spacing.gutterLg,
    borderRadius: BorderRadius.default,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    gap: Spacing.gutterMd,
  },
  referralTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.onSurface,
    fontFamily: Fonts.title,
  },
  referralDesc: {
    fontSize: 13,
    lineHeight: 18,
    color: Colors.onSurfaceVariant,
    fontFamily: Fonts.body,
  },
  referralCode: {
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: Fonts.headline,
  },
  shareBtn: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondary,
  },
  shareBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSecondary,
    fontFamily: Fonts.label,
  },
});
