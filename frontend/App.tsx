import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Rubik_600SemiBold,
  Rubik_700Bold,
} from '@expo-google-fonts/rubik';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from '@expo-google-fonts/plus-jakarta-sans';

import { Colors } from './src/theme/tokens';
import { TabType } from './src/components/BottomNavBar';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { MapScreen } from './src/screens/MapScreen';
import { PassScreen } from './src/screens/PassScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { RedeemModal } from './src/screens/RedeemModal';

export default function App() {
  const [fontsLoaded] = useFonts({
    Rubik_600SemiBold,
    Rubik_700Bold,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [redeemVisible, setRedeemVisible] = useState(false);
  const [redeemCafe, setRedeemCafe] = useState('Blue Tokai Coffee');

  const openRedeem = (cafeName: string = 'Blue Tokai Coffee') => {
    setRedeemCafe(cafeName);
    setRedeemVisible(true);
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );
  }

  if (!hasCompletedOnboarding) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        <OnboardingScreen onComplete={() => setHasCompletedOnboarding(true)} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {activeTab === 'home' && (
        <HomeScreen
          onNavigateTab={setActiveTab}
          onOpenRedeem={openRedeem}
          onOpenProfile={() => setActiveTab('profile')}
        />
      )}

      {activeTab === 'map' && (
        <MapScreen
          onNavigateTab={setActiveTab}
          onOpenRedeem={openRedeem}
        />
      )}

      {activeTab === 'pass' && (
        <PassScreen
          onNavigateTab={setActiveTab}
          onOpenRedeem={openRedeem}
        />
      )}

      {activeTab === 'profile' && (
        <ProfileScreen
          onNavigateTab={setActiveTab}
          onLogout={() => {
            setHasCompletedOnboarding(false);
            setActiveTab('home');
          }}
        />
      )}

      {/* QR Code Barista Redemption Modal */}
      <RedeemModal
        visible={redeemVisible}
        cafeName={redeemCafe}
        onClose={() => setRedeemVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
