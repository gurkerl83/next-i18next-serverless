import Cookies from 'cookies';
import http from 'http';

import { LanguageDetectorInterface, LanguageDetectorOptions } from '../../handler';

// import { LanguageDetectorInterface, LanguageDetectorOptions } from '../../../typings';
export const cookie: LanguageDetectorInterface = {
  name: 'cookie',

  lookup(req: http.IncomingMessage, res: http.ServerResponse, options: LanguageDetectorOptions) {
    if (req && options.lookupCookie) {
      if (req.headers && req.headers.cookie) {
        return req.headers.cookie[options.lookupCookie];
      } else {
        const cookies = new Cookies(req, res);
        return cookies.get(options.lookupCookie);
      }
    }
  },

  cacheUserLanguage(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    lng: string,
    options: LanguageDetectorOptions = {}
  ) {
    // TODO: res._headerSent
    if (options.lookupCookie && req && !res.headersSent) {
      const cookies = new Cookies(req, res);

      let expirationDate = options.cookieExpirationDate;
      if (!expirationDate) {
        expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
      }

      let cookieOptions: Cookies.SetOption = {
        expires: expirationDate,
        domain: options.cookieDomain,
        httpOnly: false,
        overwrite: true
      };

      if (options.hasOwnProperty('cookieSecure')) {
        // cookieOptions = {
        //   ...cookieOptions,
        //   secure: options.cookieSecure
        // };

        cookies.set(options.lookupCookie, lng, cookieOptions);
      }
    }
  }
};
