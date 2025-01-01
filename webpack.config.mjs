import MiniCSSExtractPlugin from 'mini-css-extract-plugin';
import path from 'node:path';

const dirname = path.resolve('.');

export default {
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
