;
$(function() {
    require('../../../common/layout.css');
    require('../../../common/layout.js');
    require('../../../component/activity/toast.css');
    var toast = require('../../../component/activity/toast.js');
    require('../../../css/activity/20170218/special218.css');
    require('../../../component/activity/20170218/wxShare.js');
    //解锁
    var num = JSBK.Utils.GetQueryString('id') || '1', //哪一期
        $acUnlock = $('.ac-unlock'),
        startTime = +new Date(2017, num*1, 18), //活动开始时间
        endTime = +new Date(2017, num*1, 19), //活动结束时间
        nowTime; //当前服务器时间
        var action = 'getlightstatus';
    var unlockedData = {
        data: {
            AID: '20170218',
            Action: 'getlightstatus',
            SourceType: num
        },
        mFun: 'ActivityMain',
        sucFun: function(res) {
            res.ST = res.ST || +new Date();
            nowTime = +new Date(res.ST);
            if (nowTime > endTime) { //已过期
                unlocked(2);
                return;
            }
            if (action == 'getlightstatus') { //-1(非专属会员), 0(未点亮），1（已点亮）
                if (res.Status === 0) {

                } else if (res.Status == 1) {
                    unlocked(1);
                } else if (res.Status == -1) {
                    toast('您不是专属会员，不能参与活动');
                } else {
                    toast(res.Message);
                }
            } else { //-1(非专属会员), 0(点亮成功），1（已点亮）
                if (res.Status === 0) {
                    unlocked(1);
                } else if (res.Status == 1) {
                    unlocked(1);
                } else if (res.Status == -1) {
                    toast('您不是专属会员，不能参与活动');
                } else {
                    toast(res.Message);
                }
            }
        },
        unusualFun: function(v) {
            toast(v.ES);
        },
        notLogged: function() {
            if (action == 'light') { 
                window.location.href = '/Activity/Exclusive20170218';
            }
        }
    };
    function unlocked(i) {
        $acUnlock.data('disabled', 'yes');
        $acUnlock.removeClass('unlock');
        $acUnlock.find('img').hide();
        $acUnlock.find('img').eq(i).show();
    }
    $acUnlock.on('click', function(){
        if ($acUnlock.data('disabled')) {
            return;
        }
        if (nowTime && nowTime < startTime) { //未开始
            toast('活动未开始');
            return;
        }
        action = unlockedData.data.Action = 'light';
        JSBK.Utils.postAjax(unlockedData);
    });
    JSBK.Utils.postAjax(unlockedData);
});