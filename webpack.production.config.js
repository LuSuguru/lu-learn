var path = require('path')
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'app/index.js'),
    // 将 第三方依赖 单独打包
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux',
      'es6-promise',
      'whatwg-fetch',
      'moment',
      'antd'
    ]
  },
  output: {
    path: __dirname + "/build",
    filename: "[name].[hash:5].js",
    //添加chunkFilename
    publicPath: '/',
    // chunkFilename: '[name].[chunkhash:8].chunk.js',
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
        test: /\.(less|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          //resolve-url-loader may be chained before sass-loader if necessary
          use: ['css-loader', 'less-loader']
        })
      },
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: ['url-loader?limit=8192&name=./[name].[ext]']
      },/*解析图片*/
      // {
      //     test: /\.less$/, 
      //     use: ['style-loader', 'css-loader', 'less-loader']
      // }/*解析less, 把less解析成浏览器可以识别的css语言*/ 
    ]
  },

  plugins: [
    // webpack 内置的 banner-plugin
    new webpack.BannerPlugin("Copyright by blusk123"),

    // html 模板插件
    new HtmlWebpackPlugin({
      template: __dirname + '/app/index.tmpl.html'
    }),
    //过滤其他语言
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    // 定义为生产环境，编译 React 时压缩到最小
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),

    // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        //supresses warnings, usually from module minification
        warnings: false
      }
    }),

    // 分离CSS和JS文件
    new ExtractTextPlugin('[name].[hash:5].css'),

    // 提供公共代码
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'manifest'],
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      },
      children: true,
    }),

    // 可在业务 js 代码中使用 __DEV__ 判断是否是dev模式（dev模式下可以提示错误、测试报告等, production模式不提示）
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false'))
    })
  ]
}