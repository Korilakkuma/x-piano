module.exports = {
  entry: './src/components/index.js',
  output: {
    filename: 'app.js',
    path: `${__dirname}/build`
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
};
