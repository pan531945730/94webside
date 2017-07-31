var fs = require('fs');
var _ = require('underscore');

var fileList = [];
//遍历对应文件夹
function walk(path){
  var dirList = fs.readdirSync(path);
  dirList.forEach(function(item){
    if(fs.statSync(path + '/' + item).isDirectory()){
      walk(path + '/' + item);
    }else{
      fileList.push(path + '/' + item);
    }
  });
}

//build config
function buildPageConfig(){
  var pageConfig = {};
  walk('./src/js');
  _.each(fileList, function(filepath){
    //若是api文件夹/非js文件　则不打包
    if( (/(\/api\/)/).test(filepath) || !(/.js$/).test(filepath) ){
      return;
    }
    var confAttr = filepath.replace(/(^.\/src\/js)|(.js$)/g, '');
    pageConfig[confAttr] = filepath;
  });
  return pageConfig;
}

module.exports = buildPageConfig;