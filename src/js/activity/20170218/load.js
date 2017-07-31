/*
 *  专属活动加载页
 *  日期：2017/2/16.
 *  作者：Math
 * */
;
require('../../../common/layout.js');
require('../../../component/website/Load.css');
require('../../../component/activity/20170218/wxShare.js');
(function(window, $) {
    var startTime = +new Date(2017, 1, 18), //活动开始时间
        endTime = +new Date(2017, 1, 19); //活动结束时间
    var data = {
        AID: '20170218',
        Action: 'isbind',
        SourceType: 1
    };
    $.ajax({
        type: 'post',
        dataType: 'json',
        url: window.Zepto.setUrl + '/api/Ajax',
        data: { D: JSON.stringify(data), M: 'ActivityMain' },
        success: function(res) {
            if (res.ST) {
                res.ST = res.ST.replace(/\-/g, '/');
            } else {
                res.ST = +new Date();
            }
            var nowTime = +new Date(res.ST);
        
            if (nowTime < startTime) { //未开始
                window.location.href = 'http://a.94bank.com/yd/index.html';
                return;
            }
            window.location.href = '/Activity/Exclusive20170218';
        }
    });
}(window, Zepto));