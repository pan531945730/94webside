;
$(function() {
    require('../../../common/layout.css');
    require('../../../common/layout.js');
    require('../../../css/activity/20170518/buyDetail.css');
    require('../../../component/website/Load.css');
    var Confirm = require('../../../ui/Confirm.js');
    var fmPrice = $('#fm_price'),
        buyBtn = $('#buy_btn'),
        dlgMask = $('.dlg-mask'),
        money = $('#money'),
        buyRecord = $('.buy-record'),
        load = $('.load'),
        defaultVal = 0,
        qtje = 5000,
        unitPrice = 1000,
        maxBuy = 100000,
        jsje = 0,
        accountBalance = 0,
        productId,
        typeId,
        status;

    function toast(txt,interval){
        dlgMask.show().find('.dlg-info').html(txt);
        setTimeout(function(){
            dlgMask.hide();
        },interval || 1000)
    }
    //购买记录
    var buyRecordData = {
        data:{
            AID: '20170518',
            Action : 'getproductbuyrecord',
            SourceType: 5
        },
        mFun:'ActivityMain',
        sucFun: function(v){
            var message = v.Message;
            if(message == '0|0' ){
                buyRecord.hide();
            }else{
                var buyArr = message.split('|');
                $('#buyAmount').html(buyArr[0]);
                $('#buyIncome').html(buyArr[1]);
                buyRecord.show();
            }
        },
        unusualFun : function(){
        },
        notLogged : function(){
            window.location.href = '/Activity/Exclusive20170218';
        }
    }
    //初始化
    var productIdData = {
        data:{
            AID: '20170518',
            Action : 'getproductdetail',
            SourceType: 5
        },
        mFun:'ActivityMain',
        beforeFun : function(){
            load.show();
        },
        sucFun: function(v){
            load.hide();
            productId = v.XData_1;
            status = v.Status;
            var productDetailData = {
                data:{
                    'ProductId': productId
                },
                mFun:'GetProductDetail',
                beforeFun : function(){
                },
                sucFun: function(v){
                    jsje = v.remainingAmount;
                    accountBalance = v.accountBalance;
                    var remaining = v.remainingAmountText;
                    $('#balance').html(v.accountBalanceText);
                    $('#residual').html(remaining);
                    typeId = v.typeId;
                    if(remaining === '0.00'){
                        buyBtn.html('已售罄').addClass('unbtn');
                    }
                },
                unusualFun : function(){
                },
                notLogged : function(){
                    window.location.href = '/Activity/Exclusive20170218';
                }
            }
            if(productId > 0){
                JSBK.Utils.postAjax(productDetailData);
                JSBK.Utils.postAjax(buyRecordData);
            }
            
        },
        unusualFun : function(){
            load.hide();
        },
        notLogged: function(){
            window.location.href = '/Activity/Exclusive20170218';
        }
    }
    JSBK.Utils.postAjax(productIdData);    
   
    fmPrice.on('input',function(){
        var val = $(this).val();
        val = parseInt(val.substring(0,10));
        var moneyVal = parseInt(val*8.30*180/365)/100 || '0.00';
        money.html(moneyVal+'元');
        $(this).val(val);

    })
    buyBtn.on('click',function(){
        var that = $(this);
        defaultVal = fmPrice.val();
        if(that.hasClass('unbtn')){
            e.preventDefault();
            return;
        }else{
            
            if(productId <= 0){
                //非专属会员
                toast('您不是专属会员，请联系客服');
                return;
            }
            if(status == 3){
                //活动未开始
                toast('活动未开始');
                return;
            }
            if(status == 4){
                //活动已结束
                toast('活动已结束');
                return;
            }
            if(defaultVal == null || defaultVal == '' || (defaultVal< qtje && defaultVal < jsje)){ //若输入金额<起投金额
                toast('该产品起投金额为'+qtje+'元');
                return;
            }
            if(defaultVal>qtje && defaultVal%unitPrice != 0){ //输入金额>=起投金额≠1000的整数倍
                toast('该产品的投资金额为'+unitPrice+'的整数倍');
                return;
            }
            if(defaultVal > maxBuy){ //输入金额或累加投资金额>100000元
                toast('该产品的投资上限为'+maxBuy+'元');
                return;
            }
            if(defaultVal>accountBalance){//输入金额>可用余额
                toast('可用余额不足，请前往APP充值');
                return;
            }
            if(defaultVal >= jsje && jsje < qtje){ //输入金额>=剩余可投金额
                /*toast('本期产品仅剩'+jsje+'元');
                return;*/
                defaultVal = jsje;
                fmPrice.val(defaultVal);
            }
            //交易密码弹窗 
             var isConfirm = true;
             var pwdConfirm = new Confirm({
                titleHtml : '交易密码',
                infoHtml : function(){
                    return $('<input type="password" placeholder="请输入您的交易密码" value="" class="dialog-inp" id="wd-pwd">'+
                        '<p class="error-tip"><span></span></p>');
                },
                confirmCallback : function(){
                    wdpwdVal = $('#wd-pwd').val();
                    errorTip = $('.error-tip');
                    if(wdpwdVal == null || wdpwdVal == ''){
                        errorTip.html('请输入您的交易密码');
                        return false;
                    }
                    if(!isConfirm) return;
                    isConfirm = false;
                    //购买
                    var buyData = {
                        data:{
                            'ProductID': productId,
                            'ProductTypeId': typeId,
                            'TradePassword': wdpwdVal,
                            'BuyProductPrice': defaultVal,
                            'DeviceType' : 4
                        },
                        mFun:'BuyProduct',
                        beforeFun : function(){
                            load.show();
                        },
                        sucFun: function(v){
                            load.hide();
                            isConfirm = true;
                            toast('购买成功');
                            setTimeout(function() {
                                 window.location.reload();
                            },1000);
                        },
                        unusualFun : function(v){
                            load.hide();
                            isConfirm = true;
                            errorTip.html(v.ES);
                        },
                        notLogged: function() {
                            window.location.href = '/Activity/Exclusive20170218';
                        }
                        
                    }
                    JSBK.Utils.postAjax(buyData);
                }
            })
            pwdConfirm.open();
        }
    })
    //微信分享
    JSBK.shareWinxin({
        'title': '5月专属日，轻松即可点亮本月小表情，另外还有518理财狂欢“月月增”专属产品，最高至10%。继续解锁12个表情，离终极大奖更进一步噢~',
        'desc': '5月专属日，轻松即可点亮本月小表情，另外还有518理财狂欢“月月增”专属产品，最高至10%。继续解锁12个表情，离终极大奖更进一步噢~',
        'link': 'http://np.94bank.com/Activity/Special51820170518',
        'imgUrl': window.Zepto.linkUrl+'/dist/Activity/img/20170518/special518/share.png'
    }) 
});