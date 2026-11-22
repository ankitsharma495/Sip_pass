import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Fonts } from '../theme/tokens';

export type TabType = 'home' | 'map' | 'pass' | 'profile';

interface BottomNavBarProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onTabPress }) => {
  const tabs: { key: TabType; label: string; iconActive: keyof typeof Ionicons.glyphMap; iconInactive: keyof typeof Ionicons.glyphMap }[] = [
    { key: 'home', label: 'Home', iconActive: 'home', iconInactive: 'home-outline' },
    { key: 'map', label: 'Map', iconActive: 'map', iconInactive: 'map-outline' },
    { key: 'pass', label: 'Pass', iconActive: 'ticket', iconInactive: 'ticket-outline' },
    { key: 'profile', label: 'Profile', iconActive: 'person', iconInactive: 'person-outline' },
  ];

  return (
    <View style={styles.floatingNavContainer} pointerEvents="box-none">
      <View style={styles.pillBar}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => onTabPress(tab.key)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isActive ? tab.iconActive : tab.iconInactive}
                size={isActive ? 18 : 22}
                color={Colors.onHoneyOat}
              />
              {isActive && <Text style={styles.activeLabel}>{tab.label}</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingNavContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: Spacing.pageMargin,
    right: Spacing.pageMargin,
    zIndex: 40,
    alignItems: 'center',
  },
  pillBar: {
    width: '100%',
    maxWidth: 390,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.honeyOat,
    padding: Spacing.gutterXs,
    borderRadius: BorderRadius.full,
    shadowColor: Colors.espresso,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.gutterXs + 2,
    paddingHorizontal: Spacing.gutterSm,
  },
  activeTabButton: {
    backgroundColor: Colors.surfaceContainerLowest,
    flex: 1.4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  activeLabel: {
    fontSize: 12,
    fontFamily: Fonts.label,
    fontWeight: '700',
    color: Colors.onHoneyOat,
  },
});
