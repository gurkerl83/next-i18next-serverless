import React from 'react';

import Footer from '../components/Footer';
import Header from '../components/Header';
import getNextI18NextInstance from '../i18n';

const { Link, useTranslation } = getNextI18NextInstance;

const SecondPage = () => {
  const { t } = useTranslation(['secondPage', 'footer']);

  return (
    <React.Fragment>
      <main>
        <Header title={t('h1')} />
        <Link href='/'>
          <button type='button'>{t('back-to-home')}</button>
        </Link>
      </main>
      <Footer />
    </React.Fragment>
  );
};

// Replace higher-order component in favor of hook

/*
SecondPage.getInitialProps = async () => ({
  namespacesRequired: ['secondPage', 'footer']
});

SecondPage.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation('secondPage')(SecondPage);
*/

export default SecondPage;
