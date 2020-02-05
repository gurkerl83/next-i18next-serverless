import React from 'react';

import Footer from '../components/Footer';
import Header from '../components/Header';
import getNextI18NextInstance from '../i18n';

const { i18n, Link, useTranslation } = getNextI18NextInstance;

const Homepage = () => {
  const { t } = useTranslation(['common', 'footer']);

  return (
    <React.Fragment>
      <main>
        <Header title={t('h1')} />
        <div>
          <button
            type='button'
            onClick={() =>
              i18n.changeLanguage(i18n.language === 'en' ? 'de' : 'en')
            }
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
};

// Replace higher-order component in favor of hook

// Homepage.getInitialProps = async () => ({
//   namespacesRequired: ['common', 'footer']
// });

// Homepage.propTypes = {
//   t: PropTypes.func.isRequired
// };

// export default withTranslation('common')(Homepage);

export default Homepage;
