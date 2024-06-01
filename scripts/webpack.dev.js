/* eslint-disable import/extensions */
import path from 'node:path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import common from './webpack.common.js';

const config = merge(common(), {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    hot: true,
    allowedHosts: 'all',
    static: {
      directory: path.join(process.cwd(), 'src', 'assets'),
    },
    port: 3000,
    host: '0.0.0.0',
  },
  target: 'web',
  optimization: {
    moduleIds: 'named',
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
  ],
});

export default config;
