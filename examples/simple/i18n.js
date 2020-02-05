import getConfig from 'next/config';

const NextI18Next = require('next-i18next-serverless').default;
// serverless deployments don`t have a filled publicRuntimeConfig, currently just an empty object

// localeSubpaths is changing the route to /de/second-page, on a refresh this page does simply not exist in pages folder

// const { localeSubpaths } = require('next/config').default().publicRuntimeConfig;

const localeSubpathVariations = {
  none: {},
  foreign: {
    de: 'de'
  },
  all: {
    en: 'en',
    de: 'de'
  }
};

const getNextI18NextInstance = nextConfig => {
  return new NextI18Next(nextConfig, {
    browserLanguageDetection: false,
    serverLanguageDetection: false,
    partialBundledLanguages: false,
    defaultLanguage: 'en',
    otherLanguages: ['de'],
    lng: 'en',
    allLanguages: ['en', 'de']
  });
};

module.exports = getNextI18NextInstance(getConfig());
