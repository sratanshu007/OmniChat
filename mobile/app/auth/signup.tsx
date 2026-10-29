import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Phone, Mail } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../src/theme/tokens';
import { useApp } from '../../src/context/AppContext';
import { ChatIndiaLogo } from '../../src/components/ChatIndiaLogo';

const GoogleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <Path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <Path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <Path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </Svg>
);

const AppleIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill={color}>
    <Path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.87-.9.04-1.99.6-2.63 1.35-.58.67-1.09 1.74-.95 2.78 1.01.08 2.04-.51 2.66-1.26z" />
  </Svg>
);

export default function SignUpScreen() {
  const router = useRouter();
  const { isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [fullName, setFullName] = useState('Rohan Sharma');
  const [mobileNumber, setMobileNumber] = useState('+91 98765 43210');
  const [email, setEmail] = useState('rohan@chatindia.app');
  const [loading, setLoading] = useState(false);

  const handleSignUp = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Navigate to Screen 05: OTP Verification
      router.push({
        pathname: '/auth/otp',
        params: { phone: mobileNumber, name: fullName }
      });
    }, 400);
  };

  const handleSocialSignUp = () => {
    router.push({
      pathname: '/auth/otp',
      params: { phone: mobileNumber, name: fullName }
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]} edges={['top', 'bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header matching Screen 04 */}
          <View style={styles.brandHeader}>
            <ChatIndiaLogo size={58} showText textColor={theme.textPrimary} isDark={isDarkMode} />
            <Text style={[styles.title, { color: theme.textPrimary }]}>Create Your Account</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Join ChatIndia today
            </Text>
          </View>

          {/* Form fields matching Screen 04 */}
          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Full Name</Text>
              <View
                style={[
                  styles.inputField,
                  { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }
                ]}
              >
                <User size={19} color={theme.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, { color: theme.textPrimary }]}
                  placeholder="Enter your full name"
                  placeholderTextColor={theme.textMuted}
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
            </View>

            {/* Mobile Number */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Mobile Number</Text>
              <View
                style={[
                  styles.inputField,
                  { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }
                ]}
              >
                <Phone size={19} color={theme.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, { color: theme.textPrimary }]}
                  placeholder="+91 98765 43210"
                  placeholderTextColor={theme.textMuted}
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Email (optional) */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Email (optional)</Text>
              <View
                style={[
                  styles.inputField,
                  { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }
                ]}
              >
                <Mail size={19} color={theme.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, { color: theme.textPrimary }]}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.signUpBtn, { backgroundColor: theme.primary }]}
              activeOpacity={0.85}
              onPress={handleSignUp}
            >
              <Text style={styles.signUpBtnText}>{loading ? 'Creating Account...' : 'Sign Up'}</Text>
            </TouchableOpacity>

            {/* Divider Or */}
            <View style={styles.dividerRow}>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
              <Text style={[styles.dividerText, { color: theme.textMuted }]}>Or</Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            </View>

            {/* Social Logins */}
            <View style={styles.socialGroup}>
              <TouchableOpacity
                style={[
                  styles.socialBtn,
                  { backgroundColor: theme.surface, borderColor: theme.border }
                ]}
                activeOpacity={0.8}
                onPress={handleSocialSignUp}
              >
                <GoogleIcon />
                <Text style={[styles.socialText, { color: theme.textPrimary }]}>
                  Continue with Google
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.socialBtn,
                  { backgroundColor: theme.surface, borderColor: theme.border }
                ]}
                activeOpacity={0.8}
                onPress={handleSocialSignUp}
              >
                <AppleIcon color={theme.textPrimary} />
                <Text style={[styles.socialText, { color: theme.textPrimary }]}>
                  Continue with Apple
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer Prompt */}
          <View style={styles.footerPrompt}>
            <Text style={[styles.footerPromptText, { color: theme.textSecondary }]}>
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={[styles.footerLink, { color: theme.primary }]}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 28,
    flexGrow: 1,
    justifyContent: 'space-between'
  },
  brandHeader: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 16,
    letterSpacing: -0.4
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500'
  },
  form: {
    width: '100%'
  },
  inputGroup: {
    marginBottom: 14
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14
  },
  inputIcon: {
    marginRight: 10
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    height: '100%'
  },
  signUpBtn: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3
  },
  signUpBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800'
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18
  },
  dividerLine: {
    flex: 1,
    height: 1
  },
  dividerText: {
    paddingHorizontal: 14,
    fontSize: 13,
    fontWeight: '600'
  },
  socialGroup: {
    gap: 12
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 50,
    borderRadius: 25,
    borderWidth: 1
  },
  socialText: {
    fontSize: 14,
    fontWeight: '700'
  },
  footerPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  footerPromptText: {
    fontSize: 14
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '800'
  }
});
