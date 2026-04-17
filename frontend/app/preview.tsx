import React, { useCallback, useEffect, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Copy, Download, Pencil, Share2, Trash2 } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { colors, fonts, radii, shadow, spacing } from '../src/constants/theme';
import { DOCUMENT_TYPES } from '../src/constants/documentTypes';
import { deleteDocument, getDocument, SavedDocument } from '../src/storage/documents';
import { renderDocument } from '../src/utils/templates';
import { Button } from '../src/components/Button';
import { Disclaimer } from '../src/components/Disclaimer';
import { useToast } from '../src/components/Toast';

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildPdfHtml(title: string, text: string) {
  const body = escapeHtml(text).replace(/\n/g, '<br/>');
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<style>
  @page { size: Letter; margin: 0.9in; }
  body { font-family: 'Times New Roman', Georgia, serif; color: #111; font-size: 12pt; line-height: 1.55; }
  .doc { white-space: pre-wrap; }
</style>
</head><body><div class="doc">${body}</div></body></html>`;
}

export default function PreviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const toast = useToast();

  const [doc, setDoc] = useState<SavedDocument | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    const found = await getDocument(id);
    setDoc(found);
    setLoading(false);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Loading document…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!doc) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Document not found.</Text>
          <Button label="Go Home" onPress={() => router.replace('/')} />
        </View>
      </SafeAreaView>
    );
  }

  const type = DOCUMENT_TYPES[doc.typeId];
  const text = renderDocument(doc.typeId, doc.data);

  const onCopy = async () => {
    await Clipboard.setStringAsync(text);
    toast.show('Copied to clipboard', 'success');
  };

  const onShare = async () => {
    try {
      await Share.share({ message: text, title: doc.title });
    } catch {
      toast.show('Sharing not available', 'error');
    }
  };

  const onExportPdf = async () => {
    try {
      const html = buildPdfHtml(doc.title, text);
      const { uri } = await Print.printToFileAsync({ html });
      if (Platform.OS === 'web') {
        toast.show('PDF generated', 'success');
        return;
      }
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: doc.title });
      } else {
        toast.show('PDF saved to device', 'success');
      }
    } catch {
      toast.show('Could not generate PDF', 'error');
    }
  };

  const onEdit = () => {
    router.push({
      pathname: '/builder/[type]',
      params: { type: doc.typeId, id: doc.id, prefill: JSON.stringify(doc.data) },
    });
  };

  const onDelete = async () => {
    await deleteDocument(doc.id);
    toast.show('Document deleted', 'success');
    router.replace('/saved');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.iconBtn} testID="preview-back">
          <ArrowLeft size={20} color={colors.text.primary} strokeWidth={1.6} />
        </Pressable>
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <Text style={styles.topEyebrow} numberOfLines={1}>{type?.title}</Text>
          <Text style={styles.topTitle} numberOfLines={1}>{doc.title}</Text>
        </View>
        <Pressable onPress={onDelete} style={styles.iconBtn} testID="preview-delete">
          <Trash2 size={18} color={colors.status.error} strokeWidth={1.6} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.paper} testID="preview-paper">
          <Text style={styles.paperText} selectable>
            {text}
          </Text>
        </View>

        <Disclaimer compact />

        <View style={styles.actionGrid}>
          <ActionTile icon={<Copy size={18} color={colors.accent.gold} strokeWidth={1.6} />} label="Copy" onPress={onCopy} testID="action-copy" />
          <ActionTile icon={<Share2 size={18} color={colors.accent.gold} strokeWidth={1.6} />} label="Share" onPress={onShare} testID="action-share" />
          <ActionTile icon={<Download size={18} color={colors.accent.gold} strokeWidth={1.6} />} label="Export PDF" onPress={onExportPdf} testID="action-pdf" />
          <ActionTile icon={<Pencil size={18} color={colors.accent.gold} strokeWidth={1.6} />} label="Edit" onPress={onEdit} testID="action-edit" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ActionTile: React.FC<{ icon: React.ReactNode; label: string; onPress: () => void; testID?: string }> = ({ icon, label, onPress, testID }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [styles.actionTile, pressed && { borderColor: colors.accent.gold }]}
    testID={testID}
  >
    <View style={styles.actionIcon}>{icon}</View>
    <Text style={styles.actionLabel}>{label}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg.primary },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: radii.md,
    backgroundColor: colors.bg.secondary,
    borderWidth: 1, borderColor: colors.border.default,
    alignItems: 'center', justifyContent: 'center',
  },
  topEyebrow: {
    color: colors.accent.gold,
    fontFamily: fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  topTitle: {
    color: colors.text.primary,
    fontFamily: fonts.bodyBold,
    fontSize: 15,
    marginTop: 2,
  },
  scroll: { padding: spacing.lg, paddingBottom: 40 },
  paper: {
    backgroundColor: colors.paper.bg,
    borderRadius: radii.lg,
    padding: 26,
    marginBottom: 20,
    ...shadow.elevated,
    borderWidth: 1,
    borderColor: colors.paper.border,
  },
  paperText: {
    color: colors.paper.text,
    fontFamily: fonts.document,
    fontSize: 15,
    lineHeight: 23,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 10,
  },
  actionTile: {
    flexGrow: 1,
    flexBasis: '47%',
    backgroundColor: colors.bg.secondary,
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: radii.lg,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    gap: 10,
  },
  actionIcon: {
    width: 38, height: 38, borderRadius: radii.md,
    backgroundColor: colors.accent.goldSoft,
    alignItems: 'center', justifyContent: 'center',
  },
  actionLabel: {
    color: colors.text.primary,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
  },
  empty: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: 16,
  },
  emptyText: { color: colors.text.secondary, fontFamily: fonts.body, fontSize: 15 },
});
