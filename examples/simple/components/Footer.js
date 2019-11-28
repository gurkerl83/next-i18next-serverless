import { version } from 'next-i18next-serverless/package.json';
import PropTypes from 'prop-types';
import React from 'react';

import { withTranslation } from '../i18n';

const Footer = ({ t }) => (
  <footer>
    <p>{t('description')}</p>
    <p>next-i18next v{version}</p>
  </footer>
);

Footer.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation('footer')(Footer);
