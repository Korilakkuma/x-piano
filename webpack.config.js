const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const dirname = path.resolve('.');

module.exports = {
  mode: 'development',
  entry: {
    'x-piano': ['./src/index.js']
  },
  output: {
    filename: '[name].js',
    path: `${dirname}/dist`,
    publicPath: '/dist/',
    library: {
      name: 'xsound',
      type: 'umd'
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCSSExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: [
    new MiniCSSExtractPlugin({
      filename: 'app.css'
    })
  ],
  devtool: 'source-map',
  devServer: {
    static: dirname,
    host: '0.0.0.0'
  }
};
