import PropTypes from 'prop-types';
import React from 'react';

import Footer from '../components/Footer';
import Header from '../components/Header';
import { i18n, Link, withTranslation } from '../i18n';

const Homepage = ({ t }) => (
  <React.Fragment>
    <main>
      <Header title={t('h1')} />
      <div>
        <button
          type='button'
          onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'de' : 'en')}
        >
          {t('change-locale')}
        </button>
        <Link href='/secondPage'>
          <button type='button'>{t('to-secondPage')}</button>
        </Link>
      </div>
    </main>
    <Footer />
  </React.Fragment>
);

Homepage.getInitialProps = async () => ({
  namespacesRequired: ['common', 'footer']
});

Homepage.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation('common')(Homepage);
