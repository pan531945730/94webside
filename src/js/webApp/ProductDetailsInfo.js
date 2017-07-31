;
$(function() {
    require('../../common/layout.css');
    var JSBK = require('../../common/layout02.js');
    var Brideg = require('../../component/webapp/brideg.js');
    require('../../css/webApp/ProductDetailsInfo.css');
    var ProductId=JSBK.Utils.GetQueryString("ProductId");
    var obj=$("#proList");
    var boxHei;
    var bankData = {
        data: {
            "ProductId":ProductId
        },
        mFun: 'GetProductDetailInfo',
        sucFun : function(v){
            inti(v); 
            boxHei=$('.pro-list').height();
            Brideg.webHigh({
                'handerName' : 'com.hongzhe.bank94.LayoutWebHigh',
                'webHigh' : boxHei,
            });
        },
        unusualFun : function(v){}
    }
    JSBK.Utils.postAjax(bankData);
    function inti(v){
    	var data=v.ProductInfoSettingNode;
		var html="";
		for (var i = -1; i < data.length; i++) {
            var Question,Answer;
            if (i==-1){
                Question="1.基本信息介绍";
                Answer=v.ProjectDetail;
            }else{
                Question=data[i].Question;
                Answer=data[i].Answer;
            };
			var lihtml='<li><div class="topbox">';
                lihtml+='<span class="down"></span>';
                lihtml+='<span class="icon">Q'+(i+2)+'</span>';
                lihtml+='<p>'+Question+'</p>';
            	lihtml+='</div>';
           		lihtml+=' <div class="pro-txt">'+Answer+'</div>';
        		lihtml+='</li>';
			obj.append(lihtml);
		}		
    };

    obj.on("click",".topbox",function(){
        var t=$(this).find(".down");
        var txt=$(this).siblings(".pro-txt");
        if (!t.hasClass("up")){
            $('.pro-txt').hide();
            $('.down').removeClass('up');
            t.addClass("up");
            txt.show();
        }else{
            t.removeClass("up");
            txt.hide();
        };
        boxHei=$('.pro-list').height();
        Brideg.webHigh({
            'handerName' : 'com.hongzhe.bank94.LayoutWebHigh',
            'webHigh' : boxHei,
        });
    })
});