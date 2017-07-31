;
$(function() {
    require('../../../common/layout.css');
    require('../../../common/layout.js');
    require('../../../css/activity/20170218/buyDetail.css');
    require('../../../component/activity/20170218/wxShare.js');
    var Confirm = require('../../../ui/Confirm.js');
    var Blink = require('../../../ui/Blink.js');
    var domain = 'http://np.94bank.com';
    if (window.location.host.indexOf('192.168.2') >= 0) {
        domain = 'http://192.168.2.22:8040';
    }
    if (window.location.host.indexOf('192.168.1.') >= 0) {
        domain = window.location.origin;
    }
    var fmPrice = $('#fm_price'),
        buyBtn = $('#buy_btn'),
        defaultVal = 0,
        qtje = 1000,
        unitPrice = 1000,
        maxBuy = 50000,
        jsje,
        accountBalance,
        radingAmount = 0,
        maxInterest = 0,
        InterestRate = 0,
        memberid = 4020, //qwerty
        qtjeTip,
        unitPriceTip,
        maxBuyTip,
        jsjeTip,
        accountBalanceTip,
        succTip;

    //初始化
    var memberidData = {
        data:{},
        mFun:'GetMid',
        sucFun: function(v){
            memberid = v;
            getAmount();
            getBuyAmount();
        }
    }
    JSBK.Utils.postAjax(memberidData);

    var $residual = $('#residual');
    var $balance = $('#balance');
    function getAmount() {
        $.ajax({
                type: 'post',
                dataType: 'json',
                url: domain + '/api/jsonAPI.aspx?wMethod=101',
                data: {
                    memberid : memberid
                },
                beforeSend: function(){
                },
                //请求成功时执行
                success: function(v) {
                    if(v.ReturnCode == 0){
                       var data = v.Data[0];
                       jsje = (data.RemainingAmount*1).toFixed(2);
                       accountBalance = (data.AccountBalance*1).toFixed(2); 
                       $residual.html(jsje);
                       $balance.html(accountBalance);
                       if(data.Status == 1 || accountBalance <= 0){
                            buyBtn.addClass('nubtn').html('已售罄').off('click');
                       }                       
                   }else{
                        //alert('error');
                   }                

                },
                error: function(res){
                    console.log();
                }
                
            })
    }
    var $buyAmount = $('#buyAmount');
    var $buyIncome = $('#buyIncome');
    var $buyYield = $('#buyYield');
    function getBuyAmount() {
        $.ajax({
            type: 'post',
            dataType: 'json',
            url: domain + '/API/jsonAPI.aspx?wMethod=102',
            data: {
                memberid : memberid
            },
            //请求成功时执行
            success: function(v) {
                if(v.ReturnCode == 0){
                   var data = v.Data[0];
                   radingAmount = (data.radingAmount*1).toFixed(2);
                   maxInterest = (data.MaxInterest*1).toFixed(2);
                   InterestRate = data.InterestRate + '%'; 
                   $buyAmount.html(radingAmount);
                   $buyIncome.html(maxInterest);
                   $buyYield.html(InterestRate);
               }else{
                    
               }                

            },
            error: function(){

            }
            
        })
    }
    var $money = $('#money');
    fmPrice.on('input',function(){
        var val = $(this).val();
        val = parseInt(val.substring(0,10));
        var money = parseInt(val*9.68*180/365)/100 || '0.00';
        $money.html(money);
        $(this).val(val);

    })
    buyBtn.on('click',function(){
        var that = $(this);
        defaultVal = fmPrice.val();
        if(that.hasClass('nubtn')){
            e.preventDefault();
            return;
        }else{
            
            if(defaultVal == null || defaultVal == '' || defaultVal<qtje){ //若输入金额<起投金额
                if(!qtjeTip){
                    qtjeTip = new Blink({
                        'blinkHtml' : '该产品起投金额为'+qtje+'元'
                    }) 
                }
                qtjeTip.open();  
                return;
            }
            if(defaultVal>qtje && defaultVal%unitPrice != 0){ //输入金额>=起投金额≠1000的整数倍
                if(!unitPriceTip){
                    unitPriceTip = new Blink({
                        'blinkHtml' : '该产品的投资金额为'+unitPrice+'的整数倍'
                    }) 
                }
                unitPriceTip.open(); 
                return;
            }
            if(defaultVal > maxBuy){ //输入金额或累加投资金额>50000元
                if(!maxBuyTip){
                    maxBuyTip = new Blink({
                        'blinkHtml' : '该产品的投资上限为'+maxBuy+'元'
                    }) 
                }
                maxBuyTip.open();  
                return;
            }

            if(defaultVal > jsje){ //输入金额>剩余可投金额
                if(!jsjeTip){
                    jsjeTip = new Blink({
                        'blinkHtml' : '本期产品仅剩'+jsje+'元'
                    }) 
                }
                jsjeTip.open();
                return;
            }
            if(defaultVal>accountBalance){//输入金额>可用余额
                if(!accountBalanceTip){
                    accountBalanceTip = new Blink({
                        'blinkHtml' : '可用余额不足，请前往APP充值'
                    }) 
                }
                accountBalanceTip.open();
                return;
            }
            //交易密码弹窗 
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
                    //购买
                    $.ajax({
                        type:'post',
                        dataType:'json',
                        url: domain + '/API/jsonAPI.aspx?wMethod=100',
                        data: {
                            memberid: memberid,
                            tradepassword: wdpwdVal, //交易密码
                            buyproductprice: defaultVal //购买金额
                        },
                        //请求成功时执行
                        success: function(v) {
                            if(v.ReturnCode == 0){
                               if(!succTip){
                                   succTip = new Blink({
                                       'blinkHtml' : '购买成功'
                                   }) 
                               }
                               succTip.open();

                               setTimeout(function() {
                                    window.location.reload();
                               },1000);
                            }else{
                               errorTip.html(v.ErrorMsg); 
                            }
                        },
                        error: function(){

                        }
                            
                    })
                }
            })
            pwdConfirm.open();
        }
    })

});