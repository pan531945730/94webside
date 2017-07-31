/*
 *  游戏活动的逻辑代码
 *  日期：2017/1/18.
 *  作者：Math
 * */
;
require('../../../common/layout.js');
require('../../../css/activity/jumpGame/RoosterGame.css');
var loginRegist = require('../../../component/jumpGame/loginRegist.js');
(function(window, document, $, bk) {
    'use strict';
    //游戏背景图片
    var path = window.Zepto.linkUrl + '/dist/Activity/img/20170126/jumpGame/',
        bg = {
            home: path + 'home-bg.png',
            start: path + 'start-bg.png'
        };
    var local = document.location,
        domain = local.protocol + '//' + local.host,
        apiUrl = domain + '/api/ajax';
    //判断是否为微信
    var ua = navigator.userAgent.toLowerCase();
    var isWeixin = ua.indexOf('micromessenger') != -1;
    //初始化dom
    var $gameCanvas = $('#gameCanvas'),
        $gameBg = $('#gameBg'),
        $gameOver = $('#gameOver'),
        $shareTip = $('#shareTip'),
        $rule = $('#rule'),
        $howPlay = $('#howPlay'),
        $login = $('#login'),
        time = 300; //弹层显示动画时间
    $.fn.fadeIn = function(time) {
        $(this).css('opacity','0').show().animate({
            opacity: 1
        },time);
    };
    $.fn.fadeOut = function() {
        var $this = $(this);
        $this.animate({
            opacity: 0
        },time, 'linear', function() {
            $this.hide();
        });
    };
    function log(msg) {
        console.log(msg);
    }
    $('#loading').css('opacity', '1');
    /*
    * 提示框
    * @param msg 提示文字
    * @param time 显示时间
    * */
    $.toast = (function() {
        var $toast = $('<div id="toast">');
        $('body').append($toast);
        return function(msg, time) {
            if (!msg) return;
            if ($toast.css('display') !== 'none') {
                return;
            }
            time = time || 3000;
            var fontSize = '0.36rem';
            if (msg.length > 8) {
                fontSize = '0.24rem';
            }
            $toast.css('font-size', fontSize).html(msg).fadeIn(300);
            setTimeout(function() {
                $toast.fadeOut(300);
            }, time);
        };
    }());
    /*
    * 游戏的操作
    *
    * */
    var rankData = [0, 12, 21, 35, 47, 59, 62, 68, 71, 87, 92, 96, 99]; //排行数据
    var redbagData = [0, 1, 2, 3, 5, 6, 8, 10, 12]; //红包数据
    function rank(num) { //游戏排行
        var html = '';
        num = ~~num;
        if (num > rankData.length -1) {
            num = rankData[rankData.length -1];
        } else {
            num = rankData[num];
        }
        num += '';
        for (var i= 0,len=num.length; i<len; i++) {
            html += '<i class="num num-'+ num.charAt(i) +'"></i>';
        }
        html += '<i class="num num-a"></i>';
        return html;
    }
    function redbag(num) { //红包金额
        var html = '';
        num = ~~num;
        if (num > redbagData.length -1) {
            num = redbagData[redbagData.length -1];
        } else {
            num = redbagData[num];
        }
        num += '';
        for (var i= 0,len=num.length; i<len; i++) {
            html += '<i class="num num-'+ num.charAt(i) +'"></i>';
        }
        return html;
    }
    window.game = {
        getScore: function() { //获得分数
            var score;
            if (window.localStorage.getItem('game_over')*1 === 1) {
                score = window.localStorage.getItem('score_game_over') || '0';
            } else {
                score = window.localStorage.getItem('best_score_dragon_up') || '0';
            }
            return score*1;
        },
        ruleOpen: function() { //查看规则
            $rule.fadeIn(time);
        },
        howPlay: function() { //玩法
            $howPlay.fadeIn(time);
        },
        homeSceneCallback: function() { //游戏初始化完成
            $gameBg.show();
            $gameCanvas.css('opacity', 1);
        },
        gameStartCallback: function() { //开始游戏
            $gameBg.css('background-image', 'url('+ bg.start +')');
        },
        gameRetryCallback: function() { //游戏结束再来一次
            $gameBg.css('background-image', 'url('+ bg.start +')');
            $gameOver.hide();
        },
        share: function() { //分享提示
            $shareTip.fadeIn(time);
        },
        goBack: function() { //返回主页
            $gameBg.css('background-image', 'url('+ bg.home +')');
            $gameOver.fadeOut(time);
            $login.fadeOut(time);
        },
        gameOverCallback: function(score) { //游戏结束
            var score = score || this.getScore();
            $gameOver.find('.rank').find('span').html(rank(score));
            $gameOver.find('.redbag').find('span').html(redbag(score));
            $gameOver.fadeIn(time);
        }
    };
    $rule.add($rule).add($howPlay).add($shareTip).click(function() {
        $(this).fadeOut(time);
    });
    //进入页面判断登录情况
    bk.bindToken(function() {
        //console.log('ok');
    }, function() {
        //console.log('fail');
    });
    //领取优惠券
    var getStatus = true,
        getRedbag = function(login) {
            var score = game.getScore();
            var data = {
                "AID": "20170126",
                "SourceType": score,
                "BelongType": "1"
            };
            var friendMemberId = bk.Utils.GetQueryString('friendMemberId');
            if (friendMemberId && !login) { //被邀请人
                data.BelongType = 2;
                data.MemberID = friendMemberId;
            }
            if (score <= 0) {
                $.toast('您要加油啦');
                return;
            }
            if (!getStatus) {
                return;
            }
            getStatus = false;
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: apiUrl,
                data: { D: JSON.stringify(data), M: 'RoosterGameDraw' },
                success: function(res) {
                    getStatus = true;
                    if (res.S === 0) {
                        var data;
                        try {
                            data = JSON.parse(res.D);
                        } catch(e) {
                            $.toast('数据加载失败');
                            return;
                        }
                        if (data.Status == 3) {
                            $.toast('请在微信浏览器领取');
                            return;
                        }
                        if (data.Status == 2) {
                            $.toast('已经帮好友领过了');
                            return;
                        }
                        if (data.Status == 1) {
                            $.toast('领取成功');
                            return;
                        }
                        if (data.Status == -2) {
                            $.toast('活动已结束');
                            return;
                        }
                        if (data.Status == -1) {
                            $.toast('活动未开始');
                            return;
                        }
                        if (data.Status === 0) {
                            $.toast('您已领取过了');
                            return;
                        }
                        $.toast('领取失败,请重试');
                        return;
                    }
                    if (res.S == -4) {
                        $.toast('请在微信浏览器领取');
                        return;
                    }
                    if (res.S == -3) {
                        $.toast('不能邀请自己');
                        return;
                    }
                    if (res.S == -2) {
                        $.toast('您要加油啦');
                        return;
                    }
                    if (res.S == -1) {
                        $.toast('活动已结束');
                        return;
                    }
                    if (res.S == 101) { //登录框弹出
                        $login.fadeIn(time);
                        return;
                    }
                    $.toast('领取失败,请重试');
                },
                error: function() {
                    getStatus = true;
                    $.toast('领取失败,请重试');
                }
            });
        }
    $gameOver.on('click', 'button', function() {
        getRedbag();
    });
    /*
    * 登录注册功能
    *
    * */
    //tab切换
    $login.on('click', '.title span', function() {
        var $this = $(this),
            index = $this.index();
        $this.addClass('on').siblings().removeClass('on');
        $login.find('.content').eq(index).show().siblings('.content').hide();
    });
    $login.on('click', '.cancel', function() {
        $login.fadeOut(time);
    });
    //获取分享数据
    function getShare(){
        $.ajax({
            url: "/Other/GetShareData",
            type: "get",
            dataType: "json",
            success: function (jdata) {
                if (jdata !== '' && jdata != null) {
                    var objData = jdata,
                        link = 'http://np.94bank.com/Activity/RoosterGame20170126?';
                    if (!objData.friendMemberId) {
                        objData.friendMemberId = bk.Utils.GetQueryString('friendMemberId');
                    }
                    if (objData.friendMemberId) {
                        link += 'friendMemberId=' + objData.friendMemberId;
                    }
                    bk.shareWinxin({
                        'title': '玩游戏领百万年终奖！',
                        'desc': '1月26至1月30日，畅玩94鸡年步步高小游戏可获得超值年终奖，邀请好友福利再上一层楼，快来吧~',
                        'link': link,
                        'imgUrl': path + 'share-jumpgame.jpg'
                    });
                }
            }
        });
    }
    getShare();
    //登录成功后的回调方法
    $.loginCallback = function() {
        $login.fadeOut(time);
        getRedbag('login');
        getShare();
    };

    //登录注册
    new loginRegist();
}(window, document, Zepto, JSBK));