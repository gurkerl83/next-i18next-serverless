import App, { Container } from 'next/app';
import getConfig from 'next/config';
import React from 'react';

import getNextI18NextInstance from '../i18n';

// const { publicRuntimeConfig } = getConfig();
// const { PROJECT_ROOT } = publicRuntimeConfig;
// const { appWithTranslation } = getNextI18NextInstance(PROJECT_ROOT);

//

console.log('getNextI18NextInstance definition: ', getNextI18NextInstance);

console.log('getConfig(): ', getConfig());

const { appWithTranslation } = getNextI18NextInstance(getConfig());

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
