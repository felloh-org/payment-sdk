import replace from '@rollup/plugin-replace';
import babel from 'rollup-plugin-babel';
import cleanup from 'rollup-plugin-cleanup';

import pkg from './package.json';

const PLUGINS = [
  cleanup(),
  babel({
    extensions: ['.js', '.jsx'],
  }),
  replace({
    _VERSION: JSON.stringify(pkg.version),
  }),
];

export default [
  {
    input: 'src/index.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
    plugins: PLUGINS,
  },
];
