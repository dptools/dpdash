require('babel-register');
var webpack = require('webpack');

module.exports = {
  target: 'web',
  mode: process.env.NODE_ENV || 'production',
  entry: {
    study: './views/Study.render.react.js',
    admin: './views/Admin.render.react.js',
    main: './views/Main.render.react.js',
    login: './views/Login.render.react.js',
    register: './views/Register.render.react.js',
    reset: './views/Resetpw.render.react.js',
    account: './views/Account.render.react.js',
    editConfig: './views/EditConfig.render.react.js',
    config: './views/Config.render.react.js',
    deepdive: './views/DeepDive.render.react.js',
    graph: './views/Graph.render.react.js'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            plugins: [
              'react-html-attrs',
              '@babel/plugin-proposal-class-properties',
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-transform-runtime', { legacy: true }]
            ],
            presets: [
              '@babel/preset-react',
              '@babel/preset-env',
            ]
          }
        }],
      }
    ],
  },
  optimization: {
    minimize: true,
  },
  output: {
    path: __dirname + '/public/js/',
    filename: '[name].min.js',
    publicPath: '/js/'
  },
  resolve: {
    fallback: {
      fs: false,
      net: false,
      tls: false,
    },
    extensions: ['.js']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      }
    }),
  ],
};
