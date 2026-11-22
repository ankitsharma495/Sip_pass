import React, { useState } from 'react';
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
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Fonts } from '../theme/tokens';
import { BottomNavBar, TabType } from '../components/BottomNavBar';

interface MapScreenProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenRedeem: (cafeName: string) => void;
}

interface MapCafe {
  name: string;
  meta: string;
  rating: string;
  img: string;
  top: number;
  left?: number;
  right?: number;
}

const MAP_CAFES: MapCafe[] = [
  {
    name: 'Third Wave Coffee',
    meta: '100 Feet Rd · 350 m · Open until 11 PM',
    rating: '4.8',
    img: 'https://lh3.googleusercontent.com/aida/ALJJyrDW5vPEL-ysqzrVmBRUWvIVJUWDdYt6BhGwhYS4YQT8a4FMfoA9T9FP_ZWqfyMGTmFtSnUXRrC26GIcQnNQ4BZdLPH_PI4s6gC_JGxag96i7mYMP657PQRvPdF-KwJKdTGL8n29A19xtDZVxxJUAIFJOw6tw71ECHRF7BHBFQzgz5sGvV2gyEShT4X2wo_5CBK3iBSJg6F0twM3z-mpAmZ3KnCG0LC1DNF9MFuwoXN3Dlc-34VZRIMTTxqu5QQXC8QG7ts',
    top: 110,
    left: 85,
  },
  {
    name: 'Blue Tokai Coffee',
    meta: '12th Main · 650 m · Open until 10 PM',
    rating: '4.9',
    img: 'https://lh3.googleusercontent.com/aida/ALJJyrDTZntf9LsOoyE9LTjd71urOgmvYHgv_jOeMI2K3OyED5o2O0y5DcPs5L6c-bzg6mmxieuneO3vyvrCIXoMUXwklQ5FOC7dRnP6H6N04tzXIzy-hwJquY1nY-WyMqaKfG_ZDSRnASJYMRJiFaef28d6h7uMlaaZBgTOBQ9mk7yvtIzUjiq3fGiV7R0e11LmNowjtZW0h2eInh1L7eVOi0PL--rF6p9pU_jqFp7ZHYOi0bcqag6tNNqLG0T2UaEy3iDwce4',
    top: 175,
    right: 35,
  },
  {
    name: 'Araku Coffee',
    meta: 'HAL 2nd Stage · 1.2 km · Open until 9:30 PM',
    rating: '4.8',
    img: 'https://lh3.googleusercontent.com/aida/ALJJyrB9TimTLRZEsuwG-OFCkGvV65E57cvfgXm5MK9ukOgscTipc6fKmcYuQQW8J88uWa-mcgIWZZdPLuCwGCVV9v1WktKisnUU29GXUb13QxsGNz_-W9pV83sfX0r6EbSvIYiXPVkDOGAwKRtQNvlUaFthv_0LckH0DImzU88zKMQAA_iCfl_rkH4iGIeIwhJ_slgT0_WpjTHKLlWdS0uxDv2129l9v0DpaYhMVgFVEVWpIiTDb_kaEgutZJh0JwUc5g',
    top: 310,
    left: 45,
  },
];

