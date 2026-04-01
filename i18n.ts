import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './messages/en.json';
import es from './messages/es.json';
import hi from './messages/hi.json';
import pt from './messages/pt.json';
import zh from './messages/zh.json';
import fr from './messages/fr.json';

const getInitialLang = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('devexchange_lang') || 'en';
  }
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      hi: { translation: hi },
      pt: { translation: pt },
      zh: { translation: zh },
      fr: { translation: fr }
    },
    lng: getInitialLang(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  });

export default i18n;
