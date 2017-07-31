;
$(function() {
    require('../../common/layout.css');
    var JSBK = require('../../common/layout02.js');
    require('../../component/webApp/Details.css'); 
    require('../../component/website/Load.css'); 
    
    var tit = $('#detailDox h2'),
        bz = $('.auto li'),
        regImgcode = $('#detailDox .eye_icon'),
        condata = $('#detailsContent'),
        auto = $('.auto'),
        load = $('.load');
    var idnum= JSBK.Utils.GetQueryString("id");
    var detaileData = {
        data: {
            id:idnum
        },
        mFun: 'GetInfoDetail',
        beforeFun : function(){
            load.show();
        },
        sucFun : function(v){
            load.hide();
            if (v && v.id){
                auto.show();
                tit.html(v.title);
                bz.html(v.categoryTitle);
                regImgcode.html(v.readCount);
                condata.html(v.content);
            }else{
                $('body').html("<p class='nomess'>暂无内容！</p>")
            };           
        },
        unusualFun : function(v){}
    }
    JSBK.Utils.postAjax(detaileData);
});