export const MapScreen: React.FC<MapScreenProps> = ({ onNavigateTab, onOpenRedeem }) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedPinIndex, setSelectedPinIndex] = useState(0);
  const selectedCafe = MAP_CAFES[selectedPinIndex];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Header & Search */}
        <View style={styles.header}>
          <View style={styles.headerTopRow}>
            <Text style={styles.headerTitle}>Indiranagar</Text>
            {/* View Mode Toggle */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleBtn,
                  viewMode === 'map' ? styles.activeToggleBtn : styles.inactiveToggleBtn,
                ]}
                onPress={() => setViewMode('map')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="map"
                  size={15}
                  color={viewMode === 'map' ? Colors.onPrimary : Colors.onSurfaceVariant}
                />
                <Text
                  style={[
                    styles.toggleBtnText,
                    viewMode === 'map' ? styles.activeToggleText : styles.inactiveToggleText,
                  ]}
                >
                  Map
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toggleBtn,
                  viewMode === 'list' ? styles.activeToggleBtn : styles.inactiveToggleBtn,
                ]}
                onPress={() => setViewMode('list')}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="list"
                  size={16}
                  color={viewMode === 'list' ? Colors.onPrimary : Colors.onSurfaceVariant}
                />
                <Text
                  style={[
                    styles.toggleBtnText,
                    viewMode === 'list' ? styles.activeToggleText : styles.inactiveToggleText,
                  ]}
                >
                  List
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search bar */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={Colors.onSurfaceVariant} />
            <TextInput
              style={styles.searchInput}
              value="Indiranagar, 100 Feet Rd"
              editable={false}
            />
          </View>
        </View>

        {viewMode === 'map' ? (
          /* Map Canvas */
          <View style={styles.mapCanvas}>
            {/* Background Road Grid Lines */}
            <View style={styles.gridContainer}>
              {/* Horizontal Roads */}
              <View style={[styles.roadHorizontal, { top: 100 }]} />
              <View style={[styles.roadHorizontal, { top: 220 }]} />
              <View style={[styles.roadHorizontal, { top: 350 }]} />
              <View style={[styles.roadHorizontal, { top: 480 }]} />

              {/* Vertical Roads */}
              <View style={[styles.roadVertical, { left: 70 }]} />
              <View style={[styles.roadVertical, { left: 190 }]} />
              <View style={[styles.roadVertical, { left: 300 }]} />

              {/* Diagonal connecting road */}
              <View style={styles.diagonalRoad} />

              {/* Green Park Region */}
              <View style={styles.parkBlock}>
                <Text style={styles.parkLabel}>CMH Park</Text>
              </View>

              {/* Road Names */}
              <Text style={[styles.roadLabel, { top: 210, left: 200 }]}>100 FEET ROAD</Text>
              <Text style={[styles.roadLabel, { top: 340, left: 15 }]}>12TH MAIN RD</Text>

              {/* User Location Pulse */}
              <View style={styles.userLocationPulse}>
                <View style={styles.userLocationDot} />
              </View>

              {/* Cafe Pins */}
              {MAP_CAFES.map((cafe, index) => {
                const isSelected = selectedPinIndex === index;
                return (
                  <TouchableOpacity
                    key={cafe.name}
                    style={[
                      styles.cafePin,
                      isSelected ? styles.selectedPin : styles.unselectedPin,
                      { top: cafe.top },
                      cafe.left !== undefined ? { left: cafe.left } : { right: cafe.right },
                    ]}
                    onPress={() => setSelectedPinIndex(index)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="cafe"
                      size={15}
                      color={isSelected ? Colors.onPrimary : Colors.secondary}
                    />
                    <Text
                      style={[
                        styles.pinLabel,
                        isSelected ? styles.selectedPinText : styles.unselectedPinText,
                      ]}
                    >
                      {cafe.name.split(' ')[0]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Bottom Sheet Selected Cafe Preview */}
            <View style={styles.previewSheet}>
              <View style={styles.sheetHandle} />
              <View style={styles.sheetContentRow}>
                <Image source={{ uri: selectedCafe.img }} style={styles.sheetThumbnail} />
                <View style={styles.sheetDetailsCol}>
                  <View style={styles.sheetBadgeRow}>
                    <View style={styles.redeemTag}>
                      <Text style={styles.redeemTagText}>Redeem here</Text>
                    </View>
                    <View style={styles.ratingTag}>
                      <Ionicons name="star" size={13} color={Colors.secondary} />
                      <Text style={styles.ratingTagText}>{selectedCafe.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.sheetCafeName} numberOfLines={1}>
                    {selectedCafe.name}
                  </Text>
                  <Text style={styles.sheetMetaText} numberOfLines={1}>
                    {selectedCafe.meta}
                  </Text>
                </View>
              </View>

              <View style={styles.sheetButtonRow}>
                <TouchableOpacity style={styles.sheetMenuBtn} activeOpacity={0.8}>
                  <Text style={styles.sheetMenuBtnText}>View menu</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sheetRedeemBtn}
                  onPress={() => onOpenRedeem(selectedCafe.name)}
                  activeOpacity={0.88}
                >
                  <Ionicons name="qr-code-outline" size={18} color={Colors.onPrimary} />
                  <Text style={styles.sheetRedeemBtnText}>Redeem</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          /* List View */
          <ScrollView
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {MAP_CAFES.map((cafe) => (
              <TouchableOpacity
                key={cafe.name}
                style={styles.listCard}
                onPress={() => onOpenRedeem(cafe.name)}
                activeOpacity={0.7}
              >
                <Image source={{ uri: cafe.img }} style={styles.listCardImage} />
                <View style={styles.listCardInfo}>
                  <Text style={styles.listCardTitle}>{cafe.name}</Text>
                  <Text style={styles.listCardMeta}>
                    {cafe.meta.split('·')[1]?.trim() || '350 m'} · {cafe.rating} ★ · Redeem here
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={Colors.outline} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Unified Bottom Nav */}
        <BottomNavBar activeTab="map" onTabPress={onNavigateTab} />
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
    paddingHorizontal: Spacing.pageMargin,
    paddingTop: Spacing.gutterLg,
    paddingBottom: Spacing.gutterMd,
    gap: Spacing.gutterMd,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.outlineVariant,
    zIndex: 20,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.onSurface,
    fontFamily: Fonts.display,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    padding: 3,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.gutterMd,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  activeToggleBtn: {
    backgroundColor: Colors.primary,
  },
  inactiveToggleBtn: {
    backgroundColor: 'transparent',
  },
  toggleBtnText: {
    fontSize: 12,
    fontFamily: Fonts.label,
  },
  activeToggleText: {
    color: Colors.onPrimary,
    fontWeight: '600',
  },
  inactiveToggleText: {
    color: Colors.onSurfaceVariant,
    fontWeight: '500',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.gutterSm,
    minHeight: 44,
    paddingHorizontal: Spacing.gutterLg,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.onSurface,
    fontFamily: Fonts.body,
  },
  mapCanvas: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F1EDE8',
    overflow: 'hidden',
  },
  gridContainer: {
    flex: 1,
    position: 'relative',
  },
  roadHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 10,
    backgroundColor: '#FFFFFF',
  },
  roadVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 12,
    backgroundColor: '#FFFFFF',
  },
  diagonalRoad: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 360,
    height: 6,
    backgroundColor: '#E6E2DD',
    transform: [{ rotate: '48deg' }],
  },
  parkBlock: {
    position: 'absolute',
    top: 130,
    left: 95,
    width: 86,
    height: 90,
    borderRadius: 14,
    backgroundColor: '#D9F8E7',
    opacity: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
  },
  parkLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F6E43',
    fontFamily: Fonts.label,
  },
  roadLabel: {
    position: 'absolute',
    fontSize: 10,
    fontWeight: '600',
    color: '#827472',
    fontFamily: Fonts.label,
    letterSpacing: 0.5,
  },
  userLocationPulse: {
    position: 'absolute',
    top: 250,
    left: 175,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(159, 64, 33, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userLocationDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.secondary,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cafePin: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.gutterMd,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedPin: {
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.surfaceContainerLowest,
    transform: [{ scale: 1.05 }],
  },
  unselectedPin: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  pinLabel: {
    fontSize: 12,
    fontFamily: Fonts.label,
  },
  selectedPinText: {
    color: Colors.onPrimary,
    fontWeight: '600',
  },
  unselectedPinText: {
    color: Colors.onSurface,
    fontWeight: '500',
  },
  previewSheet: {
    position: 'absolute',
    bottom: 84,
    left: Spacing.pageMargin,
    right: Spacing.pageMargin,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.default,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    padding: Spacing.gutterMd,
    gap: Spacing.gutterMd,
    shadowColor: '#321716',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 25,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.outlineVariant,
    alignSelf: 'center',
  },
  sheetContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.gutterMd,
  },
  sheetThumbnail: {
    width: 74,
    height: 74,
    borderRadius: BorderRadius.md,
  },
  sheetDetailsCol: {
    flex: 1,
    gap: 2,
  },
  sheetBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  redeemTag: {
    paddingHorizontal: Spacing.gutterSm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainerLow,
  },
  redeemTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.secondary,
    fontFamily: Fonts.label,
  },
  ratingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingTagText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.onSurface,
    fontFamily: Fonts.label,
  },
  sheetCafeName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.onSurface,
    fontFamily: Fonts.title,
  },
  sheetMetaText: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    fontFamily: Fonts.body,
  },
  sheetButtonRow: {
    flexDirection: 'row',
    gap: Spacing.gutterSm,
  },
  sheetMenuBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetMenuBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurface,
    fontFamily: Fonts.label,
  },
  sheetRedeemBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.honeyOat,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  sheetRedeemBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.onHoneyOat,
    fontFamily: Fonts.label,
  },
  listContent: {
    paddingHorizontal: Spacing.pageMargin,
    paddingTop: Spacing.gutterLg,
    paddingBottom: 110,
    gap: Spacing.gutterMd,
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.gutterMd,
    padding: Spacing.gutterMd,
    borderRadius: BorderRadius.default,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  listCardImage: {
    width: 68,
    height: 68,
    borderRadius: BorderRadius.md,
  },
  listCardInfo: {
    flex: 1,
    gap: 2,
  },
  listCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.onSurface,
    fontFamily: Fonts.title,
  },
  listCardMeta: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    fontFamily: Fonts.body,
  },
});
