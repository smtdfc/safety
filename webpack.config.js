const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: './src/index.tsx',
  
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './public/dist'),
    library: 'App',
    libraryTarget: 'var',
    clean: true
  },
  
  mode: isProduction ? 'production' : 'development',
  
  devtool: isProduction ? false : 'source-map',
  target: "web",
  resolve: {
    extensions: ['.lightizui.style', '.tsx', '.ts', '.js', '.jsx'],
    alias: {}
  },
  
  module: {
    rules: [
    {
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: path.resolve(__dirname, './node_modules/rumious-webpack/dist/loader/index.js'),
        },
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            configFile: path.resolve(__dirname, 'tsconfig.json')
          }
        }
        
      ]
    },
    {
      test: /\.jsx$/,
      exclude: /node_modules/,
      use: [
      {
        loader: path.resolve(__dirname, './node_modules/rumious-webpack/dist/loader/index.js'),
      }]
    },
    {
      test: /\.lightizui\.style$/,
      type: 'javascript/auto',
      use: [
      {
        loader: path.resolve(__dirname, './node_modules/lightizui-webpack/dist/index.js'),
      }, ],
    },
    {
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: 'asset/resource'
    }, ]
  },
  plugins: [],
  
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  }
};