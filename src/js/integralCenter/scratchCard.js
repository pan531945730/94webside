$(document).ready(function(e) {
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../component/website/Load.css');
    require('../../css/integralCenter/scratchCard.css');
    var alert = require('../../ui/Alert.js');
    var Blink = require('../../ui/Blink.js');
    var scratch = require('../../ui/scratch.js');
    var ruleHtml = '<h2>刮刮乐规则</h2>' +
        '<p>① 投资新手宝、优选计划及9盈宝90天，可获得投资金额的0.8%的积分；</p>' +
        '<p>② 投资9盈宝365天及720天，可获得投资金额的1%的积分；</p>' +
        '<p>③ 投资基金宝可获得投资金额的0.2%的积分；</p>' +
        '<p>④ 投资银行宝无积分；</p>' +
        '<p>⑤ 每投资新手宝、9盈宝及基金宝产品一次即可获得一次刮刮乐机会；</p>' +
        '<p>⑥ 投资成功后未刮取的机会将累计，刮刮乐机会采取年度清零的方式，即当年度获得的刮刮乐机会，本年度底统一过期。</p>';

    var ruleAlert = new alert({
        titleHtml: ruleHtml,
        btnHtml: '知道啦'
    })

    // 规则
    $('.sc-rule').on('click', function() {
        ruleAlert.open();
    })

    var scChance = $('.sc-chance'),
        scratchNochace = $('.scratch-nochace'),
        scratchGold = $('.scratch-gold'),
        scratch = $('#scratch'),
        mbLoad = $('.load'),
        award = $('#award'),
        againScratch = $('#again_scratch'),
        drawNum = 0,
        exScratch = false,
        noAgain = false;
    var scratchFn = scratch.scratch({
        img: 'transparent',
        radius: 80,
        width: 600,
        height: 140,
        checkRange: [0, 0, 600, 140],
        defaultImg: $('img').eq(0).get(0)
    });

    var drawNumData = {
        data: {},
        mFun: 'GetGuaLeDrawNum',
        beforeFun: function() {},
        sucFun: function(v) {
            mbLoad.hide();
            drawNum = v;
            scChance.show().find('span').html(drawNum);
            if (v == '0') {
                noScratchFn();
            } else {
                exScratch = true;
            }
        },
        unusualFun: function(v) {
            mbLoad.hide();
        }
    }

    //刮刮执行
    scratch.on('touchmove', function() {
        if (!exScratch) {
            return
        }
        JSBK.Utils.postAjax(drawData);
        exScratch = false;
    });
    //结束执行
    scratch.scratch('on', 'finish', function() {
        scratch.hide()
    });

    //页面初始状态
    mbLoad.show();
    scratch.css('pointer-events', 'none')
    setTimeout(function() {
        //判断是否登录
        JSBK.bindToken(function() {
            scratch.css('pointer-events', 'auto');
            //已登录
            JSBK.Utils.postAjax(drawNumData);
        })
    }, 5000)

    var drawData = {
        data: {},
        mFun: 'GuaLeDraw',
        beforeFun: function() {
            mbLoad.show();
        },
        sucFun: function(v) {
            mbLoad.hide();
            var status = v.status;
            if (status == 1) {
                //刮奖成功
                scratchGold.show();
                award.html(v.awardScratch.earnintegral);
                exScratch = false;
                //最后一次时的判断
                var scChanceNum = scChance.find('span').html();
                if (scChanceNum > 0) {
                    scChance.find('span').html(--scChanceNum);
                }
                if (scChanceNum == 0) {
                    againScratch.html('立即投资获得刮奖机会')
                    noAgain = true;
                }
            } else if (status == 2) {
                //无可用刮奖机会
                noScratchFn();
                noRewardsBlink.open();
            } else {
                // 刮奖失败
                scratchGold.show().html('刮奖失败');
            }
        },
        unusualFun: function(v) {
            mbLoad.hide();
        }
    }

    againScratch.on('click', function() {
        scratch.show();
        scratchFn.reset();
        exScratch = true;
    })

    //无积分弹出框
    var noRewardsBlink = new Blink({
        blinkHtml: '您还没有刮奖机会，<br />点击【立即投资获得刮奖机会】!'
    })

    //没有可刮刮乐的状态
    function noScratchFn() {
        scratchNochace.show();
        againScratch.html('立即投资获得刮奖机会');
        noAgain = true;
    }

    $('#GoIntegralList').on('click', function() {
        JSBK.bindIntegralList();
    })

    againScratch.on('click', function() {
        if (noAgain) {
            JSBK.bindProductList();
        }
    })
});