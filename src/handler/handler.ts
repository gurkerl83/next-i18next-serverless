import { Next } from 'compose-middleware';
import http from 'http';
import i18next from 'i18next';
import _ from 'lodash';
import { ParsedUrlQuery } from 'querystring';
import getRawBody from 'raw-body';
import URL, { UrlWithParsedQuery, UrlWithStringQuery } from 'url';

import { HandleOptions, MissingKeyHandlerOptions } from '.';
import { removeLngFromUrl, setPath } from './utils';

// import connect, { NextFunction } from 'connect';
// import { HandleOptions, MissingKeyHandlerOptions } from '../../typings';
type I18next = i18next.i18n;

// export function handle(i18next: I18next, options: HandleOptions = {}): connect.HandleFunction {
export function handle(i18next: I18next, options: HandleOptions = {}) {
  return function i18nextMiddleware(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    // next: NextFunction
    next: Next
  ) {
    if (_.isFunction(options.ignoreRoutes)) {
      if (options.ignoreRoutes(req, res, options, i18next)) {
        return next();
      }
    } else {
      let ignores = (_.isArray(options.ignoreRoutes) && options.ignoreRoutes) || [];
      for (var i = 0; i < ignores.length; i++) {
        const urlParts: UrlWithStringQuery = URL.parse(req.url);
        if (urlParts.path.indexOf(ignores[i]) > -1) {
          return next();
        }
      }

      // const urlParts: UrlWithStringQuery = URL.parse(req.url);

      // ignores
      //   .filter(ignore => urlParts.path.indexOf(ignore) > -1)
      //   .map(_ignore => {
      //     return next();
      //   });
    }

    let i18n = i18next.cloneInstance({ initImmediate: false });
    i18n.on('languageChanged', lng => {
      // Keep language in sync
      req.language = req.locale = req.lng = lng;

      if (res.locals) {
        res.locals.language = lng;
        res.locals.languageDir = i18next.dir(lng);
      }

      if (!res.headersSent) {
        res.setHeader('Content-Language', lng);
      }

      req.languages = i18next.services.languageUtils.toResolveHierarchy(lng);

      if (i18next.services.languageDetector) {
        i18next.services.languageDetector.cacheUserLanguage(req, res, lng);
      }
    });

    let lng = req.lng;
    if (!req.lng && i18next.services.languageDetector)
      lng = i18next.services.languageDetector.detect(req, res);

    // set locale
    req.language = req.locale = req.lng = lng;
    if (!res.headersSent) {
      res.setHeader('Content-Language', lng);
    }
    req.languages = i18next.services.languageUtils.toResolveHierarchy(lng);

    // trigger sync to instance - might trigger async load!
    i18n.changeLanguage(lng || i18next.options.fallbackLng[0]);

    if (req.i18nextLookupName === 'path' && options.removeLngFromUrl) {
      req.url = removeLngFromUrl(
        req.url,
        i18next.services.languageDetector.options.lookupFromPathIndex
      );
    }

    let t = i18n.t.bind(i18n);
    let exists = i18n.exists.bind(i18n);

    // assert for req
    req.i18n = i18n;
    req.t = t;

    // assert for res -> template
    if (res.locals) {
      res.locals.t = t;
      res.locals.exists = exists;
      res.locals.i18n = i18n;
      res.locals.language = lng;
      res.locals.languageDir = i18next.dir(lng);
    }

    if (i18next.services.languageDetector)
      i18next.services.languageDetector.cacheUserLanguage(req, res, lng);

    // load resources
    if (!req.lng) return next();
    i18next.loadLanguages(req.lng, function() {
      return next();
    });
  };
}

interface GetResourcesHandlerOptions {
  maxAge?: number;
  cache?: boolean;
  lngParam?: string;
  nsParam?: string;
}

export function getResourcesHandler(
  i18next: I18next,
  options: GetResourcesHandlerOptions
): http.RequestListener {
  options = options || {};
  let maxAge = options.maxAge || 60 * 60 * 24 * 30;

  return function(req: http.IncomingMessage, res: http.ServerResponse) {
    if (!i18next.services.backendConnector) {
      return res
        .writeHead(404)
        .end(JSON.stringify('i18next-node-middleware-test:: no backend configured'));
    }

    let resources = {};

    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    if (options.cache !== undefined ? options.cache : process.env.NODE_ENV === 'production') {
      res.setHeader('Cache-Control', 'public, max-age=' + maxAge);
      res.setHeader('Expires', new Date(new Date().getTime() + maxAge * 1000).toUTCString());
    } else {
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Cache-Control', 'no-cache');
    }

    const urlParts: UrlWithParsedQuery = URL.parse(req.url, true);
    const query: ParsedUrlQuery = urlParts.query;

    let languages = query[options.lngParam || 'lng']
      ? (query[options.lngParam || 'lng'] as string).split(' ')
      : [];
    let namespaces = query[options.nsParam || 'ns']
      ? (query[options.nsParam || 'ns'] as string).split(' ')
      : [];

    // extend ns
    namespaces.forEach(ns => {
      // if (i18next.options.ns && i18next.options.ns.indexOf(ns) < 0) i18next.options.ns.push(ns);
      if (i18next.options.ns && i18next.options.ns.indexOf(ns) < 0) {
        if (_.isArray(i18next.options.ns)) {
          i18next.options.ns.push(ns);
        }
      }
    });

    i18next.services.backendConnector.load(languages, namespaces, function() {
      languages.forEach(lng => {
        namespaces.forEach(ns => {
          setPath(resources, [lng, ns], i18next.getResourceBundle(lng, ns));
        });
      });
      res.end(JSON.stringify(resources));
    });
  };
}

export const missingKeyHandler = (
  i18next: I18next,
  options: MissingKeyHandlerOptions
): http.RequestListener => {
  options = options || {};

  // return async (req: http.IncomingMessage, res: http.ServerResponse) => {
  return (req: http.IncomingMessage, res: http.ServerResponse) => {
    const url: URL = new URL.URL(req.url);
    const params: URLSearchParams = url.searchParams;

    let lng = params[options.lngParam || 'lng'];
    let ns = params[options.nsParam || 'ns'];

    if (!i18next.services.backendConnector) {
      return res
        .writeHead(400)
        .end(JSON.stringify('i18next-node-middleware-test:: no backend configured'));
    }

    getRawBody(req)
      .then(buf => {
        i18next.services.backendConnector.saveMissing([lng], ns, buf.length, buf);
        res.end(JSON.stringify('ok'));
      })
      .catch(err => {
        res.statusCode = err.statusCode;
        res.end(err.message);
      });

    // let buffer: Buffer;

    // try {
    //   buffer = await getRawBody(req);
    // } catch (error) {
    //   console.log(JSON.stringify({ error: error.toString(), stack: error.stack }));
    // }

    // i18next.services.backendConnector.saveMissing([lng], ns, buffer.length, buffer);
    // res.end(JSON.stringify('ok'));
  };
};
