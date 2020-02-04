import fs from 'fs';
import path from 'path';

import { isServer } from '../utils';
import defaultConfig from './default-config';

// import getConfig from 'next/config';
const isBrowser = typeof window !== 'undefined';

const deepMergeObjects = ['backend', 'detection'];

export default (nextConfig, userConfig) => {
  // const { publicRuntimeConfig } = getConfig();

  // const { PROJECT_ROOT } = publicRuntimeConfig;

  // console.log('PROJECT_ROOT from i18n-next: ', PROJECT_ROOT);

  console.log('nextConfig in create-config is: ', nextConfig);

  let PROJECT_ROOT;
  if (nextConfig != null) {
    const { publicRuntimeConfig } = nextConfig;
    PROJECT_ROOT = publicRuntimeConfig.PROJECT_ROOT;
  } else {
    PROJECT_ROOT = process.cwd();
  }

  console.log('PROJECT_ROOT from i18n-next: ', PROJECT_ROOT);

  if (typeof userConfig.localeSubpaths === 'string') {
    throw new Error(
      'The localeSubpaths option has been changed to an object. Please refer to documentation.'
    );
  }

  // Initial merge of default and user-provided config
  const combinedConfig = {
    ...defaultConfig,
    ...userConfig
  };

  // Sensible defaults to prevent user duplication
  combinedConfig.allLanguages = combinedConfig.otherLanguages.concat([
    combinedConfig.defaultLanguage
  ]);
  combinedConfig.whitelist = combinedConfig.allLanguages;

  const {
    allLanguages,
    defaultLanguage,
    localeExtension,
    localePath,
    localeStructure
  } = combinedConfig;

  if (isServer()) {
    // const fs = require('fs');
    // const path = require('path');

    // const localePathPublic = `/public/${localePath}`;

    let localePathPublic = ``;

    const locales = !isBrowser
      ? fs.existsSync(
          path.join(
            PROJECT_ROOT ? PROJECT_ROOT : process.cwd(),
            './locales/en/common.json'
          )
        )
      : false;

    const publicLocales = !isBrowser
      ? fs.existsSync(
          path.join(
            PROJECT_ROOT ? PROJECT_ROOT : process.cwd(),
            './public/locales/en/common.json'
          )
        )
      : false;

    if (locales) {
      localePathPublic = localePath;
    }

    if (publicLocales) {
      localePathPublic = `/public/${localePath}`;
    }

    // Validate defaultNS
    // https://github.com/isaachinman/next-i18next/issues/358
    if (
      process.env.NODE_ENV !== 'production' &&
      typeof combinedConfig.defaultNS === 'string'
    ) {
      const defaultNSPath = path.join(
        PROJECT_ROOT ? PROJECT_ROOT : process.cwd(),
        `${localePathPublic}/${defaultLanguage}/${combinedConfig.defaultNS}.${localeExtension}`
      );
      const defaultNSExists = fs.existsSync(defaultNSPath);
      if (!defaultNSExists) {
        throw new Error(`Default namespace not found at ${defaultNSPath}`);
      }
    }

    // Set server side backend
    combinedConfig.backend = {
      loadPath: path.join(
        PROJECT_ROOT ? PROJECT_ROOT : process.cwd(),
        `${localePathPublic}/${localeStructure}.${localeExtension}`
      ),
      addPath: path.join(
        PROJECT_ROOT ? PROJECT_ROOT : process.cwd(),
        `${localePathPublic}/${localeStructure}.missing.${localeExtension}`
      )
    };

    // Set server side preload (languages and namespaces)
    combinedConfig.preload = allLanguages;
    if (!combinedConfig.ns && !isBrowser) {
      const getAllNamespaces = p =>
        fs.readdirSync(p).map(file => file.replace(`.${localeExtension}`, ''));
      combinedConfig.ns = getAllNamespaces(
        path.join(
          PROJECT_ROOT ? PROJECT_ROOT : process.cwd(),
          `${localePathPublic}/${defaultLanguage}`
        )
      );
    }
  } else {
    console.log('Client side backend');

    // Set client side backend
    combinedConfig.backend = {
      loadPath: `/${localePath}/${localeStructure}.${localeExtension}`,
      addPath: `/${localePath}/${localeStructure}.missing.${localeExtension}`
    };

    combinedConfig.ns = [combinedConfig.defaultNS];
  }

  // Set fallback language to defaultLanguage in production
  if (!userConfig.fallbackLng) {
    combinedConfig.fallbackLng =
      process.env.NODE_ENV === 'production'
        ? combinedConfig.defaultLanguage
        : false;
  }

  // Deep merge with overwrite - goes last
  deepMergeObjects.forEach(obj => {
    if (userConfig[obj]) {
      combinedConfig[obj] = {
        ...defaultConfig[obj],
        ...userConfig[obj]
      };
    }
  });

  return combinedConfig;
};
