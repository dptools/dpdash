require('@babel/register')
const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const outputDirectory = 'app_build'

module.exports = {
  target: 'web',
  mode: process.env.NODE_ENV || 'production',
  entry: './views/index.js',
  watchOptions: {
    ignored: ['**/node_modules', '**/server'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/, /\.test\.(js|jsx)$/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                'react-html-attrs',
                '@babel/plugin-proposal-class-properties',
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                ['@babel/plugin-transform-runtime', { legacy: true }],
              ],
              presets: [
                [
                  '@babel/preset-react',
                  {
                    runtime: 'automatic',
                  },
                ],
                '@babel/preset-env',
              ],
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/[hash][ext][query]',
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  optimization: {
    minimize: process.env.NODE_ENV === 'production',
  },
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: 'js/bundle.js',
  },
  resolve: {
    fallback: {
      fs: false,
      net: false,
      tls: false,
    },
    extensions: ['*', '.js', '.jsx'],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
}
