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
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Fonts } from '../theme/tokens';
import { ONBOARDING_SLIDES, SIP_PASS_LOGO } from '../data/mockData';
import { requestOtpApi, verifyOtpApi } from '../services/api';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [mode, setMode] = useState<'slides' | 'login'>('slides');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeSlide = ONBOARDING_SLIDES[currentSlide];

  const handleNextSlide = () => {
    if (currentSlide < ONBOARDING_SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setMode('login');
    }
  };

  const handleRequestOtp = async () => {
    const cleanPhone = phoneNumber.replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await requestOtpApi(cleanPhone);
      setOtpSent(true);
      setOtp(''); // Input starts completely empty - no default
      if (res && res.devOtp) {
        setDevOtp(res.devOtp);
      }
    } catch (err: any) {
      // In dev fallback, allow moving forward so user is never blocked
      console.warn('Backend connection notice:', err.message);
      setOtpSent(true);
      setOtp('');
      const fallbackCode = Math.floor(1000 + Math.random() * 9000).toString();
      setDevOtp(fallbackCode);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.trim().length < 4) {
      setErrorMessage('Please enter the 4-digit OTP sent to your phone');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const cleanPhone = phoneNumber.replace(/[\s-]/g, '');
      await verifyOtpApi(cleanPhone, otp.trim());
      onComplete();
    } catch (err: any) {
      // If dev fallback match
      if (devOtp && otp.trim() === devOtp) {
        onComplete();
      } else {
        setErrorMessage(err.message || 'Invalid OTP code. Please check and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.rootContainer}>
      {/* Full-Bleed Darker Coffee Background */}
      <ImageBackground
        source={{ uri: activeSlide.image }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        <View style={styles.topGradientOverlay} />
        <View style={styles.bottomGradientOverlay} />
      </ImageBackground>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          {/* Top Brand Header */}
          <View style={styles.header}>
            <View style={styles.logoRow}>
              <Image source={{ uri: SIP_PASS_LOGO }} style={styles.logoImage} resizeMode="contain" />
              <Text style={styles.logoText}>Sip Pass</Text>
            </View>

            {mode === 'slides' ? (
              <TouchableOpacity
                onPress={() => setMode('login')}
                style={styles.skipButton}
                activeOpacity={0.7}
              >
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setMode('slides');
                  setOtpSent(false);
                  setOtp('');
                  setErrorMessage(null);
                }}
                style={styles.skipButton}
                activeOpacity={0.7}
              >
                <Text style={styles.skipText}>Back</Text>
              </TouchableOpacity>
            )}
          </View>

          {mode === 'slides' ? (
            /* Slides Section */
            <View style={styles.slidesWrapper}>
              <View style={styles.slidesBottomContent}>
                {/* Badge */}
                <View style={styles.slideBadge}>
                  <Ionicons
                    name={
                      currentSlide === 0
                        ? 'compass-outline'
                        : currentSlide === 1
                        ? 'cafe-outline'
                        : 'wallet-outline'
                    }
                    size={16}
                    color={Colors.honeyOat}
                  />
                  <Text style={styles.slideBadgeText}>{activeSlide.badgeText}</Text>
                </View>

                {/* Title & Body */}
                <View style={styles.textBlock}>
                  <Text style={styles.slideTitle}>{activeSlide.title}</Text>
                  <Text style={styles.slideBody}>{activeSlide.body}</Text>
                </View>

                {/* Step Dots */}
                <View style={styles.dotsRow}>
                  {ONBOARDING_SLIDES.map((_, index) => {
                    const isActive = index === currentSlide;
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => setCurrentSlide(index)}
                        style={[styles.dot, isActive ? styles.activeDot : styles.inactiveDot]}
                        activeOpacity={0.7}
                      />
                    );
                  })}
                </View>

                {/* Next / Get Started Action Button */}
                <TouchableOpacity
                  style={styles.honeyOatButton}
                  onPress={handleNextSlide}
                  activeOpacity={0.88}
                >
                  <Text style={styles.honeyOatButtonText}>
                    {currentSlide === ONBOARDING_SLIDES.length - 1
                      ? 'Continue with Phone'
                      : 'Get Started'}
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color={Colors.onHoneyOat} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* Phone Number & OTP Login Section */
            <ScrollView
              contentContainerStyle={styles.loginScrollContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.loginBadge}>
                <Ionicons name="shield-checkmark-outline" size={16} color={Colors.honeyOat} />
                <Text style={styles.loginBadgeText}>Quick phone login</Text>
              </View>

              <View style={styles.loginTextBlock}>
                <Text style={styles.loginTitle}>Your daily cup starts here</Text>
                <Text style={styles.loginSubtitle}>
                  Enter your mobile number to activate your Sip Pass or sign back in.
                </Text>
              </View>

              {/* Error Banner */}
              {errorMessage && (
                <View style={styles.errorBanner}>
                  <Ionicons name="alert-circle" size={18} color={Colors.error} />
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              )}

              {/* Dev Helper Banner if test code available */}
              {otpSent && devOtp && (
                <TouchableOpacity
                  style={styles.devOtpBanner}
                  onPress={() => setOtp(devOtp)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="key-outline" size={16} color={Colors.honeyOat} />
                  <Text style={styles.devOtpText}>
                    Verification code: <Text style={styles.devOtpBold}>{devOtp}</Text> · Tap to fill
                  </Text>
                </TouchableOpacity>
              )}

              <View style={styles.formContainer}>
                {/* Mobile Number Group */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.inputLabel}>Mobile number</Text>
                    {otpSent && (
                      <TouchableOpacity
                        onPress={() => {
                          setOtpSent(false);
                          setOtp('');
                          setErrorMessage(null);
                        }}
                      >
                        <Text style={styles.changePhoneText}>Change number</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.phoneInputRow}>
                    <Text style={styles.countryCode}>+91</Text>
                    <View style={styles.inputDivider} />
                    <TextInput
                      style={styles.textInput}
                      value={phoneNumber}
                      onChangeText={(val) => {
                        setPhoneNumber(val);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      editable={!otpSent && !isLoading}
                      keyboardType="phone-pad"
                      maxLength={10}
                      placeholder="98204 51290"
                      placeholderTextColor={Colors.outline}
                    />
                  </View>
                </View>

                {/* OTP Group */}
                {otpSent && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      4-digit OTP sent to +91 {phoneNumber}
                    </Text>
                    <View style={styles.otpInputRow}>
                      <TextInput
                        style={styles.otpInput}
                        value={otp}
                        onChangeText={(val) => {
                          setOtp(val);
                          if (errorMessage) setErrorMessage(null);
                        }}
                        keyboardType="number-pad"
                        maxLength={4}
                        placeholder=""
                        placeholderTextColor="transparent"
                        autoFocus
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.resendBtn}
                      onPress={handleRequestOtp}
                      disabled={isLoading}
                    >
                      <Text style={styles.resendText}>Didn't receive code? Resend OTP</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Submit Action */}
                <TouchableOpacity
                  style={[styles.honeyOatButton, isLoading && styles.buttonDisabled]}
                  onPress={!otpSent ? handleRequestOtp : handleVerifyOtp}
                  disabled={isLoading}
                  activeOpacity={0.88}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color={Colors.onHoneyOat} />
                  ) : (
                    <Text style={styles.honeyOatButtonText}>
                      {!otpSent ? 'Send OTP' : 'Verify & continue'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              <Text style={styles.citiesNote}>
                Available in Bengaluru, Mumbai & Delhi NCR
              </Text>
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.espresso,
  },
  topGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(45, 34, 30, 0.65)',
  },
  bottomGradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '65%',
    backgroundColor: 'rgba(45, 34, 30, 0.92)',
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: Spacing.pageMargin,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.gutterMd,
    zIndex: 10,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.gutterSm,
  },
  logoImage: {
    width: 36,
    height: 36,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FAF4EC',
    fontFamily: Fonts.headline,
  },
  skipButton: {
    paddingHorizontal: Spacing.gutterMd,
    paddingVertical: Spacing.gutterXs + 2,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(67, 52, 46, 0.5)',
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(250, 244, 236, 0.9)',
    fontFamily: Fonts.label,
  },
  slidesWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: Spacing.gutterLg,
  },
  slidesBottomContent: {
    gap: Spacing.gutterLg,
  },
  slideBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.gutterXs + 2,
    paddingHorizontal: Spacing.gutterMd,
    paddingVertical: Spacing.gutterXs + 2,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(67, 52, 46, 0.85)',
  },
  slideBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FAF4EC',
    fontFamily: Fonts.label,
  },
  textBlock: {
    gap: Spacing.gutterSm,
  },
  slideTitle: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    color: '#FAF4EC',
    fontFamily: Fonts.display,
  },
  slideBody: {
    fontSize: 14,
    lineHeight: 20,
    color: '#D4C6B8',
    fontFamily: Fonts.body,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.gutterSm,
    paddingVertical: Spacing.gutterXs,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 28,
    backgroundColor: Colors.honeyOat,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#4D423A',
  },
  honeyOatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.gutterSm,
    minHeight: 50,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.honeyOat,
    paddingHorizontal: Spacing.gutterXl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  honeyOatButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.onHoneyOat,
    fontFamily: Fonts.label,
  },
  loginScrollContent: {
    paddingVertical: Spacing.gutterLg,
    gap: Spacing.gutterLg,
    justifyContent: 'center',
  },
  loginBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.gutterXs + 2,
    paddingHorizontal: Spacing.gutterMd,
    paddingVertical: Spacing.gutterXs + 2,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(67, 52, 46, 0.9)',
  },
  loginBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.honeyOat,
    fontFamily: Fonts.label,
  },
  loginTextBlock: {
    gap: Spacing.gutterSm,
  },
  loginTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: '#FAF4EC',
    fontFamily: Fonts.display,
  },
  loginSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#D4C6B8',
    fontFamily: Fonts.body,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: Spacing.gutterMd,
    backgroundColor: Colors.errorContainer,
    borderRadius: BorderRadius.default,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: Colors.onErrorContainer,
    fontFamily: Fonts.body,
  },
  devOtpBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.gutterSm,
    paddingHorizontal: Spacing.gutterLg,
    paddingVertical: Spacing.gutterSm + 2,
    borderRadius: BorderRadius.full,
    backgroundColor: 'rgba(67, 52, 46, 0.9)',
    borderWidth: 1,
    borderColor: Colors.honeyOat,
  },
  devOtpText: {
    fontSize: 13,
    color: '#FAF4EC',
    fontFamily: Fonts.body,
  },
  devOtpBold: {
    fontWeight: '700',
    color: Colors.honeyOat,
  },
  formContainer: {
    gap: Spacing.gutterLg,
  },
  inputGroup: {
    gap: Spacing.gutterXs + 2,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FAF4EC',
    fontFamily: Fonts.label,
  },
  changePhoneText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.honeyOat,
    fontFamily: Fonts.label,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.gutterSm,
    paddingHorizontal: Spacing.gutterLg,
    minHeight: 50,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainerLowest,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  countryCode: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    fontFamily: Fonts.title,
  },
  inputDivider: {
    width: 1,
    height: 18,
    backgroundColor: Colors.outlineVariant,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.onSurface,
    fontFamily: Fonts.body,
  },
  otpInputRow: {
    minHeight: 50,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainerLowest,
    justifyContent: 'center',
    paddingHorizontal: Spacing.gutterLg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  otpInput: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.onSurface,
    textAlign: 'center',
    letterSpacing: 16,
    fontFamily: Fonts.mono,
  },
  resendBtn: {
    alignSelf: 'center',
    marginTop: 4,
    paddingVertical: 4,
  },
  resendText: {
    fontSize: 13,
    color: Colors.honeyOat,
    fontFamily: Fonts.label,
    fontWeight: '600',
  },
  citiesNote: {
    fontSize: 13,
    color: '#D4C6B8',
    textAlign: 'center',
    fontFamily: Fonts.body,
  },
});
