import http from 'http';
import { ParsedUrlQuery } from 'querystring';
import URL, { UrlWithParsedQuery } from 'url';

import { LanguageDetectorOptions } from '../../handler';

// import { LanguageDetectorOptions } from '../../../typings';
export const querystring = {
  name: 'querystring',

  lookup(req: http.IncomingMessage, _res: http.ServerResponse, options: LanguageDetectorOptions) {
    if (req && options.lookupQuerystring) {
      const urlParts: UrlWithParsedQuery = URL.parse(req.url, true);
      const query: ParsedUrlQuery = urlParts.query;
      if (query) {
        return query[options.lookupQuerystring];
      }
      return false;
    }
    return false;
  }
};
