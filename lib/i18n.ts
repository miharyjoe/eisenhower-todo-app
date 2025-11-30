import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';

const en = require('../locales/en.json');
const fr = require('../locales/fr.json');
const es = require('../locales/es.json');
const zh = require('../locales/zh.json');

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  es: { translation: es },
  zh: { translation: zh },
};

const toSupportedLanguage = (tag: string | undefined): 'en' | 'fr' | 'es' | 'zh' => {
  if (!tag) return 'en';
  const lower = tag.toLowerCase();
  if (lower.startsWith('fr')) return 'fr';
  if (lower.startsWith('es')) return 'es';
  if (lower.startsWith('zh')) return 'zh';
  return 'en';
};

const deviceLanguageTag = getLocales?.()[0]?.languageTag;
const initialLanguage = toSupportedLanguage(deviceLanguageTag);

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLanguage,
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr', 'es', 'zh'],
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v3',
  })
  .then(() => {
    AsyncStorage.getItem('appLanguage').then(saved => {
      if (saved && ['en', 'fr', 'es', 'zh'].includes(saved)) {
        i18n.changeLanguage(saved);
      }
    });
  });

export const setAppLanguage = async (lang: 'en' | 'fr' | 'es' | 'zh') => {
  await i18n.changeLanguage(lang);
  await AsyncStorage.setItem('appLanguage', lang);
};

export default i18n;


