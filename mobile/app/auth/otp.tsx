import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { Colors } from '../../src/theme/tokens';
import { useApp } from '../../src/context/AppContext';

export default function OtpVerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const phoneNumber = (params.phone as string) || '+91 98765 43210';

  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [timer, setTimer] = useState(45);
  const [loading, setLoading] = useState(false);

  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null)
  ];

  useEffect(() => {
    let interval: any = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleDigitChange = (val: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = val ? val.slice(-1) : '';
    setOtp(newOtp);

    // Auto focus next
    if (val && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleContinue = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Navigate to Screen 06: Profile Setup
      router.push('/auth/profile-setup');
    }, 400);
  };

  const handleResend = () => {
    setTimer(45);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]} edges={['top', 'bottom', 'left', 'right']}>
      {/* Top Header with Back button matching Screen 05 */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={28} color={theme.textPrimary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title Section matching Screen 05 */}
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Verify Your Number</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Enter the 6-digit code sent to {phoneNumber}
            </Text>
          </View>

          {/* 6 Digit Input Boxes matching Screen 05 */}
          <View style={styles.otpRow}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                style={[
                  styles.otpBox,
                  {
                    backgroundColor: theme.surfaceSecondary,
                    borderColor: digit ? theme.primary : theme.border,
                    color: theme.textPrimary
                  }
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={val => handleDigitChange(val, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                textAlign="center"
              />
            ))}
          </View>

          {/* Resend Timer matching Screen 05 */}
          <View style={styles.resendSection}>
            {timer > 0 ? (
              <Text style={[styles.resendText, { color: theme.textMuted }]}>
                Resend OTP in 00:{timer < 10 ? `0${timer}` : timer}
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend}>
                <Text style={[styles.resendAction, { color: theme.primary }]}>Resend OTP Code</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Continue Button matching Screen 05 */}
          <TouchableOpacity
            style={[styles.continueBtn, { backgroundColor: theme.primary }]}
            activeOpacity={0.85}
            onPress={handleContinue}
          >
            <Text style={styles.continueBtnText}>{loading ? 'Verifying...' : 'Continue'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerRow: {
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  backBtn: {
    padding: 6,
    alignSelf: 'flex-start'
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    flexGrow: 1
  },
  titleSection: {
    marginBottom: 36
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14.5,
    lineHeight: 22
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28
  },
  otpBox: {
    width: 48,
    height: 54,
    borderRadius: 12,
    borderWidth: 1.5,
    fontSize: 22,
    fontWeight: '700'
  },
  resendSection: {
    alignItems: 'center',
    marginBottom: 36
  },
  resendText: {
    fontSize: 14,
    fontWeight: '500'
  },
  resendAction: {
    fontSize: 14,
    fontWeight: '700'
  },
  continueBtn: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800'
  }
});

