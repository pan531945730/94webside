;
$(function() {
    require('../../../common/layout.css');
    require('../../../common/layout.js');
    require('../../../css/activity/20170518/special518.css');   
    
    var num = JSBK.Utils.GetQueryString('id') || '4', //哪一期
        light = $('.light'),
        startTime = +new Date(2017, num*1, 18), //活动开始时间
        endTime = +new Date(2017, num*1, 19), //活动结束时间
        nowTime,//当前服务器时间
        dlgMask = $('.dlg-mask');

    function toast(txt,interval){
        dlgMask.show().find('.dlg-info').html(txt);
        setTimeout(function(){
            dlgMask.hide();
        },interval || 1000)
    }

    //初始化
    var initData = {
        data: {
            AID: '20170518',
            Action: 'getlightstatus',
            SourceType: num
        },
        mFun: 'ActivityMain',
        sucFun: function(res) {
            res.ST = res.ST || +new Date();
            nowTime = +new Date(res.ST);
            if (nowTime > endTime) { //已过期
                light.html('已结束');
                return;
            }
            //-1(非专属会员), 0(未点亮），1（已点亮）
            if (res.Status === 0) {
                light.html('点亮表情').addClass('locked');
            } else if (res.Status == 1) {
                light.html('已点亮');
            } else if (res.Status == -1) {
                toast('您不是专属会员，不能参与活动');
            } else {
                toast(res.Message);
            }
        },
        unusualFun: function(v) {
            toast(v.ES);
        },
        notLogged: function() {
            window.location.href = '/Activity/Exclusive20170218';
        }
    };
    JSBK.Utils.postAjax(initData);

    $('.spe-head').on('click','.locked',function(){
        var unlockedData = {
            data: {
                AID: '20170518',
                Action: 'light',
                SourceType: num
            },
            mFun: 'ActivityMain',
            sucFun: function(res) {
                res.ST = res.ST || +new Date();
                nowTime = +new Date(res.ST);
                if (nowTime > endTime) { //已过期
                    light.html('已结束');
                    return;
                }
                //-1(非专属会员), 0(点亮成功），1（已点亮）
                if (res.Status === 0) {
                    toast('本月表情已点亮，集齐12个表情可获终极大礼哦~');
                    light.html('已点亮');
                } else if (res.Status == 1) {
                    light.html('已点亮');
                } else if (res.Status == -1) {
                    toast('您不是专属会员，不能参与活动');
                } else {
                    toast(res.Message);
                }
            },
            unusualFun: function(v) {
                toast(v.ES);
            },
            notLogged: function() {
                window.location.href = '/Activity/Exclusive20170218';
            }
        };
        JSBK.Utils.postAjax(unlockedData);
    });    
    //微信分享
    JSBK.shareWinxin({
        'title': '5月专属日，轻松即可点亮本月小表情，另外还有518理财狂欢“月月增”专属产品，最高至10%。继续解锁12个表情，离终极大奖更进一步噢~',
        'desc': '5月专属日，轻松即可点亮本月小表情，另外还有518理财狂欢“月月增”专属产品，最高至10%。继续解锁12个表情，离终极大奖更进一步噢~',
        'link': 'http://np.94bank.com/Activity/Special51820170518',
        'imgUrl': window.Zepto.linkUrl+'/dist/Activity/img/20170518/special518/share.png'
    }) 
});