/* tslint:disable no-explicit-any */
import i18next from 'i18next';
import { LinkProps } from 'next/link';
import { SingletonRouter } from 'next/router';
import React from 'react';
import { TransProps, useTranslation, WithTranslation as ReactI18nextWithTranslation, withTranslation } from 'react-i18next';

declare module 'i18next' {
  interface InitOptions {
    allLanguages?: string[];
    defaultLanguage?: string;
  }
}

export type NextRuntimeConfig = {
  publicRuntimeConfig: Record<string, string>;
  serverRuntimeConfig: Record<string, string>;
};

export type InitConfig = {
  browserLanguageDetection?: boolean;
  serverLanguageDetection?: boolean;
  strictMode?: boolean;
  defaultLanguage: string;
  ignoreRoutes?: string[];
  localePath?: string;
  localeStructure?: string;
  otherLanguages: string[];
  localeSubpaths?: Record<string, string>;
  use?: any[];
  customDetectors?: any[];
  shallowRender?: boolean;
  // ignore this for the moment
  runtimeConfig?: NextRuntimeConfig;
} & i18next.InitOptions;

export type Config = {
  fallbackLng: boolean;
  allLanguages: string[];
  whitelist: string[];
  preload: string[];
} & InitConfig;

export interface NextI18NextInternals {
  config: Config;
  i18n: I18n;
}

export type Trans = (props: TransProps) => any;
export type Link = React.ComponentClass<LinkProps>;
export type Router = SingletonRouter;
export type UseTranslation = typeof useTranslation;
export type AppWithTranslation = <P extends object>(
  Component: React.ComponentType<P> | React.ElementType<P>
) => any;
export type TFunction = i18next.TFunction;
export type I18n = i18next.i18n;
export type WithTranslationHocType = typeof withTranslation;
export type WithTranslation = ReactI18nextWithTranslation;

declare class NextI18Next {
  constructor(runtimeConfig: NextRuntimeConfig, config: InitConfig);
  Trans: Trans;
  Link: Link;
  Router: Router;
  i18n: I18n;
  config: Config;
  useTranslation: UseTranslation;
  withTranslation: WithTranslationHocType;
  appWithTranslation: AppWithTranslation;
}

// declare global {
//   namespace Express {
//     interface Request {
//       i18n?: I18n & {
//         options: Config;
//       };
//       lng?: string;
//     }
//   }
// }

declare module 'http' {
  interface IncomingMessage {
    // i18n: I18n & {
    //   options: Config;
    // };
    i18n: I18n;
    lng: string;
  }
}

export default NextI18Next;
