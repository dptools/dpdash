var debug = process.env.NODE_ENV !== 'production';
var webpack = require('webpack');

module.exports = {
	target: 'web',
    devtool: 'nosources-source-map',
	node : {
		fs : 'empty',
		net : 'empty',
		tls : 'empty'
	},
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
                    query: {
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
	output: {
		path: __dirname + '/public/js/',
		filename: '[name].min.js',
		publicPath: '/js/'
	},
	resolve: {
		extensions: ['.js']
	},
	plugins: [
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify('production'),
            }
        }),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.ProvidePlugin({
			Promise: 'imports-loader?this=>global!exports-loader?global.Promise!es6-promise'
		})
	],
};
