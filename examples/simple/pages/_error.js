// import getConfig from 'next/config';
import PropTypes from 'prop-types';
import React from 'react';

// import getNextI18NextInstance from '../i18n';

// const { useTranslation } = getNextI18NextInstance(getConfig());

const Error = ({ statusCode }) => {
  // const { t } = useTranslation('common');

  return (
    <p>
      {/* {statusCode
        ? t('error-with-status', { statusCode })
        : t('error-without-status')} */}
    </p>
  );
};

// Error.getInitialProps = async ({ res, err }) => {
//   let statusCode = null;
//   if (res) {
//     ({ statusCode } = res);
//   } else if (err) {
//     ({ statusCode } = err);
//   }
//   return {
//     namespacesRequired: ['common'],
//     statusCode
//   };
// };

Error.defaultProps = {
  statusCode: null
};

Error.propTypes = {
  statusCode: PropTypes.number
  // t: PropTypes.func.isRequired
};

// export default withTranslation('common')(Error)
export default Error;
