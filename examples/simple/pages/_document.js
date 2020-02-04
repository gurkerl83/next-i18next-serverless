import { compose } from 'compose-middleware';
import { nextI18NextMiddleware } from 'next-i18next-serverless/dist/commonjs/middlewares/next-i18next-middleware';
import getConfig from 'next/config';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import React from 'react';

import getNextI18NextInstance from '../i18n';

// const NextI18Next = require('next-i18next-serverless').default;

// const nextI18NextMiddleware = require('next-i18next-serverless/middleware');
// const wrapSession = handler => withSession(handler, {});
// const wrapDocument = handler => wrapSession(handler);

// export const middleware = async ({ req, res }) => {
//   // We need to remap the calling convention since nextjs's documentMiddleware takes ({req,res})
//   // while normal api routes expect (req, res).
//   await wrapDocument(() => {})(req, res);
// };

// const wrapI18n = async ({ req, res }) => {
//   const { publicRuntimeConfig } = getConfig();

//   const { PROJECT_ROOT } = publicRuntimeConfig;

//   console.log('PROJECT_ROOT from i18n-next: ', PROJECT_ROOT);

//   console.log('nextI18NextMiddleware: ', nextI18NextMiddleware);
//   console.log('instance: ', instance);
//   const middleware = compose(nextI18NextMiddleware(instance));

//   const done = () => {
//     console.log('done');
//   };

//   middleware(req, res, next => {
//     return done();
//   });
// };

/*
interface OProps {
  req: http.IncomingMessage;
  res: http.ServerResponse;
}
*/

const wrapI18n = (req, res) => {
  const { publicRuntimeConfig } = getConfig();
  console.log(
    'instantiateTestMiddleware in publicRuntimeConfig: ',
    publicRuntimeConfig
  );

  const instance = getNextI18NextInstance(getConfig());
  console.log('instance in publicRuntimeConfig: ', instance);

  const middleware = compose(nextI18NextMiddleware(instance));

  const done = () => {
    console.log('done');
  };

  middleware(req, res, next => {
    return done();
  });
};

export const middleware = async ({ req, res }) => {
  const { publicRuntimeConfig } = getConfig();

  const { PROJECT_ROOT } = publicRuntimeConfig;

  console.log('PROJECT_ROOT from middleware: ', PROJECT_ROOT);

  // We need to remap the calling convention since nextjs's documentMiddleware takes ({req,res})
  // while normal api routes expect (req, res).
  // await wrapI18n(req, res);
};

export const testMiddleware = () => {
  // const middleware: Array<Handler<IncomingMessage, ServerResponse>> = [];

  const fake = (_req, _res, next) => {
    console.log('Fake middleware step');
    next();
  };
  return [fake];
};

export const composeTestMiddleware = ({ req, res }) => middlewares => {
  const handler = compose(middlewares);

  const done = () => {
    console.log('done');
  };

  handler(req, res, _next => {
    return done();
  });

  return handler;
};

export const instantiateTestMiddleware = ({ req, res }) => {
  const { publicRuntimeConfig } = getConfig();
  console.log(
    'instantiateTestMiddleware in publicRuntimeConfig: ',
    publicRuntimeConfig
  );

  const instance = getNextI18NextInstance(getConfig());
  console.log('instance in publicRuntimeConfig: ', instance);
  composeTestMiddleware(req, res)(testMiddleware());
};

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    // await wrapI18n(ctx);

    // const middleware = compose(nextI18NextMiddleware(null));

    // const done = () => {
    //   console.log('done');
    // };

    // await middleware(req, res, next => {
    //   return done();
    // });

    /*
    const instance = getNextI18NextInstance(getConfig());

    const a = nextI18NextMiddleware(instance);

    composeTestMiddleware(ctx)();
    */

    // instantiateTestMiddleware(ctx);
    wrapI18n(ctx.req, ctx.res);

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
