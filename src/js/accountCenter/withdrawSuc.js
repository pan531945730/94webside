;
$(function() {
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/accountCenter/withdrawSuc.css'); 
    require('../../component/website/Load.css');
    var rechargeVal = JSBK.Utils.GetQueryString('withdrawId');
    var load = $('.load');
    //初始化
    var initData = {
        data: {
            'WithdrawalsId': rechargeVal
        },
        mFun: 'MemberWithdrawalsComplete',
        beforeFun : function(){
            load.show();
        },
        sucFun : function(v){
            load.hide();
            $('#wd_price').html(v.WithdrawalAmountText+'元');
            $('#wd_name').html(v.RealNameText);
            $('#wd_bank').html(v.BankCardIdText);

        },
        unusualFun : function(v){
            load.hide();
            $('.error-tip span').html(v.ES);
        }
    }        
    
    JSBK.Utils.postAjax(initData);
});