;
$(function() {
    require('../../../common/layout.css');
    require('../../../common/layout.js');
    require('../../../component/website/Load.css');
    var rankData = require('../../../component/activity/20170528/rank.js');
    require('../../../component/activity/20170528/rank.css');
    require('../../../css/activity/20170528/dragonBoatFestival.css');   
    
    var dlgRuleMask = $('#dlg_rule_mask'),
        dlgLuckMask = $('#dlg_luck_mask'),
        dlgPrizeMask = $('#dlg_prize_mask'),
        BlinkMask = $('.blink-mask'),
        prize = $('.prize'),
        load = $('.load'),
        luck = $('.luck'),
        residue = $('#residue');

    function toast(txt,interval){
        BlinkMask.show().find('.blink-info').html(txt);
        setTimeout(function(){
            BlinkMask.hide();
        },interval || 1000)
    }
    //查看规则
    $('.rule').on('click',function(){
        dlgRuleMask.show();
    })

    dlgRuleMask.on('click',function(event){
        if (event.target === this) {
             event.stopPropagation();
             $(this).hide();
        }
    })

    if (!JSBK.Utils.getCookie('ruledlg')) {
        JSBK.Utils.setCookie('ruledlg', 'yes', 36500);
        dlgRuleMask.show();
    }

    $('.dbf-mod').on('click','.luck',function(){
        dlgLuckMask.show();
    })

    $('body').on('click','#luck_btn',function(){
        dlgLuckMask.hide();
    })

    //初始化接口
    var intData = {
        data: {
            AID: '20170528',
            Action: 'getrow',
            SourceType: 1
        },
        mFun: 'ActivityMain',
        sucFun: function(res) {
            var allNum = res.XData_1,
                level = res.XData_3,
                st = res.XData_4;

            $('#all').html(allNum);
            if(allNum < 1000){
                prize.addClass('nochance');
            }
            $('#my').html(res.XData_2);
            for(var i=0; i <= level; i++){
                $('.level'+i).show();
            }
            $('.dragon').attr('class','dragon st'+level);

            if( st > 0 ){
                luck.show();
                $('#luck_num').html(st);
            }
        },
        unusualFun: function(v) {
        }
    };

    //获取抽奖机会
    var openNumData = {
        data: {
            'AID': 20170528
        },
        mFun: 'GetLotteryDrawNum',
        sucFun : function(v){
            if(v == 0){
                prize.addClass('nochance');
            }
            residue.html(v);
        },
        unusualFun : function(v){
        }
    }

    //初始化H5与APP是否已桥接
    JSBK.bindJsBrideg(function(){
        JSBK.bindToken(function() {
          //已登录
          JSBK.Utils.postAjax(intData);
          JSBK.Utils.postAjax(rankData);
          JSBK.Utils.postAjax(openNumData);
        })
    },function(){
        load.show();
    });
    
    //抽奖
    prize.on('click',function(){
        var that = $(this),
            prizeSubtit = $('.prize-subtit'),
            prizeSt = $('.prize-st');

        if(that.hasClass('nochance')){
            return;
        }
        var prizeData = {
            data: {
                'AID': 20170528,
                'DrawTimes' : 1
            },
            mFun: 'LotteryDraw',
            beforeFun : function(){
                load.show();
            },
            sucFun : function(res){
                load.hide();
                if (res.Status == 0) {//中奖
                    var result = res.PrizeList[0];
                    if(result.PrizeType == 2) {
                        //红包券
                        prizeSubtit.html('获得<span>'+result.PrizeValue+'元</span>红包券奖励');
                        prizeSt.attr('class','prize-st hb');
                    }else if (result.PrizeType == 4) {
                        //现金
                        prizeSubtit.html('获得<span>'+result.PrizeValue+'元</span>现金奖励');
                        prizeSt.attr('class','prize-st xj');
                    }
                    dlgPrizeMask.show();                   
                } else if (res.Status == 1) {//未中奖
                    toast('未中奖');
                }else if (res.Status == 2) {//无可用抽奖机会
                    toast('无可用抽奖机会');
                    that.addClass('nochance');
                } else if (res.Status == 3) {//活动未开始
                    toast('活动未开始');
                } else if (res.Status == 4 || res.Status == 5) {//活动已结束 || 本轮活动已结束
                    toast('活动已结束');
                }else if (res.Status == 6) {//本轮活动已参与
                    toast('本轮活动已参与');
                }else if (res.Status == 9) {
                    that.addClass('nochance');
                }
                JSBK.Utils.postAjax(openNumData);
            }
        }
        JSBK.Utils.postAjax(prizeData);
    })
    $('.dlg-mask').on('click','#prize_btn',function(){
        dlgPrizeMask.hide();
    })

    //微信分享
    JSBK.shareWinxin({
        'title': '来94过端午，玩转龙舟抽奖励。5月28-30日三天购买9盈宝活动产品，即可享翻倍，及最高1888元现金奖励，同时还有幸运划手惊喜礼包等你来发现~',
        'desc': '来94过端午，玩转龙舟抽奖励。5月28-30日三天购买9盈宝活动产品，即可享翻倍，及最高1888元现金奖励，同时还有幸运划手惊喜礼包等你来发现~',
        'link': 'http://np.94bank.com/Activity/DragonBoatFestival2017',
        'imgUrl': window.Zepto.linkUrl+'/dist/Activity/img/20170528/dragonBoatFestival/share.png'
    }) 
});