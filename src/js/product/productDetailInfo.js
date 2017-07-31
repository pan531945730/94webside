;
$(function(){
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/product/productDetailInfo.css'); 
    require('../../component/website/Load.css');

    var load = $('.load'),
        projectDetail = $('#project_detail'),
        securityDetail = $('#security_detail');
    //初始化
    var detailInfoData = {
        data:{
            'ProductId' : JSBK.Utils.GetQueryString('ProductId')
        },
        mFun:'GetProductDetailInfo',
        beforeFun : function(){
            load.show();
        },
        sucFun:function(v){
            load.hide();
            if(location.hash == '#projectDetail'){
                projectDetail.html(v.ProjectDetail).show();
                securityDetail.hide();
            }else if(location.hash == '#securityDetail'){
                securityDetail.html(v.FundSecurityDetail).show();
                projectDetail.hide(); 
            }          
                       
        }
    }
    JSBK.Utils.postAjax(detailInfoData);

});