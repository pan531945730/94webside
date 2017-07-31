;
$(function() {
    require('../../../common/layout.css');
    require('../../../common/layout.js');
    require('../../../css/activity/20170101/newYear.css');
    require('../../../component/website/Load.css');

    var load = $('.load'),
        btn = $('.newyear-btn'),
        linkUrl = window.Zepto.linkUrl,
        startTime01 = Date.parse('2016/12/31 20:17:00'),//第一场
        endTime01 =  Date.parse('2016/12/31 20:32:00'),
        starTime02 = Date.parse('2017/01/01 00:00:00'),//第二场
        endTime02 = Date.parse('2017/01/01 00:30:00'),
        starTime03 = Date.parse('2017/01/01 12:00:00'),//第三场
        endTime03 = Date.parse('2017/01/01 13:00:00'),
        prizeAlert,
        unStartAlert,
        endAlert,
        isPartAlert,
        serverTime,
        type,
        endTitle01;

    //弹层
    var activeAlert = function(op){
        var self = this;
        var defaults = {
            bgClose : true,
            closeSelect :'.dlg-close',
            select : self.getSelect(),
            titleHtml : '活动未开始',
            bgSrc : linkUrl+'/lib/newYear/unstart.png'
        };
        this.ops = $.extend(defaults, op);
        this.dialog = null;
        this.init();
    }
    activeAlert.prototype.init = function(){
        require('../../../ui/Dialog.css');
        var Dialog = require('../../../ui/Dialog.js');
        this.dialog = new Dialog( this.ops );
        this.setHtml();
    }
    activeAlert.prototype.setHtml = function(){
        this.ops.select.find('.dlg-tit').html( this.ops.titleHtml);
        this.ops.select.find('img').attr('src',this.ops.bgSrc);
    }
    activeAlert.prototype.getSelect = function(){
        return $('<div class="ny-dlg">'+
                    '<span class="dlg-close"></span>'+
                    '<p class="dlg-tit"></p>'+
                    '<img src="#" alt="newyear" width="100%" height="auto">'+
                '</div>');
    }
    activeAlert.prototype.open = function(){
        this.dialog.open();
        this.ops.select.show();
    }

    //初始化接口
    var initData = {
        data: {
            'AID' : 20170101,
            'Action' : ''
        },
        mFun: 'ActivityMain',
        beforeFun : function(){
            load.show();
        },
        sucFun : function(v){
            load.hide();
            serverTime = Date.parse(v.ST);
            if( serverTime < starTime02){
                type = 1;
                endTitle01 = '活动已抢完';
            }else if( serverTime >= starTime02 && serverTime < starTime03 ){
                type = 2;
                endTitle01 = '活动已抢完';
            }else if( serverTime >= starTime03 ){
                type = 3;
                endTitle01 = '活动已结束';
            }
        },    
        unusualFun : function(v){
            load.hide();
        }
    }
    JSBK.Utils.postAjax(initData);

    btn.on('click',function(){
        var qfdData = {
            data: {
                'AID': 20170101,
                'DrawTimes' : 1,
                'Type': 1
            },
            mFun: 'LotteryDraw',
            beforeFun : function(){
                load.show();
            },
            sucFun : function(v){
                load.hide();
                var result = v.PrizeList[0],
                    sta = v.Status;
                //状态(-1:异常;0:中奖;1:未中奖;2:无可用抽奖机会;3:;活动未开始;4:;活动已结束;5:本轮活动已结束;6:本轮活动已参与;)
                if(sta == 0){ //中奖
                    prizeAlert = new activeAlert({
                        titleHtml : '恭喜您！<br/>获得 <span>'+result.PrizeValue+'</span> 元红包',
                        bgSrc : linkUrl+'/lib/newYear/prize.png'
                    });
                    prizeAlert.open();
                    return;
                }else if(sta == 3){ //活动未开始
                    if(!unStartAlert){
                        unStartAlert = new activeAlert({
                            titleHtml : '活动未开始',
                            bgSrc : linkUrl+'/lib/newYear/unstart.png'
                        });
                    }
                    unStartAlert.open();
                    return;
                }else if(sta == 4 || sta == 5){//活动已结束
                    if(!endAlert){
                        endAlert = new activeAlert({
                            titleHtml : endTitle01,
                            bgSrc : linkUrl+'/lib/newYear/end.png'
                        });
                    }
                    endAlert.open();
                    return;
                }else if(sta == 6){ //本轮活动已参与
                    if(!isPartAlert){
                        isPartAlert = new activeAlert({
                            titleHtml : '本轮活动已参与',
                            bgSrc : linkUrl+'/lib/newYear/end.png'
                        });
                    }
                    isPartAlert.open();
                    return;
                }
            },
            unusualFun : function(v){
                load.hide();
            }
        }
        
        //判断是否登录
        JSBK.bindToken(function(){
            //已登录
            JSBK.Utils.postAjax(qfdData);
        });  
    })

    
    //微信分享
    JSBK.shareWinxin({
        'title': 'HAPPY2017，94红包加倍！',
        'desc': 'HAPPY2017，红包加倍！福袋红包抢不停，收集吉祥数字最高可以得2888元现金红包哦！',
        'link': 'http://np.94bank.com/Activity/NewYear20170101',
        'imgUrl': 'http://img.94bank.com/np/dist/Activity/img/20170101/share.jpg'
    })

});