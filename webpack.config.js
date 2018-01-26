var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
  entry: {
    app: __dirname + '/app/index.js',
  },
  output: {
    path: __dirname + '/build',
    filename: "bundle.js",
    //添加chunkFilename
    // chunkFilename: '[name].[chunk:5].chunk.js',
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      /*解析css, 并把css添加到html的style标签里*/
      //{test: /.css$/, use: ExtractTextPlugin.extract({fallback: 'style-loader',use: 'css-loader'})},/*解析css, 并把css变成文件通过link标签引入*/
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: ['url-loader?limit=8192&name=./[name].[ext]']
      },/*解析图片*/
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }/*解析less, 把less解析成浏览器可以识别的css语言*/
    ]
  },
  plugins: [
    // html 模板插件
    new HtmlWebpackPlugin({
      template: __dirname + '/app/index.tmpl.html'
    }),

    // 热加载插件
    new webpack.HotModuleReplacementPlugin(),

    // 打开浏览器
    new OpenBrowserPlugin({
      url: 'http://localhost:8080'
    }),
    // 提供公共代码
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: ['vendor','manifest'],
    //   minChunks: function (module, count) {
    //             // any required modules inside node_modules are extracted to vendor
    //             return (
    //                 module.resource &&
    //                 /\.js$/.test(module.resource) &&
    //                 module.resource.indexOf(
    //                     path.join(__dirname, '../node_modules')
    //                 ) === 0
    //             )
    //         }
    // }),

    // 可在业务 js 代码中使用 __DEV__ 判断是否是dev模式（dev模式下可以提示错误、测试报告等, production模式不提示）
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false'))
    })
  ],

  devServer: {
    proxy: {
      '/api': {
        target: 'http://ticket.xiyoukeji.com/home',  //8092
        // target: 'http://192.168.1.168:8888',
        pathRewrite: { '^/api': '' },
        secure: false,
        changeOrigin: true
      }
    },
    historyApiFallback: true, //不跳转，在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
    inline: true, //实时刷新
    hot: true,  // 使用热加载插件 HotModuleReplacementPlugin
    progress: true
  }
}