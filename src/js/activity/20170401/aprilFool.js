;
$(function() {
    require('../../../common/layout.css');
    require('../../../common/layout.js');
    require('../../../component/website/Load.css');
    require('../../../css/activity/20170401/aprilFool.css');
    var Blink = require('../../../ui/Blink.js');
    var prizeTip = new Blink({
            'blinkHtml' : '',
            'intervaltime' : 1000 
        })
    var dlgMask = $('.dlg-mask'),
        dlgRuleMask = $('#dlg_rule_mask'),
        dlgPrizeMask = $('#dlg_prize_mask'),
        dlgSurprise = $('#dlg_surprise_mask'),
        dlgAir = $('#dlg_air_mask'),
        dlgState = $('#dlg_st_mask'),
        cardMod = $('.card-mod'),
        cardPic = $('.card-pic'),
        cardDes = $('.card-des'),
        load = $('.load'),
        besides = $('.besides'),
        blinkContent = $('.blink-content'),
        stPic = $('#dlg_st_pic'),
        cardCss =  ['card-pic xj','card-pic hb','card-pic hf','card-pic snj','card-pic zxj','card-pic lyej','card-pic tyj','card-pic fjp','card-pic xxhg','card-pic dlb'],
        toast = '',
        prizeId = '',
        airName = '小9';
     
    //普通奖品内容
    function getCardDes (v){
        return '<p class="dlg-tit">恭喜您！</p>'
                +'<p class="dlg-subtit">获得</p>'
                +'<p class="card-name">'+v+'</p>';
    }

    //定制机票
    function getTicket (){
        return '<p class="air-tit">恭喜获得<br>我们为你定制的机票</p>'
                +'<p class="edit-name">输入姓名，翻牌生成</p>'
                +'<input type="text" class="air_input" maxlength="4" placeholder="">'
    }
    
    //谢谢惠顾
    function getThanks(){
        return '<p class="thanks">谢谢惠顾</p>'
    }

    //查看规则
    $('.rule').on('click',function(){
        dlgRuleMask.show();
    })

    $('.bind-mask').on('click',function(event){
        if (event.target === this) {
            event.stopPropagation();
            $(this).hide();
        }
    })

    //剩余次数
    var openNumData = {
        data: {
            'AID': 20170401,
            'Type': 1
        },
        mFun: 'GetLotteryDrawNum',
        beforeFun : function(){
        },
        sucFun : function(v){
            residue = v;
            besides.show();
            $('.num').html(residue);
        },
        unusualFun : function(v){
            besides.hide();
        }
    }
    
    //立即抽牌
    $('.prize-btn').on('click',function(){
        var getPrizeData = {
            data: {
                'AID': 20170401,
                'DrawTimes' : 1
            },
            mFun: 'LotteryDraw',
            beforeFun : function(){
                load.show();
            },
            sucFun : function(v){
                load.hide();
                JSBK.Utils.postAjax(openNumData);
                var result = v.PrizeList[0],
                    sta = v.Status;                    
                if(sta == 0){
                    var type = result.PrizeType,
                        title = result.PrizeTitle,
                        value = result.PrizeValue;
                    prizeId = result.PrizeID;
                    if( type == 4){ //现金红包
                        cardPic.attr('class',cardCss[0]);
                        var des = getCardDes('<span>'+value+'</span>元现金奖励')
                        cardDes.html(des);
                        dlgPrizeMask.show();
                        toast = '现金奖励已发放至您的账户余额';
                        return;
                    }else if( type == 2){ //红包券
                        cardPic.attr('class',cardCss[1]);
                        var des = getCardDes('<span>'+value+'</span>元红包券')
                        cardDes.html(des);
                        dlgPrizeMask.show();
                        toast = '红包券已存入您的账户，请及时使用';
                        return;
                    }else{ //实物奖品
                        if (title.indexOf('1888') > -1){
                            cardPic.attr('class',cardCss[9]);
                            var des = getCardDes('小9愚人节炸弹')
                            cardDes.html(des);
                            dlgPrizeMask.show();
                            toast = '实物奖品将于10个工作日内寄出';
                            return;
                        }else if (title.indexOf('话费') > -1){
                            cardPic.attr('class',cardCss[2]);
                            var des = getCardDes('<span>'+value+'</span>元话费充值')
                            cardDes.html(des);
                            dlgPrizeMask.show();
                            toast = '实物奖品将于10个工作日内寄出';
                            return;
                        }else if (title.indexOf('酸奶机') > -1){
                            cardPic.attr('class',cardCss[3]);
                            var des = getCardDes('东菱DL-SNJ09酸奶机')
                            cardDes.html(des);
                            dlgPrizeMask.show();
                            toast = '实物奖品将于10个工作日内寄出';
                            return;
                        }else if (title.indexOf('定制机票') > -1){
                            cardPic.attr('class',cardCss[7]);
                            var des = getTicket()
                            cardDes.html(des);
                            dlgPrizeMask.show();
                            toast = '时光静好，旅行说走就走~';
                            return;
                        }else if (title.indexOf('谢谢惠顾') > -1){
                            cardPic.attr('class',cardCss[8]);
                            var des = getThanks()
                            cardDes.html(des);
                            dlgPrizeMask.show();
                            toast = '再抽到谢谢惠顾，一定要尝试翻牌哦~';
                            return;
                        }else if(title.indexOf('惊喜包') > -1){
                            //小9惊喜包
                            dlgSurprise.show();
                        }
                    }
                }else if(sta == 1){
                    //未中奖
                    blinkContent.html('慢一步~该奖品已被领取完啦！');
                    prizeTip.open();
                    return;
                }else if(sta == 2 || sta == 6){
                    //未抽奖机会  || 本轮活动已参与
                    stPic.html('<div class="nochance"></div>');
                    dlgState.show();
                    return;
                }else if(sta == 3){
                    //未开始
                    stPic.html('<div class="unstart"></div>');
                    dlgState.show();
                    return;
                }else if(sta == 4){
                    //结束
                    stPic.html('<div class="end"></div>');
                    dlgState.show();
                    return;
                }
            }
        }

        JSBK.bindToken(function(){
            //已登录
            JSBK.Utils.postAjax(getPrizeData);
        });
        
    })

    var isSure = true,
        isCancel = true;
    $('.sure').on('click',function(){
        if(!isSure){
            return;
        }
        isCancel = false;
        if(cardMod.hasClass('flip-out')){
            return;
        }
        cardMod.addClass('flip-out');
        var surePrizeData = {
            data: {
                'AID': 20170401,
                'DrawTimes' : 1,
                'Type' :1,
                'PI' : prizeId,
                'PS' : -1
            },
            mFun: 'LotteryDraw',
            sucFun : function(v){
                var result = v.PrizeList[0],
                    sta = v.Status;                    
                if(sta == 0){
                    var type = result.PrizeType,
                        title = result.PrizeTitle,
                        value = result.PrizeValue;
                    if( type == 4){ //现金红包
                        cardPic.attr('class',cardCss[0]);
                        var des = getCardDes('<span>'+value+'</span>元现金奖励')
                        cardDes.html(des);
                        dlgPrizeMask.show();
                        toast = '现金奖励已发放至您的账户余额';
                        return;
                    }else if( type == 2){ //红包券
                        cardPic.attr('class',cardCss[1]);
                        var des = getCardDes('<span>'+value+'</span>元红包券')
                        cardDes.html(des);
                        dlgPrizeMask.show();
                        toast = '红包券已存入您的账户，请及时使用';
                        return;
                    }else{ //实物奖品
                        
                        if (title.indexOf('话费') > -1){
                            cardPic.attr('class',cardCss[2]);
                            var des = getCardDes('<span>'+value+'</span>元话费充值')
                            cardDes.html(des);
                            dlgPrizeMask.show();
                            toast = '实物奖品将于10个工作日内寄出';
                            return;
                        }else if (title.indexOf('酸奶机') > -1){
                            cardPic.attr('class',cardCss[3]);
                            var des = getCardDes('东菱DL-SNJ09酸奶机')
                            cardDes.html(des);
                            dlgPrizeMask.show();
                            toast = '实物奖品将于10个工作日内寄出';
                            return;
                        }else if (title.indexOf('相机') > -1){
                            cardPic.attr('class',cardCss[4]);
                            var des = getCardDes('富士INSTAX一次成像相机')
                            cardDes.html(des);
                            dlgPrizeMask.show();
                            toast = '实物奖品将于10个工作日内寄出';
                            return;
                        }else if (title.indexOf('蓝牙耳机') > -1){
                            cardPic.attr('class',cardCss[5]);
                            var des = getCardDes('苹果Airpods蓝牙耳机')
                            cardDes.html(des);
                            dlgPrizeMask.show();
                            toast = '实物奖品将于10个工作日内寄出';
                            return;
                        }else if (title.indexOf('投影机') > -1){
                            cardPic.attr('class',cardCss[6]);
                            var des = getCardDes('坚果高清投影机')
                            cardDes.html(des);
                            dlgPrizeMask.show();
                            toast = '实物奖品将于10个工作日内寄出';
                            return;
                        }else if (title.indexOf('生成图片') > -1){
                            airName = $('.air_input').val() || '小9';
                            $('#air-name').html(airName);
                            dlgPrizeMask.hide();
                            dlgAir.show();
                            toast = '时光静好，旅行说走就走~';
                            return;
                        }
                    }
                }else if(sta == 1){
                    //未中奖
                    blinkContent.html('慢一步~该奖品已被领取完啦！');
                    prizeTip.open();
                    return;
                }else if(sta == 2 || sta == 6){
                    //未抽奖机会  || 本轮活动已参与
                    stPic.html('<div class="nochance"></div>');
                    dlgState.show();
                    return;
                }else if(sta == 3){
                    //未开始
                    stPic.html('<div class="unstart"></div>');
                    dlgState.show();
                    return;
                }else if(sta == 4){
                    //结束
                    stPic.html('<div class="end"></div>');
                    dlgState.show();
                    return;
                }
            }
        }
        JSBK.Utils.postAjax(surePrizeData);
        setTimeout(function(){
            dlgPrizeMask.hide();
            dlgAir.hide();
            blinkContent.html(toast);
            prizeTip.open();
            cardMod.removeClass('flip-out');
            isSure = true;
            isCancel = true;
        },3500)
    })

    $('.cancel').on('click',function(){
        if(!isCancel){
            return;
        }
        isSure = false;        
        var cancelPrizeData = {
            data: {
                'AID': 20170401,
                'DrawTimes' : 1,
                'Type' :1,
                'PI' : prizeId
            },
            mFun: 'LotteryDraw',
            sucFun : function(v){
                var result = v.PrizeList[0],
                    sta = v.Status;                    
                if(sta == 0){
                    var title = result.PrizeTitle;
                    dlgPrizeMask.hide();
                    isSure = true;
                    isCancel = true;
                    if (title.indexOf('定制机票') > -1){
                            $('#air-name').html(airName);
                            dlgAir.show();
                            toast = '时光静好，旅行说走就走~';
                            return;
                        }
                    blinkContent.html(toast);
                    prizeTip.open();
                }else if(sta == 1){
                    //未中奖
                    blinkContent.html('慢一步~该奖品已被领取完啦！');
                    prizeTip.open();
                    return;
                }else if(sta == 2 || sta == 6){
                    //未抽奖机会  || 本轮活动已参与
                    stPic.html('<div class="nochance"></div>');
                    dlgState.show();
                    return;
                }else if(sta == 3){
                    //未开始
                    stPic.html('<div class="unstart"></div>');
                    dlgState.show();
                    return;
                }else if(sta == 4){
                    //结束
                    stPic.html('<div class="end"></div>');
                    dlgState.show();
                    return;
                }
            }
        }
        JSBK.Utils.postAjax(cancelPrizeData);
    })

    //微信分享
    JSBK.shareWinxin({
        'title': '94愚人节愚乐无限，活动期间购买任意9盈宝产品，欢乐有礼送不停！翻牌更有坚果高清投影机、苹果无线蓝牙耳机、富士拍立得、888元现金奖励，有胆你就来！~',
        'desc': '94愚人节愚乐无限，活动期间购买任意9盈宝产品，欢乐有礼送不停！翻牌更有坚果高清投影机、苹果无线蓝牙耳机、富士拍立得、888元现金奖励，有胆你就来！~',
        'link': 'http://np.94bank.com/Activity/AprilFool20170401',
        'imgUrl': window.Zepto.linkUrl+'/dist/Activity/img/20170401/aprilFool/share.jpg'
    })
});