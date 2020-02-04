const path = require('path');

// const exportPathMap = require('./dist/next/exportPathMap');

module.exports = {
  // exportPathMap,
  target: 'serverless',

  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  experimental: { documentMiddleware: true },

  publicRuntimeConfig: {
    PROJECT_ROOT: __dirname,
    PROJECT_ROOT_2: 'Hello'
  },

  // webpack: (config, options) => {
  webpack: (config, { isServer }) => {
    config.mode = 'production';

    // Fixes npm packages that depend on `fs` module
    // config.node = {
    //   fs: 'empty'
    // };

    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty'
      };
    }

    // The context is two levels out, because next does currently not support
    // configurations (next.config) in typescript
    // config.context = path.resolve(__dirname, '../../');
    // config.resolve = {
    //   extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    // };

    return config;
  }
};
