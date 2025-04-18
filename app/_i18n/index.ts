import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import trTranslations from './locales/tr.json'
import enTranslations from './locales/en.json'

const i18n = i18next.createInstance()

i18n
	.use(initReactI18next)
	.use(LanguageDetector)
	.init({
		resources: {
			tr: { translation: trTranslations },
			en: { translation: enTranslations }
		},
		lng: 'tr',
		fallbackLng: 'tr',
		supportedLngs: ['tr', 'en'],
		interpolation: {
			escapeValue: false
		},
		detection: {
			order: ['localStorage', 'navigator'],
			caches: ['localStorage']
		}
	})

export default i18n
