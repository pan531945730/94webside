;
$(function() {
    require('../../../common/layout.css');
    require('../../../common/layout.js');
    require('../../../css/activity/20170308/womenDay.css');

    var wmdData = $('.wmd-data');
    var getPizData = {
        data: {
            'AID': 20170308,
            'PS': 20
        },
        mFun: 'GetLotteryDrawWinningNotice',
        beforeFun : function(){
        },
        sucFun : function(res){
            if(!res || res.length == 0){
                wmdData.hide();
                return;
            } 
            var arr = []; 
            $.each(res,function(i,v){
                var html = '';
                html += '<li><em>'+(i+1)+'.</em>'+v.phone+'<em>'+v.noticeText+'</em></li>';
                arr.push(html);
            })
            $('#warn_scroll').html(arr.join(''));
            warnSroll();   
        },
        unusualFun : function(v){
            
        }
    }
    JSBK.Utils.postAjax(getPizData);

    //跑马灯
    function warnSroll(){
        var ul = $("#warn_scroll"),
            li = ul.find("li"),
            height = li.height(),
            html = ul.html(),
            i = 1,
            length = li.size();
            if (length <= 3) { return;};
            ul.html(html + html);
            setInterval(function () {
               ul.addClass('animate');
               ul.css({marginTop: - i * height});
               i++;
               if (i > length) {
                   i = 1;
                   setTimeout(function () {
                       ul.removeClass('animate').css({marginTop: 0});
                   }, 500);
               }
            }, 6000);
    }
    
    //弹层
    var activityAlert = function(op){
        var self = this;
        var defaults = {
            bgClose : true,
            select : $('.rule-dlg')
        };
        this.ops = $.extend(defaults, op);
        this.dialog = null;
        this.init();
    }
    activityAlert.prototype.init = function(){
        require('../../../ui/Dialog.css');
        var Dialog = require('../../../ui/Dialog.js');
        this.dialog = new Dialog( this.ops );
    }
    activityAlert.prototype.open = function(){
        this.dialog.open();
        this.ops.select.show();
    }
    activityAlert.prototype.close = function(){
        this.dialog.close();
        this.ops.select.show();
    }
    //查看规则
    var ruleAlert = new activityAlert();
    $('.rule').on('click',function(){
        ruleAlert.open();
    })

    //女神福袋
    var fairyAlert = new activityAlert({
        select : $('#fairy_dlg')
    })
    $('#fairy').on('click',function(){
        fairyAlert.open();
    })

    //幸运女神福袋
    var luckfairyAlert = new activityAlert({
        select : $('#luck_fairy_dlg')
    })
    $('#luck_fairy').on('click',function(){
        luckfairyAlert.open();
    })

    //幸运女神眷顾
    var bestfairyAlert = new activityAlert({
        select : $('.best-fairy-dlg')
    })
    $('#best_fairy').on('click',function(){
        bestfairyAlert.open();
    })

    //状态
    var dlgStAlert = new activityAlert({
        select : $('.dlg-st-wrap')
    })

    //奖品
    var bagAlert = new activityAlert({
        select : $('.dlg-piz-wrap')
    })

    var stPic = $('#dlg_st_pic'),
        stTit = $('#st_tit'),
        pizTit = $('#piz_tit'),
        load = $('.load'),
        fairyMod = $('.fairy-mod'),
        unbtn = $('#unbtn'),
        leng = 0;

    var initData = {
        data: {
            'AID': 20170308,
            'SourceType' :1
        },
        mFun: 'ActivityMain',
        beforeFun : function(){
            
        },
        sucFun : function(v){
            if(v.Message == ''){
                return;
            }
            var mesg =  JSON.parse(v.Message);
            $.each(mesg,function(i,v){
                if(v.Status != 2){
                    fairyMod.eq(v.SourceType-2).attr('type',v.SourceType).addClass('get-piz');
                }else{
                    fairyMod.eq(v.SourceType-2).find('.yet').show();
                }
            })
            if(v.XData_1 == 0){
                unbtn.attr('class','best-pz-btn');
            }else{
                unbtn.attr('class','unbtn');
            }
        }
    }
    /*setTimeout(function(){
        //判断是否登录
        JSBK.bindToken(function(){
            //已登录
            JSBK.Utils.postAjax(initData);
        });
        //load.css('display','none');
    },5000) */
    JSBK.bindJsBrideg(function(){
        JSBK.bindToken(function(){
            //已登录
            JSBK.Utils.postAjax(initData);
        });
        load.hide();
    },function(){
        load.show();
    });
    
    var residue = 0,
        besides = $('.besides'),
        bsNum = $('.num'),
        boxCss = ['pz-box xj','pz-box xjq','pz-box hfk','pz-box jdk','pz-box qkl','pz-box jg','pz-box jsq','pz-box ys','pz-box xs'],
        pzNext = $('.pz-next'),
        pzUl = $('.pz-ul'),
        type = 0,
        i = 0;

    //幸运女神眷顾大礼
    var bestbagAlert = new activityAlert({
        select : $('.dlg-best-wrap')
    })
    $('.wmd-cont').on('click','.get-piz',function(){
        if($(this).hasClass('li09')){
            bestbagAlert.open();
            return;
        }
        type = $(this).attr('type');
        var getPrizeData = {
            data: {
                'AID': 20170308,
                'DrawTimes' : 1,
                'Type': type
            },
            mFun: 'LotteryDraw',
            beforeFun : function(){
                load.css('display','-webkit-box');
            },
            sucFun : function(v){
                //console.log(v);
                load.css('display','none');
                var result = v.PrizeList,
                    sta = v.Status;
                leng = result.length;
                if(sta == 0){
                    if(!result || result.length == 0){
                        return;
                    } 
                    var arr = []; 
                    $.each(result,function(i,v){
                        var html = '',
                            pzStHtml= '',
                            pzCss = '';
                        if(v.PrizeType == 4){
                            pzStHtml = '<span>'+v.PrizeValue+'</span>元现金红包';
                            pzCss = boxCss[0];
                        }else if(v.PrizeType == 2){
                            pzStHtml = '<span>'+v.PrizeValue+'</span>元红包券';
                            pzCss = boxCss[1];
                        }else if(v.PrizeType == 1){
                            if(v.PrizeTitle.indexOf('话费') > -1){
                                pzStHtml = '<span>'+v.PrizeValue+'</span>元话费卡';
                                pzCss = boxCss[2];
                            }else if(v.PrizeTitle.indexOf('京东') > -1){
                                pzStHtml = '<span>'+v.PrizeValue+'</span>元京东购物卡';
                                pzCss = boxCss[3];
                            }else if(v.PrizeTitle.indexOf('巧克力') > -1){
                                pzStHtml = 'Baci芭喜巧克力礼盒<em>市场价值 ¥69</em>';
                                pzCss = boxCss[4];
                            }else if(v.PrizeTitle.indexOf('坚果') > -1){
                                pzStHtml = '三只松鼠坚果大礼包<em>市场价值 ¥88</em>';
                                pzCss = boxCss[5];
                            }else if(v.PrizeTitle.indexOf('加湿器') > -1){
                                pzStHtml = '米悠本色香薰机加湿器<em>市场价值 ¥169</em>';
                                pzCss = boxCss[6];
                            }else if(v.PrizeTitle.indexOf('眼霜') > -1){
                                pzStHtml = '欧莱雅眼霜<em>市场价值 ¥142</em>';
                                pzCss = boxCss[7];
                            }else if(v.PrizeTitle.indexOf('香水') > -1){ 
                                pzStHtml = 'Gucci古驰香水<em>市场价值 ¥279</em>';
                                pzCss = boxCss[8];
                            }else{

                            }
                        }
                        html += '<li style="display:none;"><p class="pz-st">'+pzStHtml+'</p>';
                        html += '<div class="pz-box '+pzCss+'"></div></li>';
                        arr.push(html);
                    })
                    pzUl.html(arr.join(''));
                    pzUl.find('li').eq(0).show();
                    pizTit.html('恭喜您！');
                    pzNext.addClass('next').html('下一个礼物更惊喜 >').show();
                    i = 0;
                    bagAlert.open();
                }else if(sta == 2 || sta == 6){
                    //未抽奖机会  || 本轮活动已参与
                    stTit.html('太棒了！');
                    stPic.html('<div class="nochance"></div>')
                    dlgStAlert.open();
                }else if(sta == 3){
                    //未开始
                    stTit.html('很抱歉！');
                    stPic.html('<div class="unstart"></div>')
                    dlgStAlert.open();
                }else if(sta == 4){
                    //结束
                    stTit.html('很抱歉！');
                    stPic.html('<div class="end"></div>')
                    dlgStAlert.open();
                }
            }
        }
        JSBK.Utils.postAjax(getPrizeData);

    })
    
    bagAlert.dialog.on('bgClose',function(){
        if(type == 0){
            return;
        }
        fairyMod.eq(type-2).removeClass('get-piz').find('.yet').show();
    })

    $('.dlg-piz-wrap').on('click','.next',function(){
        if(i >= (leng-2)){
            pzNext.removeClass('next').html('奖品领完啦~去开启下一关！').show();
        }
        setTimeout(function(){
            i ++;
            pzUl.find('li').hide();
            pzUl.find('li').eq(i).show();
        },0)
    })


    $('.dlg-best-wrap').on('click','.best-pz-btn',function(){
        var type = $(this).attr('type');
        var getBestPrizeData = {
            data: {
                'AID': 20170308,
                'DrawTimes' : 1,
                'Type': type
            },
            mFun: 'LotteryDraw',
            beforeFun : function(){
                load.css('display','-webkit-box');
            },
            sucFun : function(v){
                load.css('display','none');
                var result = v.PrizeList,
                    sta = v.Status;
                leng = result.length;
                if(sta == 0){
                    if (type == 16) {
                        unbtn.attr('class','unbtn');
                    };
                    bestbagAlert.dialog.close();
                    stTit.html('太棒了！');
                    stPic.html('<div class="succ"></div>')
                    dlgStAlert.open();
                    fairyMod.eq(5).removeClass('get-piz').find('.yet').show();
                }else if(sta == 2 || sta == 6){
                    //未抽奖机会  || 本轮活动已参与
                    bestbagAlert.dialog.close();
                    stTit.html('太棒了！');
                    stPic.html('<div class="nochance"></div>')
                    dlgStAlert.open();
                }else if(sta == 3){
                    //未开始
                    bestbagAlert.dialog.close();
                    stTit.html('很抱歉！');
                    stPic.html('<div class="unstart"></div>')
                    dlgStAlert.open();
                }else if(sta == 4){
                    //结束
                    bestbagAlert.dialog.close();
                    stTit.html('很抱歉！');
                    stPic.html('<div class="end"></div>')
                    dlgStAlert.open();
                }
            }
        }
        JSBK.Utils.postAjax(getBestPrizeData);
    })
    //90天专场
    //剩余次数
    var openNumData = {
        data: {
            'AID': 20170308,
            'Type': 1
        },
        mFun: 'GetLotteryDrawNum',
        beforeFun : function(){
        },
        sucFun : function(v){
            residue = v;
            besides.show();
            bsNum.html(residue);
        },
        unusualFun : function(v){
            besides.hide();
        }
    }
    $('.pag-btn').on('click',function(){
        var prizeData = {
            data: {
                'AID': 20170308,
                'DrawTimes' : 1,
                'Type': 1
            },
            mFun: 'LotteryDraw',
            beforeFun : function(){
                load.css('display','-webkit-box');
            },
            sucFun : function(v){
                load.css('display','none');
                JSBK.Utils.postAjax(openNumData);
                var result = v.PrizeList[0],
                    sta = v.Status;
                if(sta == 0){
                    var html = '';
                    if(result.PrizeType == 4){
                        html += '<li><p class="pz-st"><span>'+result.PrizeValue+'</span>元现金红包</p><div class="pz-box xj"></div></li>';
                    }else if(result.PrizeType == 2){
                        html += '<li><p class="pz-st"><span>'+result.PrizeValue+'</span>元红包券</p><div class="pz-box xjq"></div></li>';
                    }
                    pzUl.html(html);
                    pizTit.html('恭喜您！');
                    pzNext.removeClass('next').html('奖品领完啦~去开启下一关！').hide();
                    bagAlert.open();
                }else if(sta == 2 || sta == 6){
                    //未抽奖机会  || 本轮活动已参与
                    stTit.html('太棒了！');
                    stPic.html('<div class="nochance"></div>')
                    dlgStAlert.open();
                }else if(sta == 3){
                    //未开始
                    stTit.html('很抱歉！');
                    stPic.html('<div class="unstart"></div>')
                    dlgStAlert.open();
                }else if(sta == 4){
                    //结束
                    stTit.html('很抱歉！');
                    stPic.html('<div class="end"></div>')
                    dlgStAlert.open();
                }
            }
        }
        
        JSBK.Utils.postAjax(prizeData); 
    }) 

    //微信分享
    JSBK.shareWinxin({
        'title': '94幸运女神福利爆棚',
        'desc': '3月8日10:00起至3月9日,94幸运女神节派送福利啦！GUCCI香水、兰蔻护肤品套装、宝石礼盒、现金红包等，福利爆棚就等幸运女神降临~',
        'link': 'http://np.94bank.com/Activity/WomenDay20170308',
        'imgUrl': window.Zepto.linkUrl+'/dist/Activity/img/20170308/womenDay/share.jpg'
    })
});