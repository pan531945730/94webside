;
$(function() {
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/accountCenter/withdraw.css'); 
    require('../../component/website/Load.css');
    
    var wdPrice = $('#wd-price'),
        confirmBtn = $('#confirm_btn'),
        errorTip = $('.error-tip').find('span'),
        clear = $('.clear'),
        defTip = $('.def-tip'),
        earnOut = defTip.find('i');
        wdAll = $('.wd-all'),
        accountBalance = 0, //余额
        inputAmount = 0,//提取金额
        result = 0, //手续费
        outstandAmount = 0, //未满七天金额
        dueAmoun = 0,//已满7天余额
        poundage = 0,//手续费
        ordinaryWithdrawalsFee = 0;//提现费率
    
    wdPrice.focus();
    wdPrice.trigger('focus');
    var load = $('.load');
    //页面信息
    var initData = {
        data: {},
        mFun: 'GetWithdrawalInfo',
        beforeFun : function(){
            load.show();
        },
        sucFun : function(v){
            load.hide();
            accountBalance = v.accountBalance;
            poundage = v.poundage.toFixed(2);
            outstandAmount = v.outstandAmount;
            dueAmoun = v.dueAmount;
            ordinaryWithdrawalsFee = v.ordinaryWithdrawalsFee;

            $('.ac-price').html(v.accountBalanceText);
            $('#bank').attr('src',v.bankLogo);  
            $('#bank_name').html(v.bankName);
            $('#bank_code span').html(v.bankCardId);
            wdAll.data('allprice',v.accountBalanceText);   
            $('.pay-tip i').html(poundage); 
            $('.wd-rule a').attr('href',v.ruleUrl);   
            earnOut.html(outstandAmount);                      
        },
        unusualFun : function(v){
            load.hide();
        }
    }        
    //初始化   
    JSBK.Utils.postAjax(initData);
    wdPrice.on('input',function(){
        $(this).next('.clear').css('display', 'block');
        errorTip.html('');
        defTip.show();      
    })
    
    wdPrice.on('keyup',function(){
        inputAmount = parseFloat($(this).val());
        if(outstandAmount <= 0){
            result = poundage;
        }else{
            //提现金额>已满七天余额
            if(inputAmount > dueAmoun){
                result = (inputAmount - dueAmoun)*ordinaryWithdrawalsFee;
                result = result > poundage ? result : poundage;
            }else{
                result = poundage;
            }
        }
        result = result.toString().replace(/(\.\d{2})\d+$/,"$1")
        $('.pay-tip i').html(result);
    })

    //清除按钮交互
    wdPrice.on('focus',function(){
        if($(this).val() != ''){
            $(this).next('.clear').css('display', 'block');
        }
    })
    
    wdPrice.on('blur',function(){
        var _this = $(this);
        setTimeout(function(){
             _this.next('.clear').css('display', 'none');
         },200)       
    })

    clear.on('click',function(){
        $(this).prev('input').val('');
        $(this).css('display', 'none');
        errorTip.hide();
        defTip.show();
    })

    wdAll.on('click',function(){
        var allPrice = $(this).data('allprice');
        wdPrice.val(allPrice);
        wdPrice.trigger('keyup');
    })
    var Confirm = require('../../ui/Confirm.js');
    //确定
    var openConfirm;
    confirmBtn.on('click',function(){
        inputAmount = wdPrice.val();

        if(inputAmount == null || inputAmount == ''){
            errorTip.html('请输入提现金额');
            defTip.hide();
            return false;
        }

        if(inputAmount.length>10){
            errorTip.html('提现金额最多10位数');
            defTip.hide();
            return false;
        }

        if(inputAmount > accountBalance){
            errorTip.html('提现金额大于账户可用余额');
            defTip.hide();
            return false;
        }

        if(!openConfirm){
            openConfirm = new Confirm({
                titleHtml : '交易密码',
                infoHtml : function(){
                    return $('<p><label>提现金额</label><span id="amount">'+inputAmount+'</span></p>'+
                        '<p><label>手续费</label><span id="result">'+result+'</span></p>'+
                        '<input type="password" placeholder="请输入您的交易密码" value="" class="dialog-inp" id="wd-pwd">'+
                        '<p class="error-tip" id="dia_tip"><span></span></p>');
                },
                confirmCallback : function(){
                    var wdpwdVal = $('#wd-pwd').val(),
                        errorTip = $('#dia_tip');
                    if(wdpwdVal == null || wdpwdVal == ''){
                        errorTip.html('请输入您的交易密码');
                        return false;
                    }

                    var sucData = {
                        data: {
                            'Amount': inputAmount,
                            'TradePswd' : wdpwdVal
                        },
                        mFun: 'MemberWithdrawals',
                        sucFun : function(v){
                            withdrawId = v.id;
                            location.href='/pay/WithdrawalsComplete?withdrawId='+withdrawId;
                        },
                        unusualFun : function(v){
                            errorTip.html(v.ES);
                        }
                    }        
                    
                    JSBK.Utils.postAjax(sucData)
                },
                cancleCallback: function(){
                    $('#wd-pwd').val('');
                    $('#dia_tip').html('');
                    openConfirm.dialog.close();
                }
            });
        }
        $('#amount').html(inputAmount);
        $('#result').html(result);
        openConfirm.open();
        
    })
    
});