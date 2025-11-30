export const getDateLocale = (lang: string): string => {
  switch (lang) {
    case 'fr':
      return 'fr-FR';
    case 'es':
      return 'es-ES';
    case 'zh':
      return 'zh-CN';
    default:
      return 'en-US';
  }
};


