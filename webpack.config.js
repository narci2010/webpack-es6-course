var path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  devServer: {
    contentBase: path.join(__dirname, '/'),
    compress: true,
    port: 9000
  },
  entry: './entry.js',
  node: {
    fs: 'empty'
  },
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        // use: [ 'style-loader', 'css-loader' ]
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env']
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // 打包输出HTML
      title: '拓胜科技ES6+深度课程',
      minify: {
        // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true // 压缩内联css
      },
      filename: 'index.html',
      template: 'index.html'
    })
  ]
}
