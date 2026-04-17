import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import { DOCUMENT_TYPES, FieldSchema } from '../../src/constants/documentTypes';
import { colors, fonts, radii, spacing } from '../../src/constants/theme';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { ProgressBar } from '../../src/components/ProgressBar';
import { deriveDocumentTitle } from '../../src/utils/templates';
import { saveDocument } from '../../src/storage/documents';
import { useToast } from '../../src/components/Toast';

export default function BuilderScreen() {
  const router = useRouter();
  const { type, id, prefill } = useLocalSearchParams<{ type: string; id?: string; prefill?: string }>();
  const toast = useToast();

  const schema = DOCUMENT_TYPES[type];
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<Record<string, string>>(() => {
    if (prefill) {
      try { return JSON.parse(prefill as string); } catch { return {}; }
    }
    return {};
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const steps = schema?.steps || [];
  const currentStep = steps[stepIndex];

  const isLast = stepIndex === steps.length - 1;

  const keyboardType = (f: FieldSchema) =>
    f.type === 'email' ? 'email-address' : f.type === 'phone' ? 'phone-pad' : 'default';

  const validateStep = () => {
    const next: Record<string, string> = {};
    currentStep.fields.forEach((f) => {
      const val = (data[f.key] || '').trim();
      if (f.required && !val) {
        next[f.key] = 'This field is required';
      }
      if (f.type === 'email' && val && !/^\S+@\S+\.\S+$/.test(val)) {
        next[f.key] = 'Enter a valid email';
      }
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onNext = () => {
    if (!validateStep()) {
      toast.show('Please complete required fields', 'error');
      return;
    }
    setErrors({});
    if (isLast) {
      onFinish();
    } else {
      setStepIndex((i) => Math.min(steps.length - 1, i + 1));
    }
  };

  const onBack = () => {
    setErrors({});
    if (stepIndex === 0) {
      router.back();
    } else {
      setStepIndex((i) => Math.max(0, i - 1));
    }
  };

  const onFinish = async () => {
    setSaving(true);
    try {
      const title = deriveDocumentTitle(type, data);
      const saved = await saveDocument({
        id: id as string | undefined,
        typeId: type,
        title,
        data,
      });
      toast.show('Document saved', 'success');
      router.replace({ pathname: '/preview', params: { id: saved.id } });
    } catch {
      toast.show('Could not save document', 'error');
    } finally {
      setSaving(false);
    }
  };

  const progress = useMemo(() => ({
    current: stepIndex + 1,
    total: steps.length,
  }), [stepIndex, steps.length]);

  if (!schema) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorWrap}>
          <Text style={styles.errorText}>Unknown document type.</Text>
          <Button label="Go Home" onPress={() => router.replace('/')} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <View style={styles.topBar}>
          <Pressable onPress={onBack} style={styles.backBtn} testID="builder-back-button">
            <ArrowLeft size={20} color={colors.text.primary} strokeWidth={1.6} />
          </Pressable>
          <Text style={styles.topTitle} numberOfLines={1}>{schema.title}</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ProgressBar current={progress.current} total={progress.total} label={currentStep.title} />

          <Text style={styles.stepTitle}>{currentStep.title}</Text>
          {currentStep.subtitle && <Text style={styles.stepSub}>{currentStep.subtitle}</Text>}

          <View style={{ marginTop: 20 }}>
            {currentStep.fields.map((f) => (
              <Input
                key={f.key}
                label={f.label + (f.required ? ' *' : '')}
                value={data[f.key] || ''}
                onChangeText={(v) => setData((d) => ({ ...d, [f.key]: v }))}
                placeholder={f.placeholder}
                helper={f.helper}
                error={errors[f.key] || null}
                multiline={f.multiline}
                keyboardType={keyboardType(f)}
                autoCapitalize={f.type === 'email' ? 'none' : 'sentences'}
                testID={`field-${f.key}`}
              />
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            label={stepIndex === 0 ? 'Cancel' : 'Back'}
            onPress={onBack}
            variant="secondary"
            style={{ flex: 1 }}
            testID="builder-back-cta"
          />
          <Button
            label={isLast ? 'Generate Document' : 'Continue'}
            onPress={onNext}
            loading={saving}
            icon={!isLast ? <ChevronRight size={16} color={colors.text.inverse} strokeWidth={2} /> : undefined}
            style={{ flex: 1.4 }}
            testID="builder-next-cta"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg.primary },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.subtle,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.bg.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    color: colors.text.primary,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    marginHorizontal: 12,
  },
  scroll: { padding: spacing.lg, paddingBottom: 24 },
  stepTitle: {
    color: colors.text.primary,
    fontFamily: fonts.heading,
    fontSize: 26,
    marginBottom: 6,
  },
  stepSub: {
    color: colors.text.secondary,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: spacing.lg,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colors.bg.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
  errorWrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: 16,
  },
  errorText: { color: colors.text.primary, fontFamily: fonts.body, fontSize: 16 },
});
