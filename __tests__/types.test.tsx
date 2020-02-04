import React from 'react';

import NextI18Next, { WithTranslation } from '../types';

// Import all types to ensure they exist
const DummyComponent: React.FC<{} & WithTranslation> = () => <div />;

const emptyConfig = {
  defaultLanguage: null,
  otherLanguages: []
};

// Instantiate instance and call methods upon it
const Instance = new NextI18Next(emptyConfig);
Instance.appWithTranslation(DummyComponent);
Instance.withTranslation('common')(DummyComponent);
