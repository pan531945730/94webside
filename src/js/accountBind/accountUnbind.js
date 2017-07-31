;
$(function() {
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/accountBind/accountUnbind.css');   

    var Confirm = require('../../ui/Confirm.js');
    var Alert = require('../../ui/Alert.js');

    var openConfirm = new Confirm({
        titleHtml : '交易密码',
        infoHtml : function(){
            return $('<input type="password" placeholder="请输入您的交易密码" value="" class="dialog-inp" id="unbind-pwd">'+
                '<p class="error-tip"><span></span></p>');
        },
        confirmCallback : function(){

            var unpwdVal = unpwd.val();
            if(unpwdVal == null || unpwdVal == ''){
                errorTip.html('请输入登录密码');
                return false;
            }
            var unbindData = {
                data: {
                    'TradePassword' : unpwdVal
                },
                mFun: 'UnBindMemberOpenId',
                sucFun : function(v){
                    openAlert.open();
                    $('.g-d-dialog').eq(0).hide();
                },
                unusualFun : function(v){
                    errorTip.html(v.ES);
                }
            } 
            JSBK.Utils.postAjax(unbindData)
        }
    });

    var openAlert = new Alert({
        titleHtml : '您已解除绑定94账户',
        clickBtnCallback : function(){
            WeixinJSBridge.call('closeWindow');
            //WeixinJSBridge.invoke('closeWindow', {}, function (res) {});
        }
    });

    var unpwd = $('#unbind-pwd'),
        errorTip = $('.error-tip').find('span');

    $('.unbd-btn').on('click',function(){
        openConfirm.open();
        unpwd.focus();
        unpwd.trigger('focus');
        unpwd.on('input',function(){
            errorTip.html('');
        })

    })
    
    
});