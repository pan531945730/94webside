var path = require("path");
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var buildPageConfig = require('./buildPageConfig.js');
var pageConfig = buildPageConfig();
console.log(pageConfig);
module.exports = {
    //插件项
    plugins: [
        //将样式统一发布到styles.css中
        new ExtractTextPlugin("[name].css")
    ],
    //页面入口文件配置
    entry: pageConfig,
    //入口文件输出配置
    output: {
        path: path.join(__dirname, "./dist"),
        filename: '[name].js',
        publicPath: '/dist/'
    },
    watch: true,
    module: { 
     loaders: [ 
        { 
            test: /\.css$/, 
            loader: ExtractTextPlugin.extract("style-loader","css-loader") 
        },
        {
            test:/\.(png|jpg)$/,
            loader: 'url-loader?limit=48080&name=img/[name].[ext]'
        },
        { 
            test: /\.(ttf|eot|woff|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'file-loader?name=activity/font/[name].[ext]' 
        }          
     ] 
    },
    resolve: {
        root: path.join(__dirname + 'src'),
        extensions: ['', '.js', '.css'],
        modulesDirectories: [
          'node_modules'
        ]        
    }
};
