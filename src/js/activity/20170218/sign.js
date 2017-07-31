/*
 *  专属会员签到
 *  日期：2017/2/14.
 *  作者：Math
 * */
;
require('../../../common/layout.css');
require('../../../common/layout.js');
require('../../../component/activity/toast.css');
var toast = require('../../../component/activity/toast.js');
require('../../../css/activity/20170218/sign.css');
require('../../../component/activity/20170218/wxShare.js');
(function(window, document, $, JSBK) {

    /*
     * 专属福利
     * */
    var $WhatBoon = $('#WhatBoon'),
        $boonTip = $('#boonTip'),
        $signCon = $('#signCon'),
        $signBtn = $('#signBtn'),
        nowTime = 0; //当前服务器时间
    $WhatBoon.on('click', function() {
        $boonTip.fadeIn();
    });
    $boonTip.on('touchstart', function() {
        $boonTip.fadeOut();
    });
    if (!JSBK.Utils.getCookie('boontip')) {
        JSBK.Utils.setCookie('boontip', 'yes', 36500);
        $boonTip.fadeIn();
    }
    //参与本期活动
    $signCon.on('click', '.ing-outer', function() {
        var num = $(this).closest('.item').data('id'),
            urlparse = num + 1;
        if (nowTime < dateData[num][0]) { //未开始
            //window.location.href = 'http://a.94bank.com/yd/index.html';
            window.location.href = '/Activity/CountDown20170218';
        } else {
            window.location.href = '/Activity/Special' + urlparse + '1820170' + urlparse + '18?id=' + num;
        }
    });
    $signCon.on('click', '.expire, .open', function() {
        var num = $(this).closest('.item').data('id'),
            urlparse = num + 1;
        window.location.href = '/Activity/Special' + urlparse + '1820170' + urlparse + '18?id=' + num;
    });
    /*
     * 累加当前时间
     * */
    function addNowTime() {
        nowTime = nowTime || +new Date();
        setTimeout(function() {
            nowTime += 1000;
            addNowTime();
        }, 1000);
    }
    /*
     * 获取签到数据
     * */
    function getSign() {
        var sucData = {
            data: {
                AID: '20170218',
                Action: 'getlevel',
                SourceType: 1
            },
            mFun: 'ActivityMain',
            sucFun: function(res) {
                if (res.Status === 0) {
                    res.ST = res.ST || +new Date();
                    nowTime = +new Date(res.ST);
                    addNowTime();
                    try {
                        res.Message = JSON.parse(res.Message);
                    } catch (e) {
                        res.Message = {};
                    }
                    sign(res.Message, nowTime);
                } else {
                    toast('您不是专属会员，不能参与活动');
                }
            },
            unusualFun: function(v) {
                toast(v.ES);
            },
            notLogged: function() {
                //$signCon.on('click', '.item', function() {
                window.location.href = '/Activity/Exclusive20170218';
                //});
            }
        }
        JSBK.Utils.postAjax(sucData);
    };
    /*
     * 签到状态展示
     * 四种状态分别为：锁定、待点亮、点亮、过期
     * */
    //12期日期列表，数组第一项为起始时间，第二项为结束时间
    var dateData = {
        '0': [0, 0]
    };
    (function() {
        for (var i = 0; i < 12; i++) {
            dateData[i + 1] = [+new Date(2017, 1 + i, 18), +new Date(2017, 1 + i, 19)];
        }
    }());
    /*
     * 签到方法
     * @param data {object} 签到数据列表
     * @param nowTime {number} 当前服务器时间
     * @return {object} 四种状态分别为：1锁定、2待点亮、3点亮、4过期
     * */
    function sign(data, nowTime) {
        if (!data || typeof(data) !== 'object') {
            return;
        }
        var obj = {};
        for (var i = 1; i < 13; i++) {
            if (data[i]) {
                obj[i] = 3;
            } else {
                if (nowTime > dateData[i][1]) {
                    obj[i] = 4;
                    continue;
                }
                if (nowTime <= dateData[i][1] && nowTime >= dateData[i][0]) {
                    obj[i] = 2;
                    continue;
                }
                if (nowTime < dateData[i][0] && nowTime > dateData[i - 1][1]) {
                    obj[i] = 2;
                    continue;
                }
                if (nowTime < dateData[i][0]) {
                    obj[i] = 1;
                    continue;
                }
            }
        }
        signHtml(obj);
        return obj;
    }
    $.sign = sign;
    /*
     * 生成签到html
     * */
    function signHtml(data) {
        if (!data) {
            return;
        }
        var html = '';
        for (var i = 1; i < 13; i++) {
            var str = data[i];
            if (str == 1) {
                html += '<div class="item" data-id="' + i + '"><i class="lock"></i></div>';
            } else if (str == 2) {
                html += '<div class="item" data-id="' + i + '"><i class="ing-light"></i><i class="ing"></i><i class="ing-inner"></i><i class="ing-outer"></i></div>';
            } else if (str == 3) {
                html += '<div class="item" data-id="' + i + '"><i class="ing-light"></i><i class="open"></i></div>';
            } else if (str == 4) {
                html += '<div class="item" data-id="' + i + '"><i class="expire"></i></div>';
            }
        }
        html += '<span class="sign-gift"></span>';
        $signCon.html(html);
    }
    //初始化
    getSign();
}(window, document, Zepto, JSBK));