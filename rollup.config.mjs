import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import terser from '@rollup/plugin-terser';

import { readFileSync } from 'fs';
const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

const PLUGINS = [
  nodeResolve(),
  cleanup(),
  babel({
    extensions: ['.js', '.jsx'],
    babelHelpers: 'bundled',
  }),
  replace({
    _VERSION: JSON.stringify(pkg.version),
    preventAssignment: true,
  }),
];

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: pkg.main,
        format: 'iife',
        name: 'FellohPayments',
        plugins: [
          terser(),
        ],
      },
      { file: pkg.module, format: 'es' },
    ],
    plugins: PLUGINS,
  },
];
