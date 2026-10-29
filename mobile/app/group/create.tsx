import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Check, Users, Camera, ArrowRight } from 'lucide-react-native';
import { Colors } from '../../src/theme/tokens';
import { useApp } from '../../src/context/AppContext';
import { Header } from '../../src/components/Header';
import { Button } from '../../src/components/Button';

export default function CreateGroupScreen() {
  const router = useRouter();
  const { friends, createGroupChat, isDarkMode } = useApp();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

  const toggleSelectFriend = (id: string) => {
    if (selectedFriends.includes(id)) {
      setSelectedFriends(selectedFriends.filter(item => item !== id));
    } else {
      setSelectedFriends([...selectedFriends, id]);
    }
  };

  const handleCreate = () => {
    if (!groupName.trim()) {
      Alert.alert('Group Name Required', 'Please enter a name for this group chat.');
      return;
    }
    if (selectedFriends.length === 0) {
      Alert.alert('Select Contacts', 'Please select at least 1 contact to join the group.');
      return;
    }

    const newGroupId = createGroupChat(groupName.trim(), selectedFriends);
    router.replace(`/chat/${newGroupId}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom', 'left', 'right']}>
      <Header
        title="Create New Group"
        showBack
        onBack={() => router.back()}
        isDark={isDarkMode}
      />

      <View style={[styles.formCard, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <View style={styles.topRow}>
          <View style={[styles.groupPhotoPlaceholder, { backgroundColor: theme.surfaceSecondary }]}>
            <Users size={28} color={theme.primary} />
            <View style={[styles.cameraBadge, { backgroundColor: theme.primary }]}>
              <Camera size={11} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.inputCol}>
            <TextInput
              style={[styles.nameInput, { color: theme.textPrimary, borderBottomColor: theme.border }]}
              placeholder="Group Subject / Name..."
              placeholderTextColor={theme.textMuted}
              value={groupName}
              onChangeText={setGroupName}
            />
            <TextInput
              style={[styles.descInput, { color: theme.textSecondary }]}
              placeholder="Add optional group description..."
              placeholderTextColor={theme.textMuted}
              value={description}
              onChangeText={setDescription}
            />
          </View>
        </View>
      </View>

      {/* Selected Members Counter */}
      <View style={[styles.counterBar, { backgroundColor: theme.surfaceSecondary, borderBottomColor: theme.border }]}>
        <Text style={[styles.counterText, { color: theme.textSecondary }]}>
          SELECT MEMBERS ({selectedFriends.length} selected)
        </Text>
      </View>

      {/* Friends Selection List */}
      <FlatList
        data={friends}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedFriends.includes(item.id);
          return (
            <TouchableOpacity
              style={[styles.friendRow, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}
              onPress={() => toggleSelectFriend(item.id)}
              activeOpacity={0.7}
            >
              <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
              <View style={styles.info}>
                <Text style={[styles.name, { color: theme.textPrimary }]}>{item.displayName}</Text>
                <Text style={[styles.upi, { color: theme.textMuted }]}>{item.upiId}</Text>
              </View>

              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: isSelected ? theme.primary : theme.border,
                    backgroundColor: isSelected ? theme.primary : 'transparent'
                  }
                ]}
              >
                {isSelected && <Check size={14} color="#FFFFFF" />}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <Button
          title={`Create Group (${selectedFriends.length} members)`}
          onPress={handleCreate}
          variant="primary"
          size="lg"
          icon={<ArrowRight size={18} color="#FFFFFF" />}
          disabled={!groupName.trim() || selectedFriends.length === 0}
          isDark={isDarkMode}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  formCard: {
    padding: 16,
    borderBottomWidth: 1
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14
  },
  groupPhotoPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF'
  },
  inputCol: {
    flex: 1
  },
  nameInput: {
    fontSize: 16,
    fontWeight: '700',
    paddingVertical: 6,
    borderBottomWidth: 1
  },
  descInput: {
    fontSize: 13,
    paddingVertical: 6
  },
  counterBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1
  },
  counterText: {
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.5
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 10,
    marginRight: 12
  },
  info: {
    flex: 1
  },
  name: {
    fontSize: 14.5,
    fontWeight: '700'
  },
  upi: {
    fontSize: 12
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottomBar: {
    padding: 16,
    borderTopWidth: 1
  }
});
