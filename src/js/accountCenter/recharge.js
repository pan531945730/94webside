;
$(function() {
    require('../../common/layout.css');
    require('../../css/accountCenter/recharge.css'); 
    var recharge = $('#recharge'),
        confirmBtn = $('#confirm_btn'),
        errorTip = $('.error-tip').find('span'),
        fmInp = $('.fm-input input'),
        clear = $('.clear'),
        defTip = $('.def-tip');
    
    recharge.focus();
    recharge.trigger('focus');
        
    fmInp.on('input',function(){
        errorTip.html('');
        defTip.show();
        $(this).next('.clear').css('display', 'block');
    })

    //清除按钮交互
    fmInp.on('focus',function(){
        if($(this).val() != ''){
            $(this).next('.clear').css('display', 'block');
        }
    })

    fmInp.on('blur',function(){
        var _this = $(this);
        setTimeout(function(){
             _this.next('.clear').css('display', 'none');
         },200)       
    })

    clear.on('click',function(){
        $(this).prev('input').val('');
        $(this).css('display', 'none');
        errorTip.html('');
        defTip.show();
    })

    //确定
    confirmBtn.on('click',function(){
        var rechargeVal = recharge.val();

        if(rechargeVal == null || rechargeVal == ''){
            errorTip.html('充值金额不能为空');
            defTip.hide();
            return false;
        }
        /*else if(rechargeVal < 100){
            errorTip.html('单笔充值金额最低100元起');
            defTip.hide();
            return false;
        }*/

        if(rechargeVal.length > 10){
            errorTip.html('单笔充值金额最多不能超10位数');
            defTip.hide();
            return false;
        }

    })
    
});