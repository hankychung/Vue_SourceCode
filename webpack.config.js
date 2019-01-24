const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    main: './src/main.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js'
  },
  plugins: [
    new HtmlPlugin({
      template: './src/index.html',
      filename: 'index.html'
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    port: '8080',
    host: 'localhost'
  }
}