import App, { Container } from 'next/app';
import React from 'react';

import getNextI18NextInstance from '../i18n';

const { appWithTranslation } = getNextI18NextInstance;

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    );
  }
}

export default appWithTranslation(MyApp);
