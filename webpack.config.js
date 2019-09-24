// var webpack = require('webpack');
// var path = require('path');
// var fs = require('fs');

// var nodeModules = {};
// fs.readdirSync('node_modules')
//   .filter(function (x) {
//     return ['.bin'].indexOf(x) === -1;
//   })
//   .forEach(function (mod) {
//     nodeModules[mod] = 'commonjs ' + mod;
//   });

// module.exports = {
//   entry: './src/index.ts',
//   target: 'node',
//   output: {
//     filename: 'index.js',
//     path: path.resolve(__dirname, 'dist')
//   },
//   devtool: 'source-map',
//   resolve: {
//     // Add `.ts` and `.tsx` as a resolvable extension.
//     extensions: ['.ts', '.tsx', '.js']
//   },
//   module: {
//     rules: [
//       // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
//       { test: /\.tsx?$/, loader: 'ts-loader' }
//     ]
//   },
//   externals: nodeModules
// };
// -----------------------------
// var fs = require('fs');
// var nodeModules = {};
// fs.readdirSync('node_modules')
//   .filter(function(x) {
//     return ['.bin'].indexOf(x) === -1;
//   })
//   .forEach(function(mod) {
//     nodeModules[mod] = 'commonjs ' + mod;
//   });

// module.exports = {
//   entry: './src/index.ts',
//   output: {
//     path: __dirname + '/dist',
//     filename: 'index.js',
//   },
//   resolve: {
//     // Add '.ts' and '.tsx' as a resolvable extension.
//     extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
//   },
//   module: {
//     loaders: [
//       // All files with a '.ts' or '.tsx'
//       // extension will be handled by 'ts-loader'
//       {
//         test: /\.tsx?$/,
//         loader: 'ts-loader',
//       },
//     ],
//   },
//   target: 'node',
//   externals: nodeModules,
// };
// -----------------------------
const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    app: './src/index.ts'
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },

  module: {
    rules: [{
      test: /\.ts$/, // include .js files
      enforce: "pre", // preload the jshint loader
      exclude: /node_modules/, // exclude any and all files in the node_modules folder
      use: [{
        loader: "ts-loader",
        // more options in the optional jshint object
        // options: {  // ⬅ formally jshint property
        //   camelcase: true,
        //   emitErrors: false,
        //   failOnHint: false
        // }
      }]
    }]
  },
};