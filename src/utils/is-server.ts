import isNode from 'detect-node';

export default () => isNode && typeof window === 'undefined';

// export default () =>
//   typeof window === 'undefined' && process.env.NEXT_PHASE === Constants.PHASE_PRODUCTION_SERVER;
