// const NextI18Next = require('next-i18next-serverless').default;
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

// module.exports = new NextI18Next({
//   otherLanguages: ['de'],
//   // localeSubpaths: localeSubpathVariations[localeSubpaths]
//   localeSubpaths: localeSubpathVariations['all']
// });

// const common = require('./static/locales/en/common.json'); // Wherever you have your common locale

// const NextI18NextInstance = new NextI18Next({
//   browserLanguageDetection: false,
//   serverLanguageDetection: false,
//   partialBundledLanguages: false,
//   defaultLanguage: 'en',
//   // ns: ['common', 'footer', 'secondPage'],
//   // defaultNS: 'common',
//   otherLanguages: ['de'],
//   // resources: {
//   //   en: {
//   //     common: require('./static/locales/en/common.json'),
//   //     footer: require('./static/locales/en/footer.json'),
//   //     secondPage: require('./static/locales/en/secondPage.json')
//   //   },
//   //   de: {
//   //     common: require('./static/locales/de/common.json'),
//   //     footer: require('./static/locales/de/footer.json'),
//   //     secondPage: require('./static/locales/de/secondPage.json')
//   //   }
//   // },

//   // fallbackLng: 'en',
//   lng: 'en',
//   allLanguages: ['en', 'de']

//   // localeSubpaths: { none: {} },
//   // localeSubpaths: localeSubpathVariations['all']
//   // localePath: path.join(__dirname, 'static', 'locales') // Wherever you have your common locale

// });

// module.exports = NextI18NextInstance;
let NextI18NextInstance;
let getNextI18NextInstance = function(nextConfig) {
  if (NextI18NextInstance == null || NextI18NextInstance == undefined) {
    if (nextConfig == null) {
      console.warn('nextConfig in NextI18Next', nextConfig);
    }
    console.log('nextConfig in NextI18Next', nextConfig);

    NextI18NextInstance = new NextI18Next(nextConfig, {
      browserLanguageDetection: false,
      serverLanguageDetection: false,
      partialBundledLanguages: false,
      defaultLanguage: 'en',
      // ns: ['common', 'footer', 'secondPage'],
      // defaultNS: 'common',
      otherLanguages: ['de'],
      // resources: {
      //   en: {
      //     common: require('./static/locales/en/common.json'),
      //     footer: require('./static/locales/en/footer.json'),
      //     secondPage: require('./static/locales/en/secondPage.json')
      //   },
      //   de: {
      //     common: require('./static/locales/de/common.json'),
      //     footer: require('./static/locales/de/footer.json'),
      //     secondPage: require('./static/locales/de/secondPage.json')
      //   }
      // },

      // fallbackLng: 'en',
      lng: 'en',
      allLanguages: ['en', 'de']

      // localeSubpaths: { none: {} },
      // localeSubpaths: localeSubpathVariations['all']
      // localePath: path.join(__dirname, 'static', 'locales') // Wherever you have your common locale
    });
  }

  console.log('NextI18NextInstance: ', NextI18NextInstance);

  return NextI18NextInstance;
};

// module.exports = getNextI18NextInstance;
module.exports = getNextI18NextInstance;
