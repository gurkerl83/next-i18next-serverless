import http from 'http';
import { URL } from 'url';

import { LanguageDetectorInterface, LanguageDetectorOptions } from '../../handler';

// import { LanguageDetectorInterface, LanguageDetectorOptions } from '../../../typings';
export const path: LanguageDetectorInterface = {
  name: 'path',

  lookup(req: http.IncomingMessage, res: http.ServerResponse, options: LanguageDetectorOptions) {
    if (req && options.lookupPath) {
      const url: URL = new URL(req.url);
      const params: URLSearchParams = url.searchParams;

      if (params) {
        return params[options.lookupPath];

        // currently, starting the lookup from a certain index / position is not
        // supported (options.lookupFromPathIndex)
      }
      return false;
    }
  }
};
