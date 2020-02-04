import { isServer } from '../utils';

const DEFAULT_LANGUAGE = 'en';
const OTHER_LANGUAGES = [];
const DEFAULT_NAMESPACE = 'common';
// const LOCALE_PATH = 'static/locales'
// const LOCALE_PATH = 'public/locales';
const LOCALE_PATH = 'locales';
const LOCALE_STRUCTURE = '{{lng}}/{{ns}}';
const LOCALE_EXTENSION = 'json';

const config = {
  defaultLanguage: DEFAULT_LANGUAGE,
  otherLanguages: OTHER_LANGUAGES,
  load: 'currentOnly',
  localePath: LOCALE_PATH,
  localeStructure: LOCALE_STRUCTURE,
  localeExtension: LOCALE_EXTENSION,
  localeSubpaths: {},
  use: [],
  defaultNS: DEFAULT_NAMESPACE,
  interpolation: {
    escapeValue: false,
    formatSeparator: ',',
    format: (value, format) =>
      format === 'uppercase' ? value.toUpperCase() : value
  },
  browserLanguageDetection: true,
  serverLanguageDetection: true,
  // ignoreRoutes: ['/_next/', '/static/'],
  // ignoreRoutes: ['/_next/', '/public/'],
  ignoreRoutes: ['/_next/', '/public/'],
  customDetectors: [],
  detection: {
    lookupCookie: 'next-i18next',
    order: ['cookie', 'header', 'querystring'],
    caches: ['cookie']
  },
  react: {
    wait: true,
    useSuspense: false
  },
  strictMode: true,
  errorStackTraceLimit: 0,
  shallowRender: false,
  get initImmediate() {
    return !isServer();
  }
};

export default config;
