const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/components/index.js',
  output: {
    filename: 'app.js',
    path: `${__dirname}/build`,
    publicPath: '/build/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/components', to: '.' }
      ]
    })
  ],
  devServer: {
    contentBase: __dirname
  }
};
