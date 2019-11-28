import { compose } from 'compose-middleware';
import { nextI18NextMiddleware } from 'next-i18next-serverless/dist/commonjs';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

// const nextI18NextMiddleware = require('next-i18next-serverless/middleware');
// const wrapSession = handler => withSession(handler, {});
// const wrapDocument = handler => wrapSession(handler);

// export const middleware = async ({ req, res }) => {
//   // We need to remap the calling convention since nextjs's documentMiddleware takes ({req,res})
//   // while normal api routes expect (req, res).
//   await wrapDocument(() => {})(req, res);
// };

const nextI18next = require('../i18n');

// const wrapI18n = (req: IncomingMessage, res: ServerResponse) => {
const wrapI18n = (req, res) => {
  const middleware = compose(nextI18NextMiddleware(nextI18next));

  const done = () => {
    console.log('done');
  };

  middleware(req, res, next => {
    return done();
  });
};

/*
interface OProps {
  req: http.IncomingMessage;
  res: http.ServerResponse;
}
*/

// export const middleware = async ({ req, res }) => {
export const middleware = async ({ req, res }) =>
  // : OProps
  {
    // We need to remap the calling convention since nextjs's documentMiddleware takes ({req,res})
    // while normal api routes expect (req, res).
    await wrapI18n(req, res);
  };

// export async function middleware({ req, res }) {
//   if (req.url === '/another') {
//     res.setHeader('next-middleware', 'hit another!');
//     return res.end();
//   }
//   res.setHeader('next-middleware', 'hi from middleware');
// }

class MyDocument extends Document {
  static async getInitialProps(ctx) {
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
