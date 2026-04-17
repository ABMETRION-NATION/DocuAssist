import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { ChevronRight, FileStack, Settings as SettingsIcon } from 'lucide-react-native';
import { colors, fonts, radii, shadow, spacing } from '../src/constants/theme';
import { DOCUMENT_TYPES, DOCUMENT_TYPE_LIST } from '../src/constants/documentTypes';
import { listDocuments, SavedDocument } from '../src/storage/documents';
import { Disclaimer } from '../src/components/Disclaimer';

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function HomeScreen() {
  const router = useRouter();
  const [recent, setRecent] = useState<SavedDocument[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      listDocuments().then((docs) => {
        if (active) setRecent(docs.slice(0, 3));
      });
      return () => { active = false; };
    }, [])
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>DocuAssist</Text>
            <Text style={styles.title}>Structured{'\n'}documents, done right.</Text>
          </View>
          <Pressable
            onPress={() => router.push('/settings')}
            style={styles.iconBtn}
            testID="home-settings-button"
          >
            <SettingsIcon size={20} color={colors.text.secondary} strokeWidth={1.6} />
          </Pressable>
        </View>

        {/* Quick actions */}
        <View style={styles.quickRow}>
          <Pressable
            style={styles.quickCard}
            onPress={() => router.push('/saved')}
            testID="home-saved-button"
          >
            <FileStack size={18} color={colors.accent.gold} strokeWidth={1.6} />
            <Text style={styles.quickText}>Saved Documents</Text>
            <ChevronRight size={16} color={colors.text.tertiary} strokeWidth={1.6} />
          </Pressable>
        </View>

        {/* Recent */}
        {recent.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Recent</Text>
            <FlatList
              data={recent}
              keyExtractor={(d) => d.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: spacing.lg }}
              renderItem={({ item }) => {
                const t = DOCUMENT_TYPES[item.typeId];
                const Icon = t?.icon;
                return (
                  <Pressable
                    style={styles.recentCard}
                    onPress={() => router.push({ pathname: '/preview', params: { id: item.id } })}
                    testID={`recent-doc-${item.id}`}
                  >
                    <View style={styles.recentIconWrap}>
                      {Icon && <Icon size={18} color={colors.accent.gold} strokeWidth={1.6} />}
                    </View>
                    <Text style={styles.recentTitle} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.recentMeta}>{t?.title || 'Document'}</Text>
                    <Text style={styles.recentDate}>{formatDate(item.updatedAt)}</Text>
                  </Pressable>
                );
              }}
            />
          </View>
        )}

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Create a document</Text>
          <View style={{ gap: 12 }}>
            {DOCUMENT_TYPE_LIST.map((doc) => {
              const Icon = doc.icon;
              return (
                <Pressable
                  key={doc.id}
                  style={({ pressed }) => [styles.card, pressed && { borderColor: colors.accent.gold }]}
                  onPress={() => router.push({ pathname: '/builder/[type]', params: { type: doc.id } })}
                  testID={`category-${doc.id}`}
                >
                  <View style={styles.cardIcon}>
                    <Icon size={22} color={colors.accent.gold} strokeWidth={1.5} />
                  </View>
                  <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>{doc.title}</Text>
                    <Text style={styles.cardTag}>{doc.tagline}</Text>
                  </View>
                  <ChevronRight size={18} color={colors.text.tertiary} strokeWidth={1.6} />
                </Pressable>
              );
            })}
          </View>
        </View>

        <Disclaimer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg.primary },
  scroll: { padding: spacing.lg, paddingBottom: 48 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  eyebrow: {
    color: colors.accent.gold,
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: {
    color: colors.text.primary,
    fontFamily: fonts.heading,
    fontSize: 30,
    lineHeight: 38,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.bg.secondary,
    borderWidth: 1,
    borderColor: colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickRow: { marginBottom: spacing.xl },
  quickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.bg.secondary,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radii.lg,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  quickText: {
    flex: 1,
    color: colors.text.primary,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    marginLeft: 8,
  },
  section: { marginBottom: spacing.xl },
  sectionLabel: {
    color: colors.text.secondary,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg.secondary,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radii.lg,
    padding: 18,
    gap: 14,
    ...shadow.soft,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: colors.accent.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { flex: 1, marginLeft: 4 },
  cardTitle: {
    color: colors.text.primary,
    fontFamily: fonts.heading,
    fontSize: 18,
    marginBottom: 4,
  },
  cardTag: {
    color: colors.text.secondary,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
  recentCard: {
    width: 220,
    backgroundColor: colors.bg.secondary,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radii.lg,
    padding: 16,
    marginRight: 12,
  },
  recentIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.accent.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  recentTitle: {
    color: colors.text.primary,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    marginBottom: 6,
  },
  recentMeta: {
    color: colors.accent.gold,
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  recentDate: {
    color: colors.text.tertiary,
    fontFamily: fonts.body,
    fontSize: 12,
  },
});
