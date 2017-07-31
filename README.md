# 94bank

You will need Node.js installed on your system.

~~~ sh
$ npm install

#js縲…ss module reference 
require('')

# on Windows
c:\Images.94bank.com > webpack

#Compression confuse script
c:\Images.94bank.com > webpack -p

The resulting files are:
1. `dist/page/[name].js`
2. `dist/page/[name].css`

entry：指定打包的入口文件，每有一个键值对，就是一个入口文件

output：配置打包结果，path定义了输出的文件夹，filename则定义了打包结果文件的名称，filename里面的[name]会由entry中的键（这里是entry1和entry2）替换

resolve：定义了解析模块路径时的配置，常用的就是extensions，可以用来指定模块的后缀，这样在引入模块时就不需要写后缀了，会自动补全

module：定义了对模块的处理逻辑，这里可以用loaders定义了一系列的加载器，以及一些正则。当需要加载的文件匹配test的正则时，就会调用后面的loader对文件进行处理，这正是webpack强大的原因。比如这里定义了凡是.js结尾的文件都是用babel-loader做处理，而.jsx结尾的文件会先经过jsx-loader处理，然后经过babel-loader处理。当然这些loader也需要通过npm install安装

plugins: 这里定义了需要使用的插件，比如commonsPlugin在打包多个入口文件时会提取出公用的部分，生成common.js