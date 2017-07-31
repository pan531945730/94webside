;
$(function() {
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/integralCenter/integralCenter.css'); 
    require('../../component/website/Load.css');
    var alertUi = require('../../ui/Alert.js');
    var blink = require('../../ui/Blink.js');    
    var mbLoad = $('.load'),
        allPrice = $('#all_price'),
        overtime = $('#overtime'),
        signBtn = $('#sign-btn'),
        icInfo = $('.ic-info'),
        signAlert = null,
        signInBlink = null,
        signErrBlink = null,
        getErrorBlink = null,
        hasGetBlink = null;
    signBtn.on('click',function(){
        var signData = {
            data: {
            },
            mFun: 'SignIn',
            beforeFun : function(){
                mbLoad.show();
            },
            sucFun : function(v){
                mbLoad.hide();
                var status = v.status;
                if(status == 1){
                    if(!signAlert){
                        signAlert = new alertUi({
                            titleHtml : '<div class="integral">+<span>'+v.earnintegral+'</span> 积分</div>'
                                            +'<div class="suc-ico"><em></em></div>'
                                            +'<p class="suc">签到成功</p>'
                                            +'<p class="goon">恭喜您获得6积分,明天继续来签到</p>',
                            btnHtml: '知道啦',
                            clickBtnCallback : function(){
                                location.reload();
                            }
                        });
                    }
                    signAlert.open();
                }else if(status == 2){
                    if(!signInBlink){
                        signInBlink = new blink({
                            blinkHtml : '已签到'
                        });
                    }
                    signInBlink.open();
                }else{
                    if(!signErrBlink){
                        signErrBlink = new blink({
                            signErrBlink : '签到失败'
                        });
                    }
                    signErrBlink.open();
                }
                
            },
            unusualFun : function(v){
                mbLoad.hide();
            }
        }
        JSBK.Utils.postAjax(signData);
    })

    //模板
    function htmlTep(dd,arr){
        $.each(dd,function(i,v){
            var html = ''
                typeName = '',
                typeDone = '',
                typeIcon = '',
                typeUrl = '';
                switch (v.type){
                    case 1:
                    typeName = '去完成';
                    switch (v.integralNum){
                        case 1:
                        typeUrl = '/member/regist';
                        break;
                        case 2:
                        typeUrl = '/member/Identification';
                        break;
                        case 3:
                        typeUrl = 'javascript:void(0);';
                        typeDone = 'recharge';
                        break;
                        case 5:
                        case 7:
                        typeUrl = '/Member/Friend';
                        break;
                        default:
                        typeUrl = '/Product/ProductList';
                        break;
                    }
                    break;
                    case 2:
                    typeName = '领取';
                    typeDone = 'unget';
                    typeUrl = 'javascript:void(0);';
                    break;
                    default:
                    typeName = '已完成';
                    typeDone = 'done';
                    typeUrl = 'javascript:void(0);';
                    break;
                }
                
                switch (v.integralNum){
                    case 1:
                    typeIcon = 'newreg';
                    break;
                    case 2:
                    typeIcon = 'realname';
                    break;
                    case 3:
                    typeIcon = 'firrechage';
                    break;
                    case 5:
                    case 7:
                    typeIcon = 'invite';
                    break;
                    case 6:
                    typeIcon = 'password';
                    break;
                    default:
                    typeIcon = 'invest';
                    break;
                }
                
                
            html += '<li><div class="ic-lab"><i class="'+typeIcon+'"></i></div>';
            html += '<div class="ic-sty"><p>'+v.integralName+'</p>';
            html += '<p><span class="fc01">积分</span><span class="fc02">+'+v.earnIntegral+'</span></p></div>';
            html += '<a href="'+typeUrl+'" data-integralnum="'+v.integralNum+'" data-integraltype="'+v.integralType+'" class="ic-link '+typeDone+'">'+typeName+'</a></li>';
            arr.push(html);
        })
    }

    $('body').on('click','.recharge',function(){
        var rechargeData = {
            data : {
                "CallerType" : 2,
                "Param" : ''
            },
            mFun : 'RouteAPI',
            sucFun : function(v){
                if(v.ReturnType == 0){ //成功
                    location.href = '/pay/MemberRecharge';
                }else{ //失败
                    location.href = v.CurrentUrl+'?returl='+v.ReturnUrl;
                }
            }
        }
        JSBK.Utils.postAjax(rechargeData);
    })

    //初始化
    var initData = {
        data: {
        },
        mFun: 'GetIntegralTaskList',
        beforeFun : function(){
            mbLoad.show();
        },
        sucFun : function(v){
            var arr = [] ;
            mbLoad.hide();
            allPrice.html(v.accountIntegral);
            overtime.html(v.integralDrawEndTime);
            var tasklist = v.taskList;
            if(!tasklist || tasklist.length == 0){
               return ;
            }
            htmlTep(tasklist,arr);
            icInfo.append(arr.join(''));
            $('.password').parents('li').remove();
        },
        unusualFun : function(v){
            mbLoad.hide();
        }
    }
    JSBK.Utils.postAjax(initData);

    icInfo.on('click','.unget',function(){
        var that = $(this),
            num = that.attr('data-integralnum'),
            type = that.attr('data-integraltype');
        var IntegralTaskData = {
            data: {
                IntegralNum : num,
                IntegralType : type
            },
            mFun: 'IntegralTaskComplete',
            beforeFun : function(){
                mbLoad.show();
            },
            sucFun : function(v){
                mbLoad.hide();
                var status = v.status;
                if(status == 0){
                    that.removeClass('unget').html('去完成');
                    location.reload();
                }else if(status == 3){
                    if(!hasGetBlink){
                        hasGetBlink = new blink({
                            blinkHtml : '已经领取过了'
                        });
                    }
                    hasGetBlink.open();
                }else{
                    //失败
                    if(!getErrorBlink){
                        getErrorBlink = new blink({
                            blinkHtml : '领取失败'
                        });
                    }
                    getErrorBlink.open();
                }
                
            },
            unusualFun : function(v){
                mbLoad.hide();
            }
        }
        JSBK.Utils.postAjax(IntegralTaskData);
    })
});