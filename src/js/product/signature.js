/*
 *签名
 *author:wangying
 *data:2016-11-14
 */
;
$(function() {
    //引入相关文件
    require('../../common/layout.css');
    require('../../common/layout.js');
    require('../../css/product/signature.css');
    //tradingId=2106478&productID=2521;

    //dom元素
    var dom = {
            signBox: $('#signBox'),
            signRe: $('#signRe'),
            signPut: $('#signPut'),
            erpa: $('#erpa'),
            tipsError: $('#tipsError')
        },
        event = 'ontouchend' in document ? 'touchstart' : 'click',
        tradingId = JSBK.Utils.GetQueryString('tradingId'),
        productId = JSBK.Utils.GetQueryString('productID'),
        canvasW = dom.signBox.width(),
        isSign = false, //是否签名
        versions = 12345,
        configs = 'formal', //test:测试  develop:开发 formal:正式
        configUrl;

    /*
     *当前所在服务器
     */
    function isConfigs(val) {
        if (val == 'test') {
            configUrl = 'http://192.168.2.22:826' //测试
        } else if (val == 'develop') {
            configUrl = 'http://192.168.2.13:8011' //开发
        } else if (val == 'formal') {
            configUrl = 'http://d.94bank.com' //正式
        }
    }
    isConfigs(configs);

    //购买详情链接
    if (tradingId) {
        var erpaUrl = configUrl + '/productdetail/GetTradingByContract?TradingID=' + tradingId + '&v=' + versions;
        dom.erpa.attr('href', erpaUrl);
    }

    /*
     *签名
     */

    //生成画布
    dom.signBox.css({
        width: canvasW,
        height: canvasW / 2
    });
    dom.signBox.jqSignature({
        width: canvasW,
        height: canvasW / 2,
        border: '1px solid transparent'
    });

    //保存
    dom.signPut.on(event, function() {
        //dataUrl是图片64位数据，放在src属性里，就能显示图片
        var dataUrl = dom.signBox.jqSignature('getDataURL').split(',')[1]; //去掉头，留下流数据
        var signData = {
            data: {
                TradingId: tradingId,
                SignImg: dataUrl
            },
            mFun: 'GetMemberSign',
            sucFun: function(v) {
                window.location.href = '/Order/SignatureComplete?tradingId=' + v.TradingId;
            },
            unusualFun: function(v) {
                dialogError(v.ES);
            }
        }
        if (isSign) {
            if (tradingId) {
                JSBK.Utils.postAjax(signData);
            } else {
                var msg = "没有交易，无法签名!";
                dom.tipsError.show().html(msg);
            }
        } else {
            var msg = "请写入签名!";
            dom.tipsError.show().html(msg);
        }
    });

    //是否在写入签名
    dom.signBox.on(event, function() {
        isSign = true;
    })

    //重签
    dom.signRe.on(event, function() {
        isSign = false;
        dom.signBox.jqSignature('clearCanvas');
    });

    /*
     *错误弹出框
     */
    function dialogError(content) {
        var errorAlert = new Alert({
            titleHtml: content,
            clickBtnCallback: function() {
                errorAlert.dialog.close();
            }
        });
        errorAlert.open();
    }
});