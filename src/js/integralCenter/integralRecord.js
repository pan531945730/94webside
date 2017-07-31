;
$(function() {
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/integralCenter/integralRecord.css'); 
    require('../../component/website/Load.css');
    
    var load = $('.load'),
        icNum = $('.ic-num'),
        overtime = $('#overtime');
    var baseDate = {
        data : {},
        mFun : 'GetIntegralAccount',
        beforeFun : function(){
            load.show();
        },
        sucFun : function(v){
            load.hide();
            icNum.html(v.accountIntegral);
            overtime.html(v.integralDrawEndTime);
        },
        unusualFun : function(v){
            load.hide();
        }

    }; 
    JSBK.Utils.postAjax(baseDate);

    //模板
    function htmlTep(dd,arr){
        $.each(dd,function(i,v){
            var html = '',
                integralText = '',
                integral = v.integral;
            if(integral > 0){
                integralText = '+'+integral;
                numCss = '';
            }else{
                integralText = integral;
                numCss = ' reduce';
            }
            html += '<li><em class="ir-ico"></em>'; 
            html += '<div class="ir-tit"><p>'+v.title+'</p><span>'+v.lastUpdateTimeText+'</span></div>';
            html += '<div class="ir-num'+numCss+'">'+integralText+'</div>';
            html += '</li>';
            arr.push(html);
        })
    }

    //初始化
    var sfData = {
        data: {
            'PageIndex': 1,
            'PageSize' : 10
        },
        mFun: 'GetIntegralConsumptionList',
        beforeFun : function(){
            load.show();
        },
        sucFun : function(v){
            var arr = [] ;
            load.hide();
            if(!v || v.length == 0){
               return;
            }
            htmlTep(v,arr);
            $('.ir-info').append(arr.join(''));
            if(v.length >= 10){
                var moreIscroll = require('../../ui/moreIscroll.js');
                new moreIscroll({
                    cont : '.ir-cont',
                    info : '.ir-info',
                    ajaxFun : 'GetIntegralConsumptionList',
                    page : 2,
                    pageSize: 10,
                    htmlTep : htmlTep
                });
            }

        },
        unusualFun : function(v){
            load.hide();
            
        }
    }
    JSBK.Utils.postAjax(sfData);  

});