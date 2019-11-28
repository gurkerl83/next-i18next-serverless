import http from 'http';
import i18next from 'i18next';

export { handle, getResourcesHandler, missingKeyHandler } from './handler';
export { LanguageDetector } from '../language/detector/LanguageDetector';

// declare global {
//   namespace Express {
//     interface Request {
//       language: string;
//       languages: string[];
//       i18n: i18next.i18n;
//       t: i18next.TFunction;
//     }
//   }
// }

declare module 'http' {
  interface IncomingMessage {
    language: string;
    languages: Array<string>;
    i18n: i18next.i18n;
    t: i18next.TFunction;
    locale: string;
    lng: string;
    i18nextLookupName: string;
  }
  interface ServerResponse {
    locals: LocalProps;
  }
}

type I18next = i18next.i18n;

type IgnoreRoutesFunction = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  options: HandleOptions,
  i18next: I18next
) => boolean;

export interface HandleOptions {
  ignoreRoutes?: string[] | IgnoreRoutesFunction;
  removeLngFromUrl?: boolean;
}
export interface GetResourcesHandlerOptions {
  maxAge?: number;
  cache?: boolean;
  lngParam?: string;
  nsParam?: string;
}
export interface MissingKeyHandlerOptions {
  lngParam?: string;
  nsParam?: string;
}

// LanguageDetector
export type LanguageDetectorServices = any;
export type LanguageDetectorOrder = string[];
// type LanguageDetectorCaches = boolean | string[];
export type LanguageDetectorCaches = string[];

export interface LanguageDetectorOptions {
  order?: LanguageDetectorOrder;
  lookupQuerystring?: string;
  lookupCookie?: string;
  lookupSession?: string;
  lookupFromPathIndex?: number;
  caches?: LanguageDetectorCaches;
  cookieExpirationDate?: Date;
  cookieDomain?: string;
  lookupHeader?: string;
  cookieSecure?: boolean;
  lookupPath?: string;
}
export interface LanguageDetectorAllOptions {
  fallbackLng?: boolean | string | string[];
}
export interface LanguageDetectorInterfaceOptions {
  [name: string]: any;
}
export interface LanguageDetectorInterface {
  name: string;
  lookup: (
    req: http.IncomingMessage,
    res: http.ServerResponse,
    options?: LanguageDetectorInterfaceOptions
  ) => string | string[];
  cacheUserLanguage?: (
    req: http.IncomingMessage,
    res: http.ServerResponse,
    lng: string,
    options?: object
  ) => void;
}

interface LocalProps {
  language: string;
  languageDir: 'ltr' | 'rtl';
  exists: boolean;
  i18n: i18next.i18n;
  t: i18next.TFunction;
}

export interface LocalsMiddlewareProps {
  locals: LocalProps;
}

export interface ExtendedLocalsMiddlewareProps {
  language: string;
  languages: Array<string>;
  i18n: i18next.i18n;
  t: i18next.TFunction;
  locale: string;
  lng: string;
  i18nextLookupName: string;
}

// export type ExtendedIncomingMessageProps = http.IncomingMessage & ExtendedLocalsMiddlewareProps;
// export type ExtendedServerResponseProps = http.ServerResponse & LocalsMiddlewareProps;
