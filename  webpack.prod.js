const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false,
    },
    runtimeChunk: {
      name: 'runtime',
    },
  },
  plugins: [
    new CompressionPlugin(),
    process.env.ANALYZE && new BundleAnalyzerPlugin(),
  ].filter(Boolean),
});
