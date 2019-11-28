import http from 'http';
import i18next from 'i18next';
import _ from 'lodash';

import { defaults } from '../../common/utils';
import {
  LanguageDetectorAllOptions,
  LanguageDetectorCaches,
  LanguageDetectorOptions,
  LanguageDetectorOrder,
  LanguageDetectorServices,
} from '../../handler';
import { cookie, header, path, querystring } from '../lookup';

// import {
//   LanguageDetectorAllOptions,
//   LanguageDetectorCaches,
//   LanguageDetectorOptions,
//   LanguageDetectorOrder,
//   LanguageDetectorServices,
// } from '../../../typings';

// import sessionLookup from './languageLookups/session';

function getDefaults() {
  return {
    order: ['path', 'querystring', 'cookie', 'header'],
    lookupQuerystring: 'lng',
    lookupCookie: 'i18next',
    lookupSession: 'lng',
    lookupFromPathIndex: 0,

    // cache user language
    caches: false // ['cookie']
    //cookieExpirationDate: new Date(),
    //cookieDomain: 'myDomain'
  };
}

interface Detector {
  lookup: (
    req: http.IncomingMessage,
    res: http.ServerResponse,
    options: LanguageDetectorOptions
  ) => any;
  cacheUserLanguage(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    lng: string,
    caches?: LanguageDetectorCaches
  ): any;
}

interface Detectors {
  [key: string]: Detector;
}

export class LanguageDetector implements i18next.Module {
  type: 'languageDetector';

  constructor(
    services: LanguageDetectorServices,
    options?: LanguageDetectorOptions,
    allOptions?: LanguageDetectorAllOptions
  ) {
    this.detectors = {};

    this.init(services, options, allOptions);
  }

  detectors: Detectors;
  services: any;
  options: LanguageDetectorOptions;
  allOptions: LanguageDetectorAllOptions;

  init(
    services: LanguageDetectorServices,
    options: LanguageDetectorOptions = {},
    allOptions: LanguageDetectorAllOptions = {}
  ) {
    this.services = services;
    this.options = defaults(options || getDefaults());
    this.allOptions = allOptions;

    this.addDetector(cookie);
    this.addDetector(querystring);
    this.addDetector(path);
    this.addDetector(header);
  }

  addDetector(detector) {
    this.detectors[detector.name] = detector;
  }

  detect(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    detectionOrder?: LanguageDetectorOrder
  ): string | void {
    if (!detectionOrder) detectionOrder = this.options.order;

    // let found;
    return detectionOrder.forEach(detectorName => {
      // if (found || !this.detectors[detectorName]) return;
      if (!this.detectors[detectorName]) return;

      const detector = this.detectors[detectorName];
      let detections = detector.lookup(req, res, this.options);

      if (!detections) return;

      if (!_.isArray(detections)) detections = [detections];

      const selectedLanguages = detections.forEach(lng => {
        if (!_.isString(lng)) return;

        let cleanedLng = this.services.languageUtils.formatLanguageCode(lng);

        if (this.services.languageUtils.isWhitelisted(cleanedLng)) {
          req.headers['i18nextLookupName'] = detectorName;
          return cleanedLng;
        }
      });

      if (_.isArray(selectedLanguages) && selectedLanguages.length > 1) {
        return selectedLanguages[0];
      }
    });
  }

  // cacheUserLanguage(
  //   req: http.IncomingMessage,
  //   res: http.ServerResponse,
  //   lng: string,
  //   caches?: LanguageDetectorCaches
  // ) {
  //   if (!caches) {
  //     caches = this.options.caches;
  //   }
  //   if (caches) {
  //     caches.forEach(cacheName => {
  //       if (this.detectors[cacheName] && this.detectors[cacheName].cacheUserLanguage)
  //         this.detectors[cacheName].cacheUserLanguage(req, res, lng, this.options);
  //     });
  //   }
  // }
}
