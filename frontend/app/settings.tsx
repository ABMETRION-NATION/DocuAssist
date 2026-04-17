import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Info, Moon, Trash2 } from 'lucide-react-native';
import { colors, fonts, radii, spacing } from '../src/constants/theme';
import { Disclaimer } from '../src/components/Disclaimer';
import { clearAllDocuments } from '../src/storage/documents';
import { useToast } from '../src/components/Toast';

export default function SettingsScreen() {
  const router = useRouter();
  const toast = useToast();
  const [darkMode, setDarkMode] = useState(true);

  const onClearData = () => {
    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm('Delete all saved documents? This cannot be undone.')) {
        void doClear();
      }
      return;
    }
    Alert.alert(
      'Clear all data',
      'This will permanently delete all saved documents on this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete all', style: 'destructive', onPress: () => void doClear() },
      ],
    );
  };

  const doClear = async () => {
    await clearAllDocuments();
    toast.show('All saved documents cleared', 'success');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} testID="settings-back">
          <ArrowLeft size={20} color={colors.text.primary} strokeWidth={1.6} />
        </Pressable>
        <Text style={styles.topTitle}>Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.card}>
          <Pressable
            style={styles.socialBtn}
            onPress={() => toast.show('Google sign-in coming soon')}
            testID="settings-google-login"
          >
            <View style={styles.googleMark}>
              <Text style={styles.googleMarkText}>G</Text>
            </View>
            <Text style={styles.socialLabel}>Continue with Google</Text>
          </Pressable>
          <View style={styles.divider} />
          <Pressable
            style={styles.socialBtn}
            onPress={() => toast.show('Facebook sign-in coming soon')}
            testID="settings-facebook-login"
          >
            <View style={styles.facebookMark}>
              <Text style={styles.facebookMarkText}>f</Text>
            </View>
            <Text style={styles.socialLabel}>Continue with Facebook</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>Appearance</Text>
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}>
                <Moon size={16} color={colors.accent.gold} strokeWidth={1.6} />
              </View>
              <View>
                <Text style={styles.rowTitle}>Dark mode</Text>
                <Text style={styles.rowSub}>Recommended for document readability</Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={(v) => {
                setDarkMode(v);
                if (!v) toast.show('Light theme coming soon — dark remains active');
              }}
              trackColor={{ false: colors.border.default, true: colors.accent.purple }}
              thumbColor={darkMode ? colors.accent.gold : colors.text.tertiary}
              testID="settings-theme-toggle"
            />
          </View>
        </View>

        <Text style={styles.sectionLabel}>Data</Text>
        <View style={styles.card}>
          <Pressable
            style={styles.rowBetween}
            onPress={onClearData}
            testID="settings-clear-data"
          >
            <View style={styles.rowLeft}>
              <View style={[styles.rowIcon, { backgroundColor: 'rgba(158, 71, 71, 0.18)' }]}>
                <Trash2 size={16} color={colors.status.error} strokeWidth={1.6} />
              </View>
              <View>
                <Text style={[styles.rowTitle, { color: colors.status.error }]}>Clear saved documents</Text>
                <Text style={styles.rowSub}>Permanently removes all local data</Text>
              </View>
            </View>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>About</Text>
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={styles.rowLeft}>
              <View style={styles.rowIcon}>
                <Info size={16} color={colors.accent.gold} strokeWidth={1.6} />
              </View>
              <View>
                <Text style={styles.rowTitle}>DocuAssist</Text>
                <Text style={styles.rowSub}>Version 1.0.0 · Structured document builder</Text>
              </View>
            </View>
          </View>
        </View>

        <Disclaimer />

        <Text style={styles.footerText}>
          All documents are stored locally on your device. Nothing is sent to a server.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg.primary },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border.subtle,
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: radii.md,
    backgroundColor: colors.bg.secondary,
    borderWidth: 1, borderColor: colors.border.default,
    alignItems: 'center', justifyContent: 'center',
  },
  topTitle: { color: colors.text.primary, fontFamily: fonts.heading, fontSize: 18 },
  scroll: { padding: spacing.lg, paddingBottom: 40 },
  sectionLabel: {
    color: colors.text.secondary,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: colors.bg.secondary,
    borderWidth: 1, borderColor: colors.border.default,
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  rowBetween: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  rowIcon: {
    width: 36, height: 36, borderRadius: radii.md,
    backgroundColor: colors.accent.goldSoft,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  rowTitle: { color: colors.text.primary, fontFamily: fonts.bodyBold, fontSize: 14 },
  rowSub: { color: colors.text.secondary, fontFamily: fonts.body, fontSize: 12, marginTop: 3 },
  socialBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  socialLabel: { color: colors.text.primary, fontFamily: fonts.bodyMedium, fontSize: 14 },
  googleMark: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center', marginRight: 8,
  },
  googleMarkText: { color: '#4285F4', fontFamily: fonts.bodyBold, fontSize: 16 },
  facebookMark: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: '#1877F2',
    alignItems: 'center', justifyContent: 'center', marginRight: 8,
  },
  facebookMarkText: { color: '#FFFFFF', fontFamily: fonts.bodyBold, fontSize: 16 },
  divider: { height: 1, backgroundColor: colors.border.default, marginHorizontal: 16 },
  footerText: {
    color: colors.text.tertiary,
    fontFamily: fonts.body,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 18,
  },
});
