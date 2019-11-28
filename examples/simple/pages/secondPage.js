import PropTypes from 'prop-types';
import React from 'react';

import Footer from '../components/Footer';
import Header from '../components/Header';
import { Link, withTranslation } from '../i18n';

const SecondPage = ({ t }) => (
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

SecondPage.getInitialProps = async () => ({
  namespacesRequired: ['secondPage', 'footer']
});

SecondPage.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation('secondPage')(SecondPage);
