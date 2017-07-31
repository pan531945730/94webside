;
$(function() {
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/accountCenter/accountCenter.css'); 
    require('../../component/website/Load.css');
    require('../../component/website/footBar.js');
    var Confirm = require('../../ui/Confirm.js');
    var dealConfirm = new Confirm({
        titleHtml : '修改交易密码',
        confirmBtnHtml : '立即下载',
        infoHtml : function(){
            return $('<p class="ac-change">暂不提供修改交易密码功能哦，您可以下载APP</p>');
        },
        confirmCallback : function(){
            location.href = 'http://www.94bank.com/down.html';
        }
    });
    var loginConfirm = new Confirm({
        titleHtml : '修改登录密码',
        confirmBtnHtml : '立即下载',
        infoHtml : function(){
            return $('<p class="ac-change">暂不提供修改登录密码功能哦，您可以下载APP</p>');
        },
        confirmCallback : function(){
            location.href = 'http://www.94bank.com/down.html';
        }
    });
    var acCont = $('.ac-cont'),
        acPage = $('.ac-page'),
        load = $('.load'),
        unloginDialog = $('.unlogin-dialog'),
        acIco = $('.ac-ico'),
        acCont = $('.ac-cont'),
        wH = window.innerHeight,
        contH = acCont.height();
    
    //理财中心、账户中心切换
    if(wH > contH){
        acCont.css('height',wH);
        acPage.css('height',wH);
    }else{
        acPage.css('height',contH);
    }
    acIco.on('click',function(e){
        e.stopPropagation();
        acCont.addClass('cont-visit');
        acCont.find('div').css('pointer-events','none');
        acCont.unbind().click(function(){
            $(this).removeClass('cont-visit');
            acCont.find('div').css('pointer-events','auto');
        })
    });

    //账户中心
    var acPic = $('.ac-pic'),
        acTel = $('#ac_tel'),
        smrz = $('.smrz'),
        smrzText = smrz.find('span'),
        yhk = $('.yhk'),
        yhkText = yhk.find('span'),
        withdraw = $('.withdraw'),
        recharge = $('.recharge');

    var GetMemberInfo = {
        data : {},
        mFun : 'GetMemberInfo',
        beforeFun : function(){
            load.show();
        },
        sucFun : function(v){
            load.hide();
            v.headPhoto!='' && acPic.attr('src',v.headPhoto);
            v.phone !='' && acTel.html(v.phone);
            if(v.realNameAuthen == 1){
                smrzText.html('已认证');
                smrz.addClass('no-arrow');
                var yhkFun = function(){
                    var yhkData = {
                        data : {
                            "CallerType" : 7,
                            "Param" : ''
                        },
                        mFun : 'RouteAPI',
                        sucFun : function(v){
                            if(v.ReturnType == 0){ //成功
                                //location.href = '/pay/MemberRecharge';
                            }else{ //失败
                                location.href = v.CurrentUrl+'?returl='+v.ReturnUrl;
                            }
                        }
                    }
                    JSBK.Utils.postAjax(yhkData);
                }

                if(v.bankCardAuthen == 0){
                    yhkText.html('立即绑卡');
                    //yhk.attr('href','Identification');
                    yhk.on('click',yhkFun);
                }else if(v.bankCardAuthen == 1){
                    if(!v.existsOpenAccountName){
                        yhkText.html('完善信息');
                        yhk.on('click',yhkFun);
                        //yhk.attr('href','/Member/BankSub');
                    }else{
                        yhkText.html(v.bankName);
                        yhk.addClass('no-arrow');
                    }
                }
            }else{
                smrzText.html('未认证');
                //smrz.attr('href','Identification');
                smrz.on('click',function(){
                    var smrzData = {
                        data : {
                            "CallerType" : 6,
                            "Param" : ''
                        },
                        mFun : 'RouteAPI',
                        sucFun : function(v){
                            if(v.ReturnType == 0){ //成功
                                //location.href = '/pay/MemberRecharge';
                            }else{ //失败
                                location.href = v.CurrentUrl+'?returl='+v.ReturnUrl;
                            }
                        }
                    }
                    JSBK.Utils.postAjax(smrzData);
                })
                if(v.bankCardAuthen == 0){
                    yhkText.html('立即绑卡');
                    yhk.attr('href','Identification');
                }else if(v.bankCardAuthen == 1){
                    if(!v.existsOpenAccountName){
                        yhkText.html('完善信息');
                        yhk.attr('href','/Member/BankSub');
                    }else{
                        yhkText.html(v.bankName);
                        yhk.addClass('no-arrow');
                    }
                    
                }
            }

            withdraw.on('click',function(){
                var withdrawData = {
                    data : {
                        "CallerType" : 3,
                        "Param" : ''
                    },
                    mFun : 'RouteAPI',
                    sucFun : function(v){
                        if(v.ReturnType == 0){ //成功
                            location.href = '/pay/MemberWithdrawals';
                        }else{ //失败
                            location.href = v.CurrentUrl+'?returl='+v.ReturnUrl;
                        }
                    }
                }
                JSBK.Utils.postAjax(withdrawData); 
            })

            recharge.on('click',function(){
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
        }
        
    }

    //理财中心
    var allprice = $('.ac-allprice'),
        zhye = $('#zhye'),
        zrsy = $('#zrsy'),
        ljsy = $('#ljsy'),
        jxlc = $('.jxlc'),
        jxlcText = jxlc.find('span'),
        gj = $('.gj'),
        gjText = gj.find('span'),
        yhqText = $('.yhq span'),
        zdText = $('.zd span'),
        acEye = $('.ac-eye');
    var GetMemberAccount = {
        data : {},
        mFun : 'GetMemberAccount',
        beforeFun : function(){
            load.show();
        },
        sucFun : function(v){
            load.hide();
            allprice.html(v.totalAssets);
            allprice.data('totalassets',v.totalAssets);
            zhye.html(v.balanceText);
            zhye.data('price',v.balanceText);
            zrsy.html(v.yesterdayEarn);
            zrsy.data('price',v.yesterdayEarn);
            ljsy.html(v.accumulatEarn);
            ljsy.data('price',v.accumulatEarn);
            jxlcText.html(v.regularAmountText+'元');
            gjText.html(v.currentAmountText+'元');
            yhqText.html(v.CardCouponCount+'张');
            jxlc.attr('href','/Order/MyRegularProductData?regularAmount='+v.regularAmountText+'&surplusInterestText='+v.surplusInterestText);
            gj.attr('href','/Order/MyCurrentProductData?currentAmount='+v.currentAmountText+'&yesterdayEarn='+v.yesterdayEarn);
            $('.jf span').html(v.accountIntegral);
            var eyeCookie = JSBK.Utils.getCookie('eye');
            if(eyeCookie){
                hideEye();
            }else{
                showEye();
            }

            JSBK.Utils.postAjax(GetMemberInfo);
        },
        notLogged : function(){
            load.hide();
            unloginDialog.show();
        },
        unusualFun : function(){
            load.hide();
            unloginDialog.show();
        },
        failFun : function(){
            //未登录状态
            load.hide();
            unloginDialog.show();
        } 
    }
    JSBK.Utils.postAjax(GetMemberAccount);
   
    function hideEye(){
        acEye.addClass('close-eye');
        allprice.html('********');
        zhye.html('********');
        zrsy.html('********');
        ljsy.html('********');
    }
    function showEye(){
        acEye.removeClass('close-eye');
        allprice.html(allprice.data('totalassets'));
        zhye.html(zhye.attr('data-price'));
        zrsy.html(zrsy.attr('data-price'));
        ljsy.html(ljsy.attr('data-price'));
    }
    
    acEye.on('click',function(){
        if(!$(this).hasClass('close-eye')){
            $(this).addClass('close-eye');
            hideEye();
            JSBK.Utils.setCookie('eye',1);
        }else{
            $(this).removeClass('close-eye');
            showEye();
            JSBK.Utils.deleteCookie('eye');
        }
    })

    $('.jymm').on('click',function(){
        dealConfirm.open();
    })
    $('.dlmm').on('click',function(){
        loginConfirm.open();
    })

    //退出
    $('.ac-exit').on('click',function(){
        var memberExit = {
            data:{},
            mFun:'MemberExit',
            sucFun:function(){
                window.location.href = '/member/login';
            }
        }
        JSBK.Utils.postAjax(memberExit);
    })
    //邀请好友拖拽

    var acInvite = $('.ac-invite'),
        acInviteEle = acInvite.get(0),
        inviteHei = acInvite.height(),
        inviteWid = acInvite.width(),
        winHei = $(window).height(),
        winWid = $(window).width(),
        screenHei = winHei - inviteHei;
        screenWid = winWid - inviteWid;
    acInviteEle.addEventListener('touchmove', function(event) {
        event.preventDefault();//阻止其他事件
        // 如果这个元素的位置内只有一个手指的话
        if (event.targetTouches.length == 1) {
            var touch = event.targetTouches[0];  // 把元素放在手指所在的位置
            if(touch.pageX > screenWid || touch.pageX < 0 || touch.pageY > screenHei || touch.pageY < 0){
                event.preventDefault();
            }else{
                acInviteEle.style.left = touch.pageX + 'px';
                acInviteEle.style.top = touch.pageY + 'px';
            }
        }
    }, false);
});