import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Camera } from 'lucide-react-native';
import { Colors } from '../../src/theme/tokens';
import { useApp } from '../../src/context/AppContext';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { user, updateUserProfile, isDarkMode, setIsAuthenticated, setHasCompletedOnboarding } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [displayName, setDisplayName] = useState(user.displayName || 'Rohan Sharma');
  const [username, setUsername] = useState('@' + (user.username || 'rohan'));
  const [avatarUrl, setAvatarUrl] = useState(
    user.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240'
  );
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    setLoading(true);
    const cleanUsername = username.replace('@', '').trim() || 'rohan';
    updateUserProfile({
      displayName: displayName.trim() || 'Rohan Sharma',
      username: cleanUsername,
      avatarUrl
    });
    setIsAuthenticated(true);
    setHasCompletedOnboarding(true);

    setTimeout(() => {
      setLoading(false);
      // Navigate to Screen 07/09: Main Chat List
      router.replace('/(tabs)/chats');
    }, 300);
  };

  const handlePickPhoto = () => {
    Alert.alert('Change Avatar', 'Choose an avatar photo or use default Rohan Sharma photo.');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.surface }]} edges={['top', 'bottom', 'left', 'right']}>
      {/* Top Header matching Screen 06 */}
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
          {/* Header Title matching Screen 06 */}
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Set Up Your Profile</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Add your photo and details
            </Text>
          </View>

          {/* Avatar Photo Container with Camera Badge */}
          <View style={styles.avatarContainer}>
            <TouchableOpacity
              style={styles.avatarWrapper}
              onPress={handlePickPhoto}
              activeOpacity={0.8}
            >
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
              <View style={[styles.cameraBadge, { backgroundColor: theme.primary }]}>
                <Camera size={18} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Input Fields matching Screen 06 */}
          <View style={styles.form}>
            {/* Display Name */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Display Name</Text>
              <TextInput
                style={[
                  styles.inputField,
                  {
                    backgroundColor: theme.surfaceSecondary,
                    borderColor: theme.border,
                    color: theme.textPrimary
                  }
                ]}
                placeholder="Your Display Name"
                placeholderTextColor={theme.textMuted}
                value={displayName}
                onChangeText={setDisplayName}
              />
            </View>

            {/* Username */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>Username</Text>
              <TextInput
                style={[
                  styles.inputField,
                  {
                    backgroundColor: theme.surfaceSecondary,
                    borderColor: theme.border,
                    color: theme.textPrimary
                  }
                ]}
                placeholder="@username"
                placeholderTextColor={theme.textMuted}
                value={username}
                onChangeText={val => setUsername(val.startsWith('@') ? val : `@${val}`)}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Next Button matching Screen 06 */}
          <TouchableOpacity
            style={[styles.nextBtn, { backgroundColor: theme.primary }]}
            activeOpacity={0.85}
            onPress={handleNext}
          >
            <Text style={styles.nextBtnText}>{loading ? 'Setting up...' : 'Next'}</Text>
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
    paddingTop: 16,
    paddingBottom: 36,
    flexGrow: 1,
    justifyContent: 'space-between'
  },
  titleSection: {
    marginBottom: 28
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14.5
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 18
  },
  avatarWrapper: {
    position: 'relative'
  },
  avatarImage: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 2,
    borderColor: '#E5E7EB'
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF'
  },
  form: {
    width: '100%',
    marginVertical: 20
  },
  inputGroup: {
    marginBottom: 18
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8
  },
  inputField: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '500'
  },
  nextBtn: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800'
  }
});

