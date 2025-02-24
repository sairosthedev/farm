import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useAuth } from './(auth)/AuthContext';
import { Stack } from 'expo-router';

const SETTINGS_SECTIONS = [
  {
    title: 'Account',
    items: [
      { id: 'profile', title: 'Edit Profile', icon: 'person', type: 'link' },
      { id: 'password', title: 'Change Password', icon: 'lock-closed', type: 'link' },
      { id: 'notifications', title: 'Notifications', icon: 'notifications', type: 'toggle' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { id: 'language', title: 'Language', icon: 'language', type: 'link', value: 'English' },
      { id: 'currency', title: 'Currency', icon: 'cash', type: 'link', value: 'USD' },
      { id: 'darkMode', title: 'Dark Mode', icon: 'moon', type: 'toggle' },
    ],
  },
  {
    title: 'Privacy & Security',
    items: [
      { id: 'privacy', title: 'Privacy Settings', icon: 'shield', type: 'link' },
      { id: 'location', title: 'Location Services', icon: 'location', type: 'toggle' },
      { id: 'dataUsage', title: 'Data Usage', icon: 'analytics', type: 'link' },
    ],
  },
  {
    title: 'Support',
    items: [
      { id: 'help', title: 'Help Center', icon: 'help-circle', type: 'link' },
      { id: 'about', title: 'About', icon: 'information-circle', type: 'link' },
      { id: 'feedback', title: 'Send Feedback', icon: 'mail', type: 'link' },
    ],
  },
];

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    location: true,
  });
  const { user } = useAuth();

  const handleToggle = (settingId: string) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: !prev[settingId as keyof typeof prev],
    }));
  };

  const handlePress = (item: { id: string; type: string; title: string }) => {
    if (item.type === 'toggle') {
      handleToggle(item.id);
    } else {
      // Handle navigation or show coming soon alert
      alert(`${item.title} settings coming soon!`);
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Settings',
          headerStyle: {
            backgroundColor: '#FFF',
          },
          headerShadowVisible: false,
        }}
      />
      <ScrollView style={styles.container}>
        {SETTINGS_SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.settingItem}
                  onPress={() => handlePress(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingMain}>
                    <View style={styles.settingIcon}>
                      <Ionicons name={item.icon as any} size={22} color="#2D6A4F" />
                    </View>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                  </View>
                  {item.type === 'toggle' ? (
                    <Switch
                      value={settings[item.id as keyof typeof settings]}
                      onValueChange={() => handleToggle(item.id)}
                      trackColor={{ false: '#E0E0E0', true: '#90CCA5' }}
                      thumbColor={settings[item.id as keyof typeof settings] ? '#2D6A4F' : '#FFF'}
                    />
                  ) : (
                    <View style={styles.settingAction}>
                      {item.value && (
                        <Text style={styles.settingValue}>{item.value}</Text>
                      )}
                      <Ionicons name="chevron-forward" size={20} color="#666" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  sectionContent: {
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F0F7F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
  },
  settingAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  versionContainer: {
    padding: 24,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#666',
  },
}); 