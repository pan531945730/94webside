;
$(function() {
    var dom = {
            rule: $('#rule'),
            popRule: $('#popRule'),
            btnStart: $('#btnStart'),
            btnCheck: $('#btnCheck'),
            redCount: $('#redCount'),
            redPacket: $('#redPacket'),
            popRedOver: $('#popRedOver'),
            btnRedOver: $('#btnRedOver'),
            popRewards: $('#popRewards'),
            popRewardsCon: $('#popRewardsCon'),
            mask: $('.mask')
        },
        isRule,
        redNum = 0;
    var jumpHerf = '/Activity/Exclusive20170218';
    //当前状态
    var isLotteryHave = {
        data: {
            AID: '20170418',
            Action: 'iscapacity',
            SourceType: '1',
        },
        mFun: 'ActivityMain',
        sucFun: function(v) {
            if (v.Status == 0) {
                //可以参与
                dom.btnStart.show()
            } else if (v.Status == '-2') {
                //已参与
                dom.btnCheck.show()
            } else if (v.Status == '3') {
                //活动未开始
                window.location.href = '/Activity/CountDown20170218';
            } else if (v.Status == '4') {
                //已结束
                dom.btnCheck.show()
            } else {
                //没有资格
                window.location.href = jumpHerf;
            }
            countDown(v.ST, v.EndTime, "#countDown")
        },
        notLogged: function() {
            window.location.href = jumpHerf;
        }
    }
    JSBK.Utils.postAjax(isLotteryHave);

    //点击红包雨执行
    var redPacketStata = {
        data: {
            AID: '20170418',
            Action: 'light',
            SourceType: '1',
        },
        mFun: 'ActivityMain',
        notLogged: function() {
            window.location.href = jumpHerf;
        },
        sucFun: function(v) {}
    }

    //红包动画
    $('.redpacket_con').on('click', function() {
        if ($(this).hasClass('marked')) {

        } else {
            redNum = redNum + 1;
            $(this).addClass('marked').find('b').show().html('+' + redNum)
        }
    })

    //开始红包
    dom.btnStart.on('click', function() {
        JSBK.Utils.postAjax(redPacketStata);
        dom.redCount.show();
        setTimeout(function() {
            dom.redPacket.show()
            setTimeout(function() {
                //红包个数
                var LotteryData = {
                    data: {
                        AID: '20170418',
                        DrawTimes: redNum,
                        Type: '1',
                    },
                    mFun: 'LotteryDraw',
                    sucFun: function(v) {
                        if (v.Status == 0) {
                            dom.redPacket.hide()
                            dom.popRedOver.show();
                        } else if (v.Status == 2) {
                            //已参与
                            dom.redPacket.hide()
                            dom.redCount.hide()
                            dom.btnStart.hide()
                            dom.btnCheck.show()
                        } else {
                            window.location.href = jumpHerf;
                        }
                    },
                    notLogged: function() {
                        window.location.href = jumpHerf;
                    }
                }
                JSBK.Utils.postAjax(LotteryData);
            }, 11000)
        }, 3000)
    })

    dom.btnRedOver.on('click', function() {
        redOver()
        JSBK.Utils.postAjax(RewardsData);
    })

    //我的福利花花
    dom.btnCheck.on('click', function() {
        JSBK.Utils.postAjax(RewardsData);
    })

    //红包结束
    function redOver() {
        dom.popRedOver.hide();
        dom.redCount.hide()
        dom.btnStart.hide()
        dom.btnCheck.show()
    }

    //奖品-我的福利花花
    var RewardsData = {
        data: {
            AID: '20170418',
            Type: '0',
        },
        mFun: 'LotteryDraw',
        notLogged: function() {
            window.location.href = jumpHerf;
        },
        sucFun: function(v) {
            if (v.Status == 0) {
                RewardsDataFn(v.PrizeList.length)
                dom.popRewards.show();
                dom.mask.show();
                closePop(dom.popRewards, dom.mask)
            }
        }
    }
    var popRewardsConHtml = '<li><img src="' + window.Zepto.linkUrl + '/dist/Activity/img/20170418/special418/ticket_01.png" alt="special418" /></li>\
                <li><img src="' + window.Zepto.linkUrl + '/dist/Activity/img/20170418/special418/ticket_02.png" alt="special418" /></li>\
                <li><img src="' + window.Zepto.linkUrl + '/dist/Activity/img/20170418/special418/ticket_03.png" alt="special418" /></li>\
                <li><img src="' + window.Zepto.linkUrl + '/dist/Activity/img/20170418/special418/ticket_04.png" alt="special418" /></li>\
                <li><img src="' + window.Zepto.linkUrl + '/dist/Activity/img/20170418/special418/ticket_05.png" alt="special418" /></li>\
                <li><img src="' + window.Zepto.linkUrl + '/dist/Activity/img/20170418/special418/ticket_06.png" alt="special418" /></li>\
                <li><img src="' + window.Zepto.linkUrl + '/dist/Activity/img/20170418/special418/ticket_07.png" alt="special418" /></li>\
                <li><img src="' + window.Zepto.linkUrl + '/dist/Activity/img/20170418/special418/ticket_08.png" alt="special418" /></li>';
    //我的福利花花数据
    function RewardsDataFn(val) {
        if (val > 0) {
            dom.popRewardsCon.find('ul').html(popRewardsConHtml);
            var RewardAllNum = 8;
            for (var i = 0; i < (RewardAllNum - val); i++) {
                dom.popRewardsCon.find('li').eq(0).remove();
            }
        } else {
            dom.popRewardsCon.find('ul').html('您未领取任何福利花花')
        }
    }
    
    //关闭
    function closePop(obj, task) {
        task.on('click', function() {
            obj.hide()
            dom.mask.hide();
        })
    }

    //倒计时
    function countDown(timeStart, timeEnd, ele, callBack) {
        var dom = {
            $hour1: $(ele).find('.hour1'),
            $hour2: $(ele).find('.hour2'),
            $minute1: $(ele).find('.minute1'),
            $minute2: $(ele).find('.minute2'),
            $second1: $(ele).find('.second1'),
            $second2: $(ele).find('.second2')
        };
        var end_time = new Date(timeEnd).getTime(),
            sys_second = (end_time - new Date(timeStart).getTime()) / 1000,
            msTimer, msNum = 99;

        var timer = setInterval(function() {
                if (sys_second > 0) {
                    sys_second -= 1;
                    var day = Math.floor((sys_second / 3600) / 24);
                    var hour = Math.floor((sys_second / 3600) % 24);
                    var minute = Math.floor((sys_second / 60) % 60);
                    var second = Math.floor(sys_second % 60);
                    var hourT = hour < 10 ? "0" + hour : hour;
                    var minutetT = minute < 10 ? "0" + minute : minute;
                    var secondT = second < 10 ? "0" + second : second;
                    dom.$hour1.html(hourT.toString().slice(0, 1));
                    dom.$hour2.html(hourT.toString().slice(1, 2));
                    dom.$minute1.html(minutetT.toString().slice(0, 1));
                    dom.$minute2.html(minutetT.toString().slice(1, 2));
                    dom.$second1.html(secondT.toString().slice(0, 1));
                    dom.$second2.html(secondT.toString().slice(1, 2));
                } else {
                    clearInterval(timer);
                    callBack && callBack(ele) && callBack();
                }
            },
            1000);
    }
});