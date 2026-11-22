import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Fonts } from '../theme/tokens';
import { MOCK_USER, MOCK_CAFES } from '../data/mockData';
import { FilterCategory, Cafe } from '../types';
import { BottomNavBar, TabType } from '../components/BottomNavBar';

interface HomeScreenProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenRedeem: (cafeName?: string) => void;
  onOpenProfile: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateTab,
  onOpenRedeem,
  onOpenProfile,
}) => {
  const [isCoffeeAvailable, setIsCoffeeAvailable] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  const filteredCafes = useMemo(() => {
    return MOCK_CAFES.filter((cafe) => {
      const matchesFilter =
        activeFilter === 'all' || cafe.tags.includes(activeFilter);
      const matchesSearch =
        searchQuery.trim() === '' ||
        cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cafe.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        {/* Top Greeting Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.profileRow}
            onPress={onOpenProfile}
            activeOpacity={0.8}
          >
            <View style={styles.avatarBorder}>
              <Image source={{ uri: MOCK_USER.avatar }} style={styles.avatarImage} />
            </View>
            <View style={styles.greetingCol}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.nameText}>{MOCK_USER.name}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.8}>
            <Ionicons name="notifications-outline" size={20} color={Colors.onSurface} />
          </TouchableOpacity>
        </View>

        {/* Main Scrollable Content */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Search Bar + Filter Tune Button */}
          <View style={styles.searchRow}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color={Colors.onSurfaceVariant} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search cafes, Indiranagar..."
                placeholderTextColor={Colors.outline}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons name="close-circle" size={18} color={Colors.outline} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={styles.tuneButton} activeOpacity={0.8}>
              <Ionicons name="options-outline" size={20} color={Colors.onSurface} />
            </TouchableOpacity>
          </View>

          {/* Today's Coffee Hero Banner Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusTextCol}>
              <Text style={styles.statusBadgeText}>
                {isCoffeeAvailable ? "Today's Coffee · Available" : "Today's Coffee · Redeemed"}
              </Text>
              <Text style={styles.statusTitle}>
                {isCoffeeAvailable ? '1 Free Cup Ready' : 'Enjoyed at Blue Tokai'}
              </Text>
              <Text style={styles.statusSubtitle}>
                {isCoffeeAvailable
                  ? 'Redeem at 240+ partner cafes'
                  : 'Next cup unlocks tomorrow at 6:00 AM'}
              </Text>

              <TouchableOpacity
                style={styles.statusCtaButton}
                onPress={() => {
                  if (isCoffeeAvailable) {
                    onOpenRedeem('Third Wave Coffee');
                  } else {
                    setIsCoffeeAvailable(true);
                  }
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.statusCtaText}>
                  {isCoffeeAvailable ? 'Redeem Now' : 'View Pass'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.statusImageWrapper}>
              <Image
                source={{
                  uri:
                    'https://lh3.googleusercontent.com/aida/ALJJyrDXU0YoWVIO1dITFu9hVJAY_zJn1H2ctaBNhQ4p0mHiup4zrgzX3yUo0l-M407GPmh0qu3wAQh0w7TswHGN-HlNPsTH0Q6z0u9NFYQZfWM-QfGyHdoB4xn5TXlL_ZGies_fLBdsJ4HY8La28Cv7pUOcjTTmIegFzFfBxplpFNYV8p57509bVW9Uwf_u-R0zmlDywmDWIz1kIlYC2NHGZRuRfc8UDi57fCah5aLKK6V-5H6Tr4WSe6oQJHyLg2Z51cP4dYo',
                }}
                style={styles.statusImage}
              />
            </View>
          </View>

          {/* Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            {[
              { id: 'all' as FilterCategory, label: 'Nearby' },
              { id: 'specialty' as FilterCategory, label: 'Specialty' },
              { id: 'work' as FilterCategory, label: 'Work-friendly' },
              { id: 'top' as FilterCategory, label: 'Top rated' },
            ].map((chip) => {
              const isActive = activeFilter === chip.id;
              return (
                <TouchableOpacity
                  key={chip.id}
                  style={[styles.filterChip, isActive ? styles.activeFilterChip : styles.inactiveFilterChip]}
                  onPress={() => setActiveFilter(chip.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.filterChipText, isActive ? styles.activeFilterText : styles.inactiveFilterText]}>
                    {chip.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Partner Cafes Section */}
          <View style={styles.cafesSectionHeader}>
            <Text style={styles.cafesSectionTitle}>Partner cafes nearby</Text>
            <Text style={styles.cafesOpenCount}>12 open now</Text>
          </View>

          <View style={styles.cafeList}>
            {filteredCafes.map((cafe) => (
              <TouchableOpacity
                key={cafe.id}
                style={styles.cafeCard}
                onPress={() => onOpenRedeem(cafe.name)}
                activeOpacity={0.92}
              >
                <View style={styles.cafeImageContainer}>
                  <Image source={{ uri: cafe.image }} style={styles.cafeImage} resizeMode="cover" />
                  <View style={styles.redeemHereBadge}>
                    <Text style={styles.redeemHereText}>Redeem here</Text>
                  </View>
                </View>

                <View style={styles.cafeMetaRow}>
                  <View style={styles.cafeInfo}>
                    <Text style={styles.cafeName} numberOfLines={1}>
                      {cafe.name}
                    </Text>
                    <Text style={styles.cafeAddress} numberOfLines={1}>
                      {cafe.address} · {cafe.distance}
                    </Text>
                  </View>

                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={14} color={Colors.secondary} />
                    <Text style={styles.ratingText}>{cafe.rating.toFixed(1)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Floating Pill Bottom Navigation */}
        <BottomNavBar activeTab="home" onTabPress={onNavigateTab} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.pageMargin,
    paddingTop: Spacing.gutterMd,
    paddingBottom: Spacing.gutterSm,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.gutterMd,
  },
  avatarBorder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.surfaceContainerLowest,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  greetingCol: {
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    fontFamily: Fonts.label,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.onSurface,
    fontFamily: Fonts.headline,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  scrollContent: {
    paddingHorizontal: Spacing.pageMargin,
    paddingTop: Spacing.gutterSm,
    paddingBottom: 110,
    gap: Spacing.gutterLg,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.gutterSm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.gutterSm,
    minHeight: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainerLowest,
    paddingHorizontal: Spacing.gutterLg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.onSurface,
    fontFamily: Fonts.body,
  },
  tuneButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  statusCard: {
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.espresso,
    padding: Spacing.gutterLg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.gutterMd,
    shadowColor: Colors.espresso,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  statusTextCol: {
    flex: 1,
    gap: Spacing.gutterXs,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.honeyOat,
    fontFamily: Fonts.label,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FAF4EC',
    fontFamily: Fonts.display,
  },
  statusSubtitle: {
    fontSize: 13,
    color: '#D4C6B8',
    fontFamily: Fonts.body,
  },
  statusCtaButton: {
    alignSelf: 'flex-start',
    marginTop: Spacing.gutterSm,
    paddingHorizontal: Spacing.gutterLg,
    minHeight: 38,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.honeyOat,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCtaText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onHoneyOat,
    fontFamily: Fonts.label,
  },
  statusImageWrapper: {
    width: 88,
    height: 88,
    borderRadius: 44,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(236, 200, 148, 0.4)',
  },
  statusImage: {
    width: '100%',
    height: '100%',
  },
  filtersScroll: {
    gap: Spacing.gutterSm,
    paddingVertical: Spacing.gutterXs,
  },
  filterChip: {
    minHeight: 40,
    paddingHorizontal: Spacing.gutterLg,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFilterChip: {
    backgroundColor: Colors.honeyOat,
  },
  inactiveFilterChip: {
    backgroundColor: Colors.surfaceContainerLowest,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Fonts.label,
  },
  activeFilterText: {
    color: Colors.onHoneyOat,
  },
  inactiveFilterText: {
    color: Colors.onSurface,
  },
  cafesSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.gutterSm,
  },
  cafesSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.onSurface,
    fontFamily: Fonts.headline,
  },
  cafesOpenCount: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.secondary,
    fontFamily: Fonts.label,
  },
  cafeList: {
    gap: Spacing.gutterLg,
  },
  cafeCard: {
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.gutterMd,
    gap: Spacing.gutterMd,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cafeImageContainer: {
    position: 'relative',
    width: '100%',
    height: 175,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceContainerLow,
  },
  cafeImage: {
    width: '100%',
    height: '100%',
  },
  redeemHereBadge: {
    position: 'absolute',
    top: Spacing.gutterSm,
    left: Spacing.gutterSm,
    paddingHorizontal: Spacing.gutterMd,
    paddingVertical: Spacing.gutterXs + 2,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainerLowest,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  redeemHereText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondary,
    fontFamily: Fonts.label,
  },
  cafeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.gutterSm,
    paddingHorizontal: Spacing.gutterXs,
  },
  cafeInfo: {
    flex: 1,
    gap: 2,
  },
  cafeName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.onSurface,
    fontFamily: Fonts.headline,
  },
  cafeAddress: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    fontFamily: Fonts.body,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.gutterSm + 2,
    paddingVertical: Spacing.gutterXs + 1,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainerLow,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.onSurface,
    fontFamily: Fonts.label,
  },
});
