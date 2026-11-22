import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Fonts } from '../theme/tokens';

interface RedeemModalProps {
  visible: boolean;
  cafeName?: string;
  onClose: () => void;
}

export const RedeemModal: React.FC<RedeemModalProps> = ({
  visible,
  cafeName = 'Blue Tokai Coffee',
  onClose,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(298);
  const [isScanned, setIsScanned] = useState(false);

  useEffect(() => {
    if (!visible) {
      setSecondsLeft(298);
      setIsScanned(false);
      return;
    }
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [visible]);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Top Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.8}>
              <Ionicons name="close" size={22} color={Colors.onSurface} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Show to barista</Text>
            <View style={{ width: 44 }} />
          </View>

          {/* Main Card */}
          <View style={styles.mainContent}>
            {!isScanned ? (
              /* Active QR Card */
              <View style={styles.qrCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cafeTag}>
                    {cafeName} · Indiranagar
                  </Text>
                  <Text style={styles.coffeeTitle}>Iced Pour Over (Attikan)</Text>
                  <Text style={styles.coffeeDesc}>Regular · Covered by Daily Sip Pass</Text>
                </View>

                {/* Vector QR Visual Mock */}
                <View style={styles.qrContainer}>
                  <View style={styles.qrBox}>
                    {/* Corners */}
                    <View style={[styles.cornerSquare, styles.topLeftCorner]} />
                    <View style={[styles.cornerSquare, styles.topRightCorner]} />
                    <View style={[styles.cornerSquare, styles.bottomLeftCorner]} />

                    {/* Center Accent */}
                    <View style={styles.centerLogo}>
                      <Ionicons name="cafe" size={20} color={Colors.surface} />
                    </View>

                    {/* QR Matrix Pattern Dots */}
                    <View style={styles.matrixContainer}>
                      <View style={[styles.matrixDot, { top: 40, left: 20 }]} />
                      <View style={[styles.matrixDot, { top: 20, left: 70 }]} />
                      <View style={[styles.matrixDot, { top: 80, right: 30 }]} />
                      <View style={[styles.matrixDot, { bottom: 30, right: 25 }]} />
                      <View style={[styles.matrixDot, { top: 60, left: 45 }]} />
                      <View style={[styles.matrixDot, { bottom: 45, left: 75 }]} />
                    </View>
                  </View>
                </View>

                {/* Countdown Timer */}
                <View style={styles.timerRow}>
                  <View style={styles.timerLabelGroup}>
                    <Ionicons name="timer-outline" size={18} color={Colors.secondary} />
                    <Text style={styles.timerLabel}>Code expires in</Text>
                  </View>
                  <Text style={styles.timerCountdown}>
                    {minutes}:{seconds}
                  </Text>
                </View>

                <Text style={styles.passIdText}>PASS ID · SIP-BLR-8492</Text>
              </View>
            ) : (
              /* Success Redeemed Card */
              <View style={styles.successCard}>
                <View style={styles.successIconCircle}>
                  <Ionicons name="checkmark-circle" size={44} color={Colors.success} />
                </View>
                <View style={styles.successTextCol}>
                  <Text style={styles.successBadge}>Coffee redeemed!</Text>
                  <Text style={styles.successTitle}>Enjoy your Iced Pour Over</Text>
                  <Text style={styles.successSubtitle}>
                    {cafeName} · Indiranagar · 17 coffees left this month
                  </Text>
                </View>

                <View style={styles.streakPill}>
                  <Ionicons name="flame" size={20} color={Colors.secondary} />
                  <Text style={styles.streakText}>5-day coffee streak!</Text>
                </View>
              </View>
            )}
          </View>

          {/* Bottom Action Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setIsScanned(!isScanned)}
              activeOpacity={0.88}
            >
              <Text style={styles.actionBtnText}>
                {!isScanned ? 'Mark as scanned' : 'Back to QR pass'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.pageMargin,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.gutterMd,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.onPrimary,
    fontFamily: Fonts.label,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: Spacing.gutterLg,
  },
  qrCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.gutterXl,
    alignItems: 'center',
    gap: Spacing.gutterLg,
  },
  cardHeader: {
    alignItems: 'center',
    gap: Spacing.gutterXs,
  },
  cafeTag: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontFamily: Fonts.label,
  },
  coffeeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.onSurface,
    fontFamily: Fonts.headline,
    textAlign: 'center',
  },
  coffeeDesc: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    fontFamily: Fonts.body,
    textAlign: 'center',
  },
  qrContainer: {
    padding: Spacing.gutterLg,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  qrBox: {
    width: 180,
    height: 180,
    position: 'relative',
    backgroundColor: '#FAF5EE',
    borderRadius: 8,
  },
  cornerSquare: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderRadius: 6,
    borderWidth: 5,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
  },
  topLeftCorner: {
    top: 8,
    left: 8,
  },
  topRightCorner: {
    top: 8,
    right: 8,
  },
  bottomLeftCorner: {
    bottom: 8,
    left: 8,
  },
  centerLogo: {
    position: 'absolute',
    top: 68,
    left: 68,
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.terracotta,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  matrixContainer: {
    ...StyleSheet.absoluteFill,
  },
  matrixDot: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  timerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.gutterLg,
    paddingVertical: Spacing.gutterMd,
    borderRadius: BorderRadius.default,
    backgroundColor: Colors.surfaceContainerLow,
  },
  timerLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timerLabel: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    fontFamily: Fonts.body,
  },
  timerCountdown: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.onSurface,
    fontFamily: Fonts.headline,
  },
  passIdText: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    fontFamily: Fonts.label,
    letterSpacing: 0.5,
  },
  successCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.gutterXl,
    alignItems: 'center',
    gap: Spacing.gutterLg,
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.successContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTextCol: {
    alignItems: 'center',
    gap: Spacing.gutterXs,
  },
  successBadge: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.success,
    fontFamily: Fonts.label,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.onSurface,
    fontFamily: Fonts.display,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    fontFamily: Fonts.body,
    textAlign: 'center',
  },
  streakPill: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: Spacing.gutterMd,
    borderRadius: BorderRadius.default,
    backgroundColor: Colors.surfaceContainerLow,
  },
  streakText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.onSurface,
    fontFamily: Fonts.label,
  },
  footer: {
    paddingBottom: Spacing.gutterLg,
  },
  actionBtn: {
    minHeight: 52,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.onSecondary,
    fontFamily: Fonts.label,
  },
});
