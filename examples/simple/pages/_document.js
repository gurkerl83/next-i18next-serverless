import { compose } from 'compose-middleware';
import { nextI18NextMiddleware } from 'next-i18next-serverless/dist/commonjs/middlewares/next-i18next-middleware';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

import getNextI18NextInstance from '../i18n';

export const composeTestMiddleware = (req, res) => middlewares => {
  const handler = compose(middlewares);

  const done = () => {
    console.log('done');
  };

  handler(req, res, _next => {
    return done();
  });

  return handler;
};

export const instantiateTestMiddleware = (req, res) => {
  const instance = getNextI18NextInstance;
  composeTestMiddleware(req, res)(nextI18NextMiddleware(instance));
};

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    instantiateTestMiddleware(ctx.req, ctx.res);

    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <style>{`body { margin: 0 } /* custom! */`}</style>
        </Head>
        <body className='custom_class'>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
