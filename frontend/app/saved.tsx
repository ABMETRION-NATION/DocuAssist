import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight, FileText, Search } from 'lucide-react-native';
import { colors, fonts, radii, spacing } from '../src/constants/theme';
import { DOCUMENT_TYPES } from '../src/constants/documentTypes';
import { listDocuments, SavedDocument } from '../src/storage/documents';

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return ''; }
}

export default function SavedScreen() {
  const router = useRouter();
  const [docs, setDocs] = useState<SavedDocument[]>([]);
  const [query, setQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      let active = true;
      listDocuments().then((d) => { if (active) setDocs(d); });
      return () => { active = false; };
    }, [])
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return docs;
    return docs.filter((d) => {
      const type = DOCUMENT_TYPES[d.typeId]?.title || '';
      return d.title.toLowerCase().includes(q) || type.toLowerCase().includes(q);
    });
  }, [docs, query]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} testID="saved-back">
          <ArrowLeft size={20} color={colors.text.primary} strokeWidth={1.6} />
        </Pressable>
        <Text style={styles.topTitle}>Saved Documents</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.searchWrap}>
        <Search size={16} color={colors.text.tertiary} strokeWidth={1.6} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by title or type"
          placeholderTextColor={colors.text.tertiary}
          style={styles.searchInput}
          testID="saved-search"
        />
      </View>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <FileText size={28} color={colors.accent.gold} strokeWidth={1.4} />
          </View>
          <Text style={styles.emptyTitle}>
            {docs.length === 0 ? 'No documents saved yet' : 'No matches'}
          </Text>
          <Text style={styles.emptySub}>
            {docs.length === 0
              ? 'Start by creating a new document from the home screen.'
              : 'Try a different search term.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(d) => d.id}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => {
            const type = DOCUMENT_TYPES[item.typeId];
            const Icon = type?.icon || FileText;
            return (
              <Pressable
                style={({ pressed }) => [styles.row, pressed && { borderColor: colors.accent.gold }]}
                onPress={() => router.push({ pathname: '/preview', params: { id: item.id } })}
                testID={`saved-row-${item.id}`}
              >
                <View style={styles.rowIcon}>
                  <Icon size={18} color={colors.accent.gold} strokeWidth={1.5} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.rowMeta}>
                    {type?.title || 'Document'} · {formatDate(item.updatedAt)}
                  </Text>
                </View>
                <ChevronRight size={16} color={colors.text.tertiary} strokeWidth={1.6} />
              </Pressable>
            );
          }}
        />
      )}
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
  topTitle: {
    color: colors.text.primary, fontFamily: fonts.heading, fontSize: 18,
  },
  searchWrap: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.bg.secondary,
    borderWidth: 1, borderColor: colors.border.default,
    borderRadius: radii.md,
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    color: colors.text.primary,
    fontFamily: fonts.body,
    fontSize: 14,
    paddingVertical: 12,
    marginLeft: 6,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.bg.secondary,
    borderWidth: 1, borderColor: colors.border.default,
    borderRadius: radii.lg, padding: 16,
  },
  rowIcon: {
    width: 40, height: 40, borderRadius: radii.md,
    backgroundColor: colors.accent.goldSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  rowTitle: { color: colors.text.primary, fontFamily: fonts.bodyBold, fontSize: 15 },
  rowMeta: { color: colors.text.secondary, fontFamily: fonts.body, fontSize: 12, marginTop: 4 },
  empty: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: 10,
  },
  emptyIcon: {
    width: 64, height: 64, borderRadius: radii.lg,
    backgroundColor: colors.accent.goldSoft,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  emptyTitle: { color: colors.text.primary, fontFamily: fonts.heading, fontSize: 20 },
  emptySub: { color: colors.text.secondary, fontFamily: fonts.body, fontSize: 14, textAlign: 'center', maxWidth: 280 },
});
