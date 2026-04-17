import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, radii, spacing } from '../constants/theme';

type ToastTone = 'info' | 'success' | 'error';

interface ToastCtx {
  show: (msg: string, tone?: ToastTone) => void;
}

const Ctx = createContext<ToastCtx>({ show: () => {} });

export const useToast = () => useContext(Ctx);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [msg, setMsg] = useState<string | null>(null);
  const [tone, setTone] = useState<ToastTone>('info');
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((m: string, t: ToastTone = 'info') => {
    setMsg(m);
    setTone(t);
    Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }).start(() => {
        setMsg(null);
      });
    }, 2200);
  }, [opacity]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <Ctx.Provider value={{ show }}>
      {children}
      {msg && (
        <Animated.View pointerEvents="none" style={[styles.wrap, { opacity }]} testID="toast">
          <View style={[styles.toast, toneStyles[tone]]}>
            <Text style={styles.text}>{msg}</Text>
          </View>
        </Animated.View>
      )}
    </Ctx.Provider>
  );
};

const toneStyles: Record<ToastTone, any> = {
  info: { borderColor: colors.accent.gold },
  success: { borderColor: colors.status.success },
  error: { borderColor: colors.status.error },
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  toast: {
    backgroundColor: colors.bg.elevated,
    borderRadius: radii.md,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderWidth: 1,
    maxWidth: 420,
  },
  text: {
    color: colors.text.primary,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
  },
});
