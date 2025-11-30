import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { setAppLanguage } from '@/lib/i18n';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const LANGS: Array<{ code: 'en' | 'fr' | 'es' | 'zh' }> = [
  { code: 'en' },
  { code: 'fr' },
  { code: 'es' },
  { code: 'zh' }
];

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [open, setOpen] = useState(false);

  const handleSelect = async (code: 'en' | 'fr' | 'es' | 'zh') => {
    setOpen(false);
    await setAppLanguage(code);
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        hitSlop={8}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: colors.background, opacity: pressed ? 0.7 : 1 }
        ]}
      >
        <FontAwesome name="globe" size={18} color={colors.text} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={[styles.sheet, { backgroundColor: colors.background }]}>
            {LANGS.map(({ code }) => {
              const selected = i18n.language === code;
              return (
                <Pressable
                  key={code}
                  onPress={() => handleSelect(code)}
                  style={({ pressed }) => [
                    styles.row,
                    { borderColor: colors.text + '20', opacity: pressed ? 0.7 : 1 }
                  ]}
                >
                  <Text style={[styles.lang, { color: colors.text }]}>
                    {t(`languageNames.${code}`)}
                  </Text>
                  {selected && (
                    <FontAwesome name="check" size={14} color={colors.tint} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end'
  },
  sheet: {
    margin: 16,
    borderRadius: 12,
    paddingVertical: 8,
    overflow: 'hidden'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1
  },
  lang: {
    fontSize: 16,
    fontWeight: '600'
  }
});


