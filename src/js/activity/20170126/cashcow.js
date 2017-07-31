;
$(function() {
    require('../../../common/layout.css');
    require('../../../common/layout.js');
    require('../../../css/activity/20170126/cashcow.css');

    //弹层
    var cashcowAlert = function(op){
        var self = this;
        var defaults = {
            bgClose : true,
            select : $('.rule-wrap')
        };
        this.ops = $.extend(defaults, op);
        this.dialog = null;
        this.init();
    }
    cashcowAlert.prototype.init = function(){
        require('../../../ui/Dialog.css');
        var Dialog = require('../../../ui/Dialog.js');
        this.dialog = new Dialog( this.ops );
    }
    cashcowAlert.prototype.open = function(){
        this.dialog.open();
        this.ops.select.show();
    }
    cashcowAlert.prototype.close = function(){
        this.dialog.close();
        this.ops.select.show();
    }

    //查看规则
    var ruleAlert = new cashcowAlert();
    $('.rule').on('click',function(){
        ruleAlert.open();
    })

    //活动未开始
    var unstartAlert = new cashcowAlert({
        select : $('#unstart')
    });
    //活动已结束
    var endAlert = new cashcowAlert({
        select : $('#end')
    });
    //本轮活动已参与
    var joinAlert = new cashcowAlert({
        select : $('#join')
    });
    //未抽奖机会
    var nochanceAlert = new cashcowAlert({
        select : $('#nochance')
    })

    var redbagAlert = new cashcowAlert({
        select : $('#win_prize')
    })
    var winloadAlert = new cashcowAlert({
        select : $('.win-load')
    })

    winloadAlert.dialog.on('bgClose',function(){
        initload();
    })

    var rotateMod = $('.rotate-mod');
    function initload(){
        winloadAlert.close();
        rotateMod.addClass('rotate');
    }

    function winload(){
        winloadAlert.open();
        rotateMod.removeClass('rotate');
    }
    
    var prizeTit = $('.prize-tit'),
        prizeNumber = $('.prize-number');

    //红包接口
    function lottery(type){
        var shakeredbagData = {
            data: {
                'AID': 20170126,
                'DrawTimes' : 1,
                'Type': type
            },
            mFun: 'LotteryDraw',
            beforeFun : function(){
                winload();
            },
            sucFun : function(v){
                initload();
                var result = v.PrizeList[0],
                    sta = v.Status;
                if(sta == 0){
                    if(result.PrizeType == 4){
                        prizeTit.html('现金券');
                        prizeNumber.html(result.PrizeValue+'元红包');
                    }else if(result.PrizeType == 2){
                        prizeTit.html('卡券');
                        prizeNumber.html(result.PrizeValue+'元卡券');
                    }
                    redbagAlert.open();
                }else if(sta == 2){
                    //未抽奖机会
                    nochanceAlert.open();
                }else if(sta == 3){
                    //未开始
                    unstartAlert.open();
                }else if(sta == 4){
                    //结束
                    endAlert.open();
                }else if(sta == 6){
                    //本轮活动已参与
                    joinAlert.open();
                }
            },
            unusualFun : function(v){
                initload();
            },
            comFun : function(){
                initload();
            }
        }
        
        //判断是否登录
        JSBK.bindToken(function(){
            //已登录
            JSBK.Utils.postAjax(shakeredbagData);
        }); 
    }

    //点击摇红包
    $('.shake-redbag').on('click',function(){
        lottery(1);
    })
    
    //摇金果实
    var timeMod = $('.time-mod'),
        timeCountdown = timeMod.find('.time-countdown'),
        isFruit = false,
        i = 0,
        timer,
        startTime,
        nowTime;

    //倒计时
    function addzero(a){
        if(a<10){
            return a='0'+a;
        }else{return a}
    }
    function caculateDate(time){
        var d = parseInt(time/86400);
        var h = parseInt((time%86400)/3600);
        var m = parseInt(((time%86400)%3600)/60);
        var s = parseInt(((time%86400)%3600)%60);
        var t = addzero(m)+':'+addzero(s);
        return t;
    }
    function countDownFun(date,curData,Time){
        var time =(Date.parse(date.replace(/-/g,'/')) - Date.parse(curData.replace(/-/g,'/')))/1000;
        Time.html(caculateDate(time));
        var clearTime = setInterval(function(){
            time -= 1;
            Time.html(caculateDate(time));
            if(time <= 0){
                location.reload();
            }
        },1000);
    }

    var timerData = {
        data: {
            'AID': 20170126,   
        },
        mFun : 'LotteryDrawCountDown',
        sucFun : function(v){
            if(v.status == 1){ //倒计时
                isFruit = false;
                startTime = v.startTime;
                nowTime = v.nTime;
                clearInterval(timer);
                timeMod.show();
                countDownFun(startTime,nowTime,timeCountdown);
            }else{
                isFruit = true;
                timeMod.hide();
            }
        }
    }
    
    timer = setInterval(function(){
        JSBK.Utils.postAjax(timerData); 
        i++;
    },1000);

    //点击摇金果实
    $('.shake-fruit').on('click',function(){
        if(isFruit){
            lottery(2);
        }
    })

    //微信分享
    JSBK.shareWinxin({
        'title': '任性+5%收益 摇出你的千万红包',
        'desc': '94摇钱树，暴击现金红包、加息券、iPhone 7疯狂摇出来，更能享受5%、6%特权收益！份额有限先到先得！',
        'link': 'http://np.94bank.com/Activity/CashCow20170126 ',
        'imgUrl': 'http://img.94bank.com/np/dist/Activity/img/20170126/share-cashcow.jpg'
    })
});