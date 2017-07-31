;
$(function() {
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/accountCenter/rechargeStatus.css'); 
    
    var staIco = $('.sta'),
        staText = $('.sta-text'),
        stpCur = $('.step-li').slice(1,3).find('span'),
        confirmBtn = $('#confirm_btn'),
        sta = staIco.data('sta'),
        rechargeId = staIco.data('rechargeid'),
        ajaxSta;

    //成功
    function sucSta(){
        staIco.removeClass('fail load').addClass('suc');
        staText.html('充值成功');
        stpCur.addClass('cur');
        confirmBtn.html('完成');
    }

    //失败
    function failSta(){
        staIco.removeClass('suc load').addClass('fail');
        staText.html('充值失败');
        stpCur.removeClass('cur');
        confirmBtn.html('再试一次');
    }

    //充值中
    function loadSta(){
        staIco.removeClass('suc fail').addClass('load');
        staText.html('充值中');
        stpCur.removeClass('cur');
        confirmBtn.html('完成');
    }

    var loadData = {
        data: {
            'RechargeId': rechargeId
        },
        mFun: 'GetRechargeStatus',
        sucFun : function(v){
            ajaxSta = v.status;
            if(ajaxSta === 1){
                loadSta();
            }else if(ajaxSta === 2){
                sucSta();
            }else{
                failSta();
            }
            
        },
        unusualFun : function(v){
            failSta();
        }
    }
    
    function checkLoad(){
        var i = 0,
            max = 1,
            isLoad,
            interval;
        interval = setInterval(function(){
            if(ajaxSta != 1){
                clearInterval(interval);
                return ;
            }else{
                if(i === 30){
                   clearInterval(interval); 
                   failSta();
                   return;
                }
            }
            JSBK.Utils.postAjax(loadData); 
            i++;
        },1000);    
    }

    if(sta === 1){
        loadSta();
        checkLoad();
    }else if(sta === 2){
        sucSta();
    }else{
        failSta();
    }
